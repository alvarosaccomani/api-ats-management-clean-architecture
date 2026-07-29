import * as bcrypt from "bcryptjs";
import { AuthRepository } from "../../../domain/auth/auth.repository";
import { UserEntity } from "../../../domain/user/user.entity";
import { SequelizeUser } from "../../model/user/user.model";
import { createToken } from "../../services/jwt.service";
import { AuthService } from "../../services/auth-service.service";
import { EmailService } from "../../services/email-service.service";
import { generateToken, hashToken, calculateExpiration } from "../../services/token-service.service";
import { Op } from "sequelize";

export class SequelizeAuthRepository implements AuthRepository {
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
            
            // Validar confirmación contra el Kernel Central
            try {
                const centralCheckUrl = (process.env.CENTRAL_API_URL ? process.env.CENTRAL_API_URL.replace('/auth/sso/verify', '/auth/sso/check-status') : null) || 'http://localhost:3006/api/auth/sso/check-status';
                const checkRes = await fetch(`${centralCheckUrl}?email=${encodeURIComponent(user.dataValues.usr_email)}`);
                const checkData = await checkRes.json() as any;
                if (!checkRes.ok || checkData.success === false) {
                    throw new Error(checkData.message || 'No se pudo verificar el estado del usuario en el Kernel Central.');
                }
                if (!checkData.usr_confirmed) {
                    throw new Error('El usuario no se encuentra confirmado');
                }
            } catch (err: any) {
                console.error('Error al verificar confirmación en Central:', err.message);
                throw new Error(err.message || 'Error de conexión con el Kernel Central para validar el estado de confirmación.');
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

    async confirmAccount( usr_confirmationtoken: string ): Promise<UserEntity | null> {
        throw new Error('La confirmación de cuenta se realiza a través del Kernel Central.');
    }

    async forgotPassword( user: UserEntity ): Promise<UserEntity | null> {
        try {
            const emailService = new EmailService();

            const resetToken = generateToken();
            const hashedToken = hashToken(resetToken);
            const expiration = calculateExpiration();

            await SequelizeUser.update(
                { usr_resetpasswordtoken: hashedToken, usr_resetpasswordexpires: expiration },
                { where: { usr_uuid: user.usr_uuid } }
            );

            try {
                await emailService.sendReestablishmentEmail(user.usr_email, hashedToken);
            } catch (emailError) {
                console.error('Error al enviar el correo para reestablecer el email:', emailError);
                throw new Error('Error al enviar el correo para reestablecer el email.');
            }
    
            return user;
        } catch (error: any) {
            console.error('Error en forgotPassword:', error.message);
            throw new Error('Error al guardar el token de restablecimiento.');
        }
    }

    async findUserByResetToken( token: string, expirationDate: Date ): Promise<UserEntity | null> {
        try {
            const user = await SequelizeUser.findOne({
              where: {
                usr_resetpasswordtoken: token,
                usr_resetpasswordexpires: { [Op.gt]: expirationDate },
              },
            });
            return user ? (user.dataValues as UserEntity) : null;
        } catch (error) {
            throw new Error('Error al buscar el usuario por token.');
        }
    }

    async updatePassword( usr_uuid: string, newPassword: string ): Promise<void> {
        try {
            const hashedPassword = await bcrypt.hash(newPassword, 10);
            await SequelizeUser.update(
                {
                    usr_password: hashedPassword,
                    usr_resetpasswordtoken: null,
                    usr_resetpasswordexpires: null,
                },
                { where: { usr_uuid: usr_uuid } }
            );
        } catch (error) {
            throw new Error('Error al actualizar la contraseña.');
        }
    }
}
