import * as bcrypt from "bcryptjs";
import { UserEntity, UserUpdateData } from "../../../domain/user/user.entity";
import { UserRepository } from "../../../domain/user/user.repository";
import { SequelizeUser } from "../../model/user/user.model";
import { createToken } from "../../services/jwt.service";
import { AuthService } from '../../services/auth-service.service';
import { EmailService } from '../../services/email-service.service';
import { generateToken, hashToken, calculateExpiration } from '../../services/token-service.service';
import { Op } from 'sequelize';

export class SequelizeRepository implements UserRepository {
    async getUsers(): Promise<UserEntity[] | null> {
        try {
            const users = await SequelizeUser.findAll();
            if(!users) {
                throw new Error(`No hay usuarios`);
            };
            return users;
        } catch (error: any) {
            console.error('Error en getUsers:', error.message);
            throw error;
        }
    }
    async findUserById(usr_uuid: string): Promise<UserEntity | null> {
        try {
            const user = await SequelizeUser.findOne({ 
                where: { 
                    usr_uuid: usr_uuid ?? null
                }
            });
            if(!user) {
                throw new Error(`No hay usuario con el Id: ${usr_uuid}`);
            };
            return user.dataValues;
        } catch (error: any) {
            console.error('Error en findUserById:', error.message);
            throw error;
        }
    }
    async findUserByEmail(usr_email: string): Promise<UserEntity | null> {
        try {
            const user = await SequelizeUser.findOne({ 
                where: { 
                    usr_email: usr_email ?? null
                }
            });
            if(!user) {
                throw new Error(`No hay usuario con el email: ${usr_email}`);
            };
            return user.dataValues;
        } catch (error: any) {
            console.error('Error en findUserByEmail:', error.message);
            throw error;
        }
    }
    async registerUser(user: UserEntity): Promise<UserEntity | null> {
        throw new Error("Method not implemented.");
    }
    async updateUser(usr_uuid: string, user: UserUpdateData): Promise<UserEntity | null> {
        try {
            const [updatedCount, [updatedUser]] = await SequelizeUser.update(
                { 
                    usr_name: user.usr_name,
                    usr_surname: user.usr_surname,
                    usr_password: user.usr_password,
                    usr_image: user.usr_image,
                    usr_email: user.usr_email,
                    usr_nick: user.usr_nick,
                    usr_bio: user.usr_bio,
                    usr_registered: user.usr_registered,
                    usr_socket: user.usr_socket,
                    usr_online: user.usr_online,
                    usr_sysadmin: user.usr_sysadmin
                }, 
                { 
                    where: { usr_uuid },
                    returning: true, // necesario en PostgreSQL
                }
            );
            if (updatedCount === 0) {
                throw new Error(`No se ha actualizado el usuario`);
            };
            return updatedUser.get({ plain: true }) as UserEntity;
        } catch (error: any) {
            console.error('Error en updateUser:', error.message);
            throw error;
        }
    }
    async deleteUser(usr_uuid: string): Promise<UserEntity | null> {
        try {
            const user = await this.findUserById(usr_uuid);
            const result = await SequelizeUser.destroy({ 
                where: { 
                    usr_uuid: usr_uuid ?? null
                } 
            });
            if(!result) {
                throw new Error(`No se ha eliminado el usuario`);
            };
            return user;
        } catch (error: any) {
            console.error('Error en deleteUser:', error.message);
            throw error;
        }
    }
    async userExist(usr_nick: string, usr_email: string): Promise<UserEntity | null> {
        try {
            const user = await SequelizeUser.findOne({ 
                where: { 
                    usr_nick: usr_nick ?? null,
                    usr_email: usr_email ?? null
                } 
            });
            return user;
        } catch (error: any) {
            console.error('Error en userExist:', error.message);
            throw error;
        }
    }
    async loginUser(usr_nick: string, usr_password: string, gettoken: boolean): Promise<UserEntity | String | null> {
        try {
            const user = await SequelizeUser.findOne({ 
                where: { 
                    usr_nick: usr_nick ?? null
                }
            });            
            if(!user) {
                throw new Error(`No hay usuario con el nombre ${usr_nick}`);
            }
            
            if(!user.usr_confirmed) {
                throw new Error(`El usuario con el nombre ${usr_nick} no se encuentra confirmado`);
            } 
            
            const isPasswordValid = await bcrypt.compare(usr_password, user.dataValues.usr_password);
            if(!isPasswordValid) {
                throw new Error('El password es incorrecto');
            }
            
            if(gettoken) {
                return createToken(user.dataValues);
            }
            
            user.dataValues.usr_password = '';
            return user.dataValues as UserEntity;

        } catch (error: any) {
            console.error('Error en loginUser:', error.message);
            throw error;
        }
    }
    async saveUser(user: UserEntity): Promise<UserEntity | null> {
        try {
            
            const authService = new AuthService(process.env.JWT_SECRET || 'default_secret');
            const emailService = new EmailService();

            let { usr_uuid, usr_name, usr_surname, usr_password, usr_image, usr_email, usr_nick, usr_bio, usr_registered, usr_socket, usr_online, usr_confirmed, usr_confirmationtoken, usr_resetpasswordtoken, usr_resetpasswordexpires, usr_sysadmin, usr_createdat, usr_updatedat } = user;

            const userExist = await SequelizeUser.findOne({ 
                where: {
                    [Op.or]: [
                        {
                            usr_nick: usr_nick ?? null
                        },
                        {
                            usr_email: usr_email ?? null
                        }
                    ]
                }
            });
            
            if(userExist) {
                throw new Error(`Ya existe un usuario con el nombre: ${usr_nick} y email: ${usr_email}`);
            }

            // Encriptar la contraseña
            const salt = await bcrypt.genSalt(10);
            usr_password = await bcrypt.hash(usr_password, salt);

            const result = await SequelizeUser.create({ usr_uuid, usr_name, usr_surname, usr_password, usr_image, usr_email, usr_nick, usr_bio, usr_registered, usr_socket, usr_online, usr_confirmed, usr_confirmationtoken, usr_resetpasswordtoken, usr_resetpasswordexpires, usr_sysadmin, usr_createdat, usr_updatedat });
            
            if (!result) {
                throw new Error('No se ha registrado el usuario');
            }
    
            // Generar el token de confirmación usando AuthService
            const confirmationToken = authService.generateConfirmationToken(usr_email);
    
            // Guardar el token en la base de datos (opcional)
            await SequelizeUser.update(
                { usr_confirmationtoken: confirmationToken },
                { where: { usr_uuid } }
            );
    
            // Enviar el correo de confirmación usando EmailService
            try {
                await emailService.sendConfirmationEmail(usr_email, confirmationToken);
            } catch (emailError) {
                console.error('Error al enviar el correo de confirmación:', emailError);
                // No lanzamos un error aquí para permitir que el usuario sea creado
            }
    
            // Devolver el nuevo usuario
            return result.dataValues as SequelizeUser;
        } catch (error: any) {
            console.error('Error al guardar el usuario:', error);
            throw error; // La función ya devuelve una Promise, así que el error se propagará automáticamente
        }
    }
    async setSocketUser( usr_uuid: string, usr_socket: string, usr_online: boolean = true ): Promise<UserEntity | null> {
        try {
            //let { usr_uuid, usr_socket, usr_online } = user
            const result = await SequelizeUser.update({ usr_socket, usr_online }, { where: { usr_uuid } });
            const user = this.findUserById(usr_uuid);
            if(result[0] < 1) {
                throw new Error(`No se ha podido actualizar el socket`);
            };
            return user;
        } catch (error: any) {
            console.error('Error en setSocketUser:', error.message);
            throw error;
        }
    };
    async confirmAccount( usr_confirmationtoken: string ): Promise<UserEntity | null> {

        const authService = new AuthService(process.env.JWT_SECRET || 'default_secret');

        if (!usr_confirmationtoken) {
            throw new Error('Token de confirmación no proporcionado.');
        }
    
        try {
            // Verificar el token usando AuthService
            const decoded = authService.verifyToken(usr_confirmationtoken.toString()) as { email: string };
    
            // Buscar al usuario por su correo electrónico
            const user = await SequelizeUser.findOne({ where: { usr_email: decoded.email } });
    
            if (!user) {
                throw new Error('Usuario no encontrado.');
            }
    
            // Confirmar la cuenta
            await SequelizeUser.update({ usr_confirmed: true }, { where: { usr_email: decoded.email } });
    
            // Obtener el usuario actualizado desde la base de datos
            const updatedUser = await SequelizeUser.findOne({
                where: { usr_email: decoded.email },
                attributes: {
                    exclude: ['usr_password'], // Excluir campos sensibles como la contraseña
                },
            });

            if (!updatedUser) {
                throw new Error('Error al recuperar el usuario actualizado.');
            }

            return updatedUser;
        } catch (error: any) {
            console.error('Error al confirmar la cuenta:', error.message);
            throw new Error('El token de confirmación es inválido o ha expirado.');
        }
    }; 
    async forgotPassword( user: UserEntity ): Promise<UserEntity | null> {
        try {
            const emailService = new EmailService();

            // Generar un token único para restablecer la contraseña
            const resetToken = generateToken();
            const hashedToken = hashToken(resetToken);
            const expiration = calculateExpiration();

            await SequelizeUser.update(
                { usr_resetpasswordtoken: hashedToken, usr_resetpasswordexpires: expiration },
                { where: { usr_uuid: user.usr_uuid } }
            );

            // Enviar el correo de confirmación usando EmailService
            try {
                await emailService.sendReestablishmentEmail(user.usr_email, hashedToken);
            } catch (emailError) {
                console.error('Error al enviar el correo para reestablecer el email:', emailError);
                throw new Error('Error al enviar el correo para reestablecer el email:');
            }
    
            // Devolver el usuario
            return user;
        } catch (error: any) {
            console.error('Error al guardar el token:', error.message);
            throw new Error('Error al guardar el token de restablecimiento.');
        }
    };
    async findUserByResetToken( token: string, expirationDate: Date ): Promise<UserEntity | null> {
        try {
            const user = await SequelizeUser.findOne({
              where: {
                usr_resetpasswordtoken: token,
                usr_resetpasswordexpires: { [Op.gt]: expirationDate }, // Verifica que el token no haya expirado
              },
            });
            return user;
        } catch (error) {
            throw new Error('Error al buscar el usuario por token.');
        }
    };
    async findUserByNick( usr_nick: string ): Promise<UserEntity | null> {
        try {
            const user = await SequelizeUser.findOne({
              where: {
                usr_nick: usr_nick
              },
            });
            return user;
        } catch (error) {
            throw new Error('Error al buscar el usuario por nick.');
        }
    };
    async findSocketUser( usr_uuid: string ): Promise<string | null> {
        try {
            const user = await SequelizeUser.findOne({
              where: {
                usr_uuid: usr_uuid
              },
              attributes: ["usr_socket"]
            });
            // Si no se encuentra el usuario, retornamos null
            if (!user) {
                return null;
            }

            // Extraemos el valor del atributo "userId" y lo retornamos
            return user.getDataValue("usr_socket");
        } catch (error) {
            throw new Error('Error al buscar el socket del usuario.');
        }
    };
    async updatePassword( usr_uuid: string, newPassword: string ): Promise<void> {
        try {
            console.info('USER REPOSITORY', usr_uuid, newPassword)
            const hashedPassword = await bcrypt.hash(newPassword, 10); // Cifra la nueva contraseña
            await SequelizeUser.update(
                {
                    usr_password: hashedPassword,
                    usr_resetpasswordtoken: null, // Limpia el token
                    usr_resetpasswordexpires: null, // Limpia la fecha de expiración
                },
                { where: { usr_uuid: usr_uuid } }
            );
        } catch (error) {
            throw new Error('Error al actualizar la contraseña.');
        }
    };
}