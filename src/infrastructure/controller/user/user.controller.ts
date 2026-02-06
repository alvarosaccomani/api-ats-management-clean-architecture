import { Request, Response } from "express";
import { UserUseCase } from "../../../application/user/user-use-case";
import SocketAdapter from "../../services/socketAdapter";
import { paginator } from "../../services/paginator.service";

export class UserController {
    constructor(private userUseCase: UserUseCase, private socketAdapter: SocketAdapter) {
        this.getAllCtrl = this.getAllCtrl.bind(this);
        this.getCtrl = this.getCtrl.bind(this);
        this.insertCtrl = this.insertCtrl.bind(this);
        this.updateCtrl = this.updateCtrl.bind(this);
        this.deleteCtrl = this.deleteCtrl.bind(this);
        this.loginCtrl = this.loginCtrl.bind(this);
        this.saveCtrl = this.saveCtrl.bind(this);
        this.confirmCtrl = this.confirmCtrl.bind(this);
        this.forgotCtrl = this.forgotCtrl.bind(this);
        this.resetCtrl = this.resetCtrl.bind(this);
    }

    public async getAllCtrl(req: Request, res: Response) {
        try {
            const page = (req.params.page ? parseInt(req.params.page) : null);
            const perPage = (req.params.perPage ? parseInt(req.params.perPage) : null);
            if (page && perPage) {
                const users = await this.userUseCase.getUsers()
                return res.status(200).send({
                    success: true,
                    message: 'Usuarios retornados.',
                    ...paginator(users, page.toString(), perPage.toString())
                });
            } else {
                const users = await this.userUseCase.getUsers()
                return res.status(200).send({
                    success: true,
                    message: 'Usuarios retornados.',
                    data: users
                });
            }
        } catch (error: any) {
            console.error('Error en getAllCtrl (controller):', error.message);
            return res.status(400).json({
                success: false,
                message: 'No se pudo recuperar los usuarios.',
                error: error.message, // Mensaje claro del error
            });
        }
    }

    public async getCtrl(req: Request, res: Response) {
        try {
            const usr_uuid = req.params.usr_uuid;
            if(!usr_uuid || usr_uuid.toLowerCase() === 'null' || usr_uuid.toLowerCase() === 'undefined') {
                return res.status(400).json({
                    success: false,
                    message: 'No se pudo recuperar el usuario.',
                    error: 'Debe proporcionar un Id de usuario.'
                });
            }
            const user = await this.userUseCase.getDetailUser(`${usr_uuid}`)
            return res.status(200).send({
                success: true,
                message: 'Usuario retornado.',
                data: user
            });
        } catch (error: any) {
            console.error('Error en getCtrl (controller):', error.message);
            return res.status(400).json({
                success: false,
                message: 'No se pudo recuperar el usuario.',
                error: error.message, // Mensaje claro del error
            });
        }
    }

    public async insertCtrl({ body }: Request, res: Response) {
        try {
            const usr_nick = body.usr_nick;
            const usr_email = body.usr_email;        
            if(!usr_nick) {
                return res.status(400).json({
                    success: false,
                    message: 'No se pudo insertar el usuario.',
                    error: 'Debe proporcionar un Nick para el usuario.'
                })
            }
            if(!usr_email) {
                return res.status(400).json({
                    success: false,
                    message: 'No se pudo insertar el usuario.',
                    error: 'Debe proporcionar un Email para el usuario.'
                })
            }
            const userExist = await this.userUseCase.userExist(usr_nick, usr_email);
            if(userExist) {
                return res.status(400).json({
                    success: false,
                    message: 'No se pudo insertar el usuario.',
                    error: 'El usuario ya existe.'
                });
            }
            const user = await this.userUseCase.registerUser(body)
            return res.status(200).json({
                success: true,
                message: 'Usuario insertado.',
                data: user
            });
        } catch (error: any) {
            console.error('Error en insertCtrl (controller):', error.message);
            return res.status(400).json({
                success: false,
                message: 'No se pudo insertar el usuario.',
                error: error.message, // Mensaje claro del error
            });
        }
    }

