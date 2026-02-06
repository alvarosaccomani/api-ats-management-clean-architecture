import { UserEntity, UserUpdateData } from "./user.entity";

export interface UserRepository {
    getUsers(): Promise<UserEntity[] | null>;
    findUserById(usr_uuid: string): Promise<UserEntity | null>;
    findUserByEmail(usr_email: string): Promise<UserEntity | null>;
    registerUser(user: UserEntity): Promise<UserEntity | null>;
    updateUser(usr_uuid: string, user: UserUpdateData): Promise<UserEntity | null>;
    deleteUser(usr_uuid: string): Promise<UserEntity | null>;
    userExist(usr_nick: string, usr_email: string): Promise<UserEntity | null>;
    loginUser(usr_nick: string, usr_password: string, gettoken: boolean): Promise<UserEntity | String | null>;
    saveUser(user: UserEntity): Promise<UserEntity | null>;
    setSocketUser(usr_uuid: string, usr_socket: string, usr_online: boolean): Promise<UserEntity | null>;
    confirmAccount(usr_confirmationtoken: string): Promise<UserEntity | null>;
    forgotPassword(user: UserEntity): Promise<UserEntity | null>;
    findUserByResetToken(token: string, expirationDate: Date): Promise<any | null>;
    findUserByNick(usr_nick: string): Promise<UserEntity | null>;
    findSocketUser(usr_uuid: string): Promise<string | null>;
    updatePassword(usr_uuid: string, newPassword: string): Promise<void>;
}