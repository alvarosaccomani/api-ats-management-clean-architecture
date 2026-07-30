import * as bcrypt from "bcryptjs";
import { UserEntity } from "../../../domain/user/user.entity";
import { AuthRepository } from "../../../domain/auth/auth.repository";
import { SequelizeUser } from "../../model/user/user.model";
import { createToken } from "../../services/jwt.service";

export class SequelizeAuthRepository implements AuthRepository {
    async loginUser(usr_nick: string, usr_password: string, gettoken: boolean): Promise<UserEntity | string | null> {
        try {
            const user = await SequelizeUser.findOne({ 
                where: { 
                    usr_nick: usr_nick ?? null
                }
            });            
            if(!user) {
                throw new Error(`No hay usuario con el nombre ${usr_nick}`);
            }
            
            const isPasswordValid = await bcrypt.compare(usr_password, user.dataValues.usr_password);
            if(!isPasswordValid) {
                throw new Error('El password es incorrecto');
            }
            
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

    async confirmAccount(usr_confirmationtoken: string): Promise<UserEntity | null> {
        throw new Error('La confirmación de cuenta se realiza a través del Kernel Central.');
    }

    async forgotPassword(user: UserEntity): Promise<UserEntity | null> {
        throw new Error('La recuperación de contraseña se realiza a través del Kernel Central.');
    }

    async findUserByResetToken(token: string, expirationDate: Date): Promise<UserEntity | null> {
        return null;
    }

    async findUserByNick(usr_nick: string): Promise<UserEntity | null> {
        try {
            const user = await SequelizeUser.findOne({
                where: { usr_nick }
            });
            return user ? (user.dataValues as UserEntity) : null;
        } catch (error) {
            throw new Error('Error al buscar el usuario por nick.');
        }
    }

    async findUserByEmail(usr_email: string): Promise<UserEntity | null> {
        try {
            const user = await SequelizeUser.findOne({ 
                where: { 
                    usr_email: usr_email ?? null
                }
            });
            return user ? (user.dataValues as UserEntity) : null;
        } catch (error: any) {
            console.error('Error en findUserByEmail:', error.message);
            throw error;
        }
    }

    async updatePassword(usr_uuid: string, newPassword: string): Promise<void> {
        try {
            const hashedPassword = await bcrypt.hash(newPassword, 10);
            await SequelizeUser.update(
                { usr_password: hashedPassword },
                { where: { usr_uuid } }
            );
        } catch (error) {
            throw new Error('Error al actualizar la contraseña.');
        }
    }
}