    public async updateCtrl(req: Request, res: Response) {
        try {
            const usr_uuid = req.params.usr_uuid;
            const update = req.body;
            if(!update.usr_nick) {
                return res.status(400).json({
                    success: false,
                    message: 'No se pudo actualizar el usuario.',
                    error: 'Debe proporcionar un Nick para el usuario.'
                })
            }
            if(!update.usr_email) {
                return res.status(400).json({
                    success: false,
                    message: 'No se pudo actualizar el usuario.',
                    error: 'Debe proporcionar un Email para el usuario.'
                })
            }
            const user = await this.userUseCase.updateUser(usr_uuid, update)
            return res.status(200).json({
                success: true,
                message: 'Usuario actualizado.',
                data: user
            });
        } catch (error: any) {
            console.error('Error en updateCtrl (controller):', error.message);
            return res.status(400).json({
                success: false,
                message: 'No se pudo actualizar el usuario.',
                error: error.message, // Mensaje claro del error
            });
        }
    }

    public async deleteCtrl(req: Request, res: Response) {
        try {
            const usr_uuid = req.params.usr_uuid;
            if(!usr_uuid) {
                return res.status(400).json({
                    success: false,
                    message: 'No se pudo eliminar el usuario.',
                    error: 'Debe proporcionar un Id de usuario.'
                });
            };
            const user = await this.userUseCase.deleteUser(usr_uuid)
            return res.status(200).json({
                success: true,
                message: 'Usuario eliminado.',
                data: user
            });
        } catch (error: any) {
            console.error('Error en deleteCtrl (controller):', error.message);
            return res.status(400).json({
                success: false,
                message: 'No se pudo eliminar el usuario.',
                error: error.message, // Mensaje claro del error
            });
        }
    }

    public async loginCtrl(req: Request, res: Response) {
        try {
            const { usr_user, usr_password, gettoken } = req.body;
            const result = await this.userUseCase.loginUser(usr_user, usr_password, gettoken);
    
            if (typeof result === 'string') {
                // Si el resultado es un token
                return res.status(200).json({
                    success: true,
                    message: 'Inicio de sesión exitoso.',
                    data: { token: result },
                });
            } else {
                // Si el resultado es un objeto de usuario
                return res.status(200).json({
                    success: true,
                    message: 'Inicio de sesión exitoso.',
                    data: result,
                });
            }
        } catch (error: any) {
            console.error('Error en loginUser (controller):', error.message);
            return res.status(400).json({
                success: false,
                message: 'No se pudo iniciar sesión.',
                error: error.message, // Mensaje claro del error
            });
        }
    }

    public async saveCtrl({ body }: Request, res: Response) {
        try {
            const user = await this.userUseCase.saveUser(body)
            res.send({user});
        } catch (error: any) {
            console.error('Error en saveCtrl (controller):', error.message);
            return res.status(400).json({
                success: false,
                message: 'No se pudo crear el usuario.',
                error: error.message, // Mensaje claro del error
            });
        }
    }

    public async confirmCtrl({ body }: Request, res: Response) {
        const token = body.token;
        const user = await this.userUseCase.confirmAccount(token)
        res.send({user});
    }

    public async forgotCtrl({ body }: Request, res: Response) {
        try {
            const usr_email = body.usr_email;

            if (!usr_email) {
                return res.status(400).json({
                    success: false,
                    message: 'El correo electrónico es obligatorio.',
                });
            }
            const user = await this.userUseCase.forgotPassword(usr_email);
            // Si el resultado es un objeto de usuario
            return res.status(200).json({
                success: true,
                message: 'El correo electrónico fue enviado correctamente.',
                data: user,
            });
        } catch (error: any) {
            console.error('Error en forgotCtrl (controller):', error.message);
            return res.status(400).json({
                success: false,
                message: 'No se pudo reestablecer la contraseña.',
                error: error.message, // Mensaje claro del error
            });
        }
    }

    public async resetCtrl({ body }: Request, res: Response) {
        try {
            const { token, newPassword } = body;

            if (!token || !newPassword) {
                return res.status(400).json({
                    success: false,
                    message: 'El token y la nueva contraseña son obligatorios.',
                });
            }

            // Verificar que el token no haya expirado
            const expirationDate = new Date();
            const user = await this.userUseCase.getUserByResetToken(token, expirationDate);

            if (!user) {
                return res.status(400).json({
                    success: false,
                    message: 'El token es inválido o ha expirado.',
                });
            }

            // Actualizar la contraseña del usuario
            await this.userUseCase.updatePassword(user.usr_uuid, newPassword);

            return res.status(200).json({
                success: true,
                message: 'Tu contraseña ha sido restablecida con éxito.',
            });

        } catch (error: any) {
            console.error('Error en resetCtrl (controller):', error.message);
            return res.status(500).json({
                success: false,
                message: 'Ocurrió un error al procesar la solicitud.',
            });
        }
    }
}