import { AuthRepository } from "../../domain/auth/auth.repository";
import { UserEntity } from "../../domain/user/user.entity";

export class AuthUseCase {
    constructor(private readonly authRepository: AuthRepository) {
        this.loginUser = this.loginUser.bind(this);
        this.confirmAccount = this.confirmAccount.bind(this);
        this.forgotPassword = this.forgotPassword.bind(this);
        this.getUserByResetToken = this.getUserByResetToken.bind(this);
        this.updatePassword = this.updatePassword.bind(this);
    }

    public async loginUser(usr_nick: string, usr_password: string, gettoken: boolean) {
        try {
            const user = await this.authRepository.loginUser(usr_nick, usr_password, gettoken);
            if (!user) {
                throw new Error('Credenciales incorrectas.');
            }
            return user;
        } catch (error: any) {
            console.error('Error en loginUser (use case):', error.message);
            throw error;
        }
    }

    public async confirmAccount(usr_confirmationtoken: string = '') {
        const userConfirmation = await this.authRepository.confirmAccount(usr_confirmationtoken);
        return userConfirmation;
    }

    public async forgotPassword(usr_email: string = '') {        
        try {
            // Se debe resolver la búsqueda de email a través de la infraestructura/controlador que consume el repositorio de usuario
            // O directamente pasamos la entidad de usuario resuelta por el controlador
            throw new Error('Debe proporcionar la entidad de usuario para generar el restablecimiento.');
        } catch (error: any) {
            console.error('Error en forgotPassword (use case):', error.message);
            throw error;
        }
    }

    public async forgotPasswordForUser(user: UserEntity) {        
        try {
            const userForgotPassword = await this.authRepository.forgotPassword(user);
            return userForgotPassword;
        } catch (error: any) {
            console.error('Error en forgotPasswordForUser (use case):', error.message);
            throw error;
        }
    }

    public async getUserByResetToken(token: string, expirationDate: Date) {
        try {
            const user = await this.authRepository.findUserByResetToken(token, expirationDate);
            if (!user) {
                throw new Error('El token es inválido o ha expirado.');
            }
            return user;
        } catch (error: any) {
            console.error('Error en getUserByResetToken (use case):', error.message);
            throw error;
        }
    }

    public async updatePassword(usr_uuid: string, newPassword: string) {
        try {
            await this.authRepository.updatePassword(usr_uuid, newPassword);
        } catch (error: any) {
            console.error('Error en updatePassword (use case):', error.message);
            throw error;
        }
    }
}
