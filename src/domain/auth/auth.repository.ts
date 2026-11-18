import { UserEntity } from "../user/user.entity";

export interface AuthRepository {
    loginUser(identifier: string, usr_password: string, gettoken: boolean): Promise<UserEntity | string | null>;
    confirmAccount(usr_confirmationtoken: string): Promise<UserEntity | null>;
    forgotPassword(user: UserEntity): Promise<UserEntity | null>;
    findUserByResetToken(token: string, expirationDate: Date): Promise<UserEntity | null>;
    updatePassword(usr_uuid: string, newPassword: string): Promise<void>;
}
