import { ScopeEntity, ScopeUpdateData } from "./scope.entity";

export interface ScopeRepository {
    getScopes(usr_uuid: string): Promise<ScopeEntity[] | null>;
    findScopeById(scp_uuid: string): Promise<ScopeEntity | null>;
    createScope(scope: ScopeEntity): Promise<ScopeEntity | null>;
    updateScope(scp_uuid: string, scope: ScopeUpdateData): Promise<ScopeEntity | null>;
    deleteScope(scp_uuid: string): Promise<ScopeEntity | null>;
    findScopeByName(usr_uuidowner: string, scp_name: string, excludeUuid?: string | null): Promise<ScopeEntity | null>;
}