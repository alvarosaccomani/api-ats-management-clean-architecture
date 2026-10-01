import { ScopeUserEntity } from "../../../domain/scope-user/scope-user.entity";
import { ScopeUserRepository } from "../../../domain/scope-user/scope-user.repository";
import { SequelizeScopeUser } from "../../model/scope-user/scope-user.model";

export class SequelizeScopeUserRepository implements ScopeUserRepository {
    async getScopeUsers(scp_uuid: string): Promise<ScopeUserEntity[] | null> {
        try {
            const scopeUsers = await SequelizeScopeUser.findAll({
                where: { scp_uuid }
            });
            if (!scopeUsers) {
                return null;
            }
            return scopeUsers.map(su => su.get({ plain: true }) as ScopeUserEntity);
        } catch (error: any) {
            console.error('Error en getScopeUsers:', error.message);
            throw error;
        }
    }

    async addScopeUser(scopeUser: ScopeUserEntity): Promise<ScopeUserEntity | null> {
        try {
            const { scp_uuid, usr_uuid, scpu_role, scpu_createdat } = scopeUser;
            const result = await SequelizeScopeUser.create({
                scp_uuid,
                usr_uuid,
                scpu_role: scpu_role ?? 'MEMBER',
                scpu_createdat
            });
            if (!result) {
                throw new Error(`No se pudo agregar el usuario al ámbito`);
            }
            return result.get({ plain: true }) as ScopeUserEntity;
        } catch (error: any) {
            console.error('Error en addScopeUser:', error.message);
            throw error;
        }
    }

    async removeScopeUser(scp_uuid: string, usr_uuid: string): Promise<boolean> {
        try {
            const result = await SequelizeScopeUser.destroy({
                where: { scp_uuid, usr_uuid }
            });
            return result > 0;
        } catch (error: any) {
            console.error('Error en removeScopeUser:', error.message);
            throw error;
        }
    }
}
