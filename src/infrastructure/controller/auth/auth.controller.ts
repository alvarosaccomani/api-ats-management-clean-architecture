import { Request, Response } from "express";
import { AuthUseCase } from "../../../application/auth/auth-use-case";
import { UserUseCase } from "../../../application/user/user-use-case";

export class AuthController {
    constructor(
        private authUseCase: AuthUseCase,
        private userUseCase: UserUseCase
    ) {
        this.loginCtrl = this.loginCtrl.bind(this);
        this.saveCtrl = this.saveCtrl.bind(this);
        this.confirmCtrl = this.confirmCtrl.bind(this);
        this.forgotCtrl = this.forgotCtrl.bind(this);
        this.resetCtrl = this.resetCtrl.bind(this);
        this.verifySSOTokenCtrl = this.verifySSOTokenCtrl.bind(this);
        this.getAppConfigCtrl = this.getAppConfigCtrl.bind(this);
        this.logAuthCtrl = this.logAuthCtrl.bind(this);
    }

    public async loginCtrl(req: Request, res: Response) {
        try {
            const { usr_user, usr_password, gettoken } = req.body;
            const result = await this.authUseCase.loginUser(usr_user, usr_password, gettoken);
    
            if (typeof result === 'string') {
                return res.status(200).json({
                    success: true,
                    message: 'Inicio de sesión exitoso.',
                    data: { token: result },
                });
            } else {
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
                error: error.message,
            });
        }
    }

    public async saveCtrl(req: Request, res: Response) {
        try {
            const body = req.body;
            const centralUrl = (process.env.CENTRAL_API_URL ? process.env.CENTRAL_API_URL.replace('/auth/sso/verify', '/register') : null) || 'http://localhost:3006/api/register';
            
            const centralRes = await fetch(centralUrl, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(body)
            });

            const centralData = await centralRes.json() as any;

            if (!centralRes.ok || (centralData.success === false)) {
                return res.status(400).json({
                    success: false,
                    message: centralData.message || 'No se pudo crear el usuario en el Kernel Central.',
                    error: centralData.error || centralData.message
                });
            }

            const centralUser = centralData.user;
            
            body.usr_uuid = centralUser.usr_uuid;
            body.usr_registered = new Date();
            body.usr_confirmed = true;
            body.usr_confirmationtoken = '';
            body.usr_resetpasswordtoken = '';
            body.usr_resetpasswordexpires = new Date();
            body.usr_socket = '';
            body.usr_online = false;

            const user = await this.userUseCase.registerUser(body);

            return res.status(200).json({
                success: true,
                message: 'Usuario registrado con éxito de forma unificada.',
                data: user
            });
        } catch (error: any) {
            console.error('Error en saveCtrl (controller):', error.message);
            return res.status(400).json({
                success: false,
                message: 'No se pudo crear el usuario.',
                error: error.message,
            });
        }
    }

    public async confirmCtrl({ body }: Request, res: Response) {
        try {
            const token = body.token;
            const user = await this.authUseCase.confirmAccount(token);
            return res.status(200).json({ user });
        } catch (error: any) {
            return res.status(400).json({ success: false, error: error.message });
        }
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

            // Buscar al usuario por correo localmente
            const user = await this.userUseCase.getUserByEmail(usr_email);
            if (!user) {
                return res.status(400).json({
                    success: false,
                    message: 'No se encontró ningún usuario con este correo electrónico.',
                });
            }

            const userRecord = await this.authUseCase.forgotPasswordForUser(user as any);
            return res.status(200).json({
                success: true,
                message: 'El correo electrónico fue enviado correctamente.',
                data: userRecord,
            });
        } catch (error: any) {
            console.error('Error en forgotCtrl (controller):', error.message);
            return res.status(400).json({
                success: false,
                message: 'No se pudo reestablecer la contraseña.',
                error: error.message,
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

            const expirationDate = new Date();
            const user = await this.authUseCase.getUserByResetToken(token, expirationDate);

            if (!user) {
                return res.status(400).json({
                    success: false,
                    message: 'El token es inválido o ha expirado.',
                });
            }

            await this.authUseCase.updatePassword(user.usr_uuid, newPassword);

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

    public async verifySSOTokenCtrl(req: Request, res: Response) {
        try {
            const { sso_token } = req.body;
            if (!sso_token) {
                return res.status(400).json({
                    success: false,
                    message: 'El token SSO (sso_token) es requerido.'
                });
            }

            const centralUrl = process.env.CENTRAL_API_URL || 'http://localhost:3006/api/auth/sso/verify';
            const centralRes = await fetch(centralUrl, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ sso_token })
            });

            const centralData = await centralRes.json() as any;

            if (!centralRes.ok || !centralData.success) {
                return res.status(400).json({
                    success: false,
                    message: centralData.message || 'Token SSO inválido o expirado.',
                    error: centralData.error
                });
            }

            const centralUser = centralData.data.user;
            let localUser;
            try {
                localUser = await this.userUseCase.getDetailUser(centralUser.usr_uuid);
            } catch (err: any) {
                const newUser = {
                    usr_uuid: centralUser.usr_uuid,
                    usr_name: centralUser.usr_name,
                    usr_surname: centralUser.usr_surname,
                    usr_password: 'sso_federated_user_no_password_access_key',
                    usr_image: '',
                    usr_email: centralUser.usr_email,
                    usr_nick: centralUser.usr_email.split('@')[0],
                    usr_bio: 'Federated SSO User',
                    usr_registered: new Date(),
                    usr_socket: '',
                    usr_online: false,
                    usr_confirmed: true,
                    usr_confirmationtoken: '',
                    usr_resetpasswordtoken: '',
                    usr_resetpasswordexpires: new Date(),
                    usr_sysadmin: !!centralUser.usr_sysadmin
                };
                localUser = await this.userUseCase.registerUser(newUser);
            }

            const { createToken } = require('../../services/jwt.service');
            const localToken = createToken(localUser);

            return res.status(200).json({
                success: true,
                message: 'Token SSO verificado y sesión local iniciada.',
                data: {
                    token: localToken,
                    user: localUser
                }
            });

        } catch (error: any) {
            console.error('Error en verifySSOTokenCtrl (management backend):', error.message);
            return res.status(500).json({
                success: false,
                message: 'Ocurrió un error al procesar el inicio de sesión SSO.',
                error: error.message
            });
        }
    }

    public async getAppConfigCtrl(req: Request, res: Response) {
        try {
            const centralUrl = (process.env.CENTRAL_API_URL ? process.env.CENTRAL_API_URL.replace('/auth/sso/verify', '/auth/sso/config/Management') : null) || 'http://localhost:3006/api/auth/sso/config/Management';
            
            const centralRes = await fetch(centralUrl);
            const centralData = await centralRes.json() as any;

            if (!centralRes.ok || centralData.success === false) {
                return res.status(200).json({
                    success: true,
                    app_login_mode: 'local',
                    message: 'Fallback to local login due to central config unavailable.'
                });
            }

            return res.status(200).json({
                success: true,
                app_login_mode: centralData.app_loginmode || 'local',
                central_login_url: `${centralData.app_url}/auth/login?redirect=http://localhost:4202/auth/sso`
            });
        } catch (error: any) {
            console.error('Error fetching app config from central:', error.message);
            return res.status(200).json({
                success: true,
                app_login_mode: 'local',
                message: 'Fallback to local login due to connection error.'
            });
        }
    }

    public async logAuthCtrl(req: Request, res: Response) {
        try {
            const centralUrl = (process.env.CENTRAL_API_URL ? process.env.CENTRAL_API_URL.replace('/auth/sso/verify', '/auth/sso/log-auth') : null) || 'http://localhost:3006/api/auth/sso/log-auth';
            
            const clientIp = (req.headers['x-forwarded-for'] as string) || req.socket.remoteAddress || '127.0.0.1';
            const clientUserAgent = req.headers['user-agent'] || 'UNKNOWN';

            const payload = {
                ...req.body,
                usraulo_ipaddress: clientIp,
                usraulo_useragent: clientUserAgent
            };

            const centralRes = await fetch(centralUrl, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(payload)
            });

            const centralData = await centralRes.json() as any;
            return res.status(centralRes.status).json(centralData);
        } catch (error: any) {
            console.error('Error forwarding auth log to central:', error.message);
            return res.status(500).json({ success: false, error: error.message });
        }
    }
}
