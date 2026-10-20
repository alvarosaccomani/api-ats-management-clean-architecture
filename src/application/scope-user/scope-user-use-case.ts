import { ScopeUserRepository } from "../../domain/scope-user/scope-user.repository";
import { ScopeUserValue } from "../../domain/scope-user/scope-user.value";
import { TimezoneConverter } from "../../infrastructure/utils/TimezoneConverter";

export class ScopeUserUseCase {
    constructor(
        private readonly scopeUserRepository: ScopeUserRepository
    ) {
        this.getScopeUsers = this.getScopeUsers.bind(this);
        this.addScopeUser = this.addScopeUser.bind(this);
        this.removeScopeUser = this.removeScopeUser.bind(this);
    }

    public async getScopeUsers(scp_uuid: string) {
        try {
            const scopeUsers = await this.scopeUserRepository.getScopeUsers(scp_uuid);
            if (!scopeUsers) {
                return [];
            }
            return scopeUsers.map(su => ({
                scp_uuid: su.scp_uuid,
                usr_uuid: su.usr_uuid,
                scpu_role: su.scpu_role,
                scpu_createdat: TimezoneConverter.toIsoStringInTimezone(su.scpu_createdat, 'America/Buenos_Aires'),
                user: su.user ? {
                    usr_uuid: su.user.usr_uuid,
                    usr_name: su.user.usr_name,
                    usr_surname: su.user.usr_surname,
                    usr_email: su.user.usr_email
                } : null
            }));
        } catch (error: any) {
            console.error('Error en getScopeUsers (use case):', error.message);
            throw error;
        }
    }

    public async addScopeUser({
        scp_uuid,
        usr_uuid,
        scpu_role
    }: {
        scp_uuid: string;
        usr_uuid: string;
        scpu_role?: string;
    }) {
        try {
            const scopeUserValue = new ScopeUserValue({
                scp_uuid,
                usr_uuid,
                scpu_role
            });
            const created = await this.scopeUserRepository.addScopeUser(scopeUserValue);
            if (!created) {
                throw new Error(`No se pudo agregar la membresía al ámbito.`);
            }
            return {
                scp_uuid: created.scp_uuid,
                usr_uuid: created.usr_uuid,
                scpu_role: created.scpu_role,
                scpu_createdat: TimezoneConverter.toIsoStringInTimezone(created.scpu_createdat, 'America/Buenos_Aires'),
            };
        } catch (error: any) {
            console.error('Error en addScopeUser (use case):', error.message);
            throw error;
        }
    }

    public async removeScopeUser(scp_uuid: string, usr_uuid: string) {
        try {
            const removed = await this.scopeUserRepository.removeScopeUser(scp_uuid, usr_uuid);
            return { success: removed };
        } catch (error: any) {
            console.error('Error en removeScopeUser (use case):', error.message);
            throw error;
        }
    }
}
