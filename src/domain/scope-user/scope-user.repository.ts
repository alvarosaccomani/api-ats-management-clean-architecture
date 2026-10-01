import { ScopeUserEntity } from "./scope-user.entity";

export interface ScopeUserRepository {
    getScopeUsers(scp_uuid: string): Promise<ScopeUserEntity[] | null>;
    addScopeUser(scopeUser: ScopeUserEntity): Promise<ScopeUserEntity | null>;
    removeScopeUser(scp_uuid: string, usr_uuid: string): Promise<boolean>;
}