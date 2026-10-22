import { Op, Sequelize } from 'sequelize';
import { ScopeEntity, ScopeUpdateData } from "../../../domain/scope/scope.entity";
import { ScopeRepository } from "../../../domain/scope/scope.repository";
import { SequelizeScope } from "../../model/scope/scope.model";
import { SequelizeScopeUser } from '../../model/scope-user/scope-user.model';

export class SequelizeScopeRepository implements ScopeRepository {
    async getScopes(usr_uuid: string): Promise<ScopeEntity[] | null> {
        try {
            const scopeUsers = await SequelizeScopeUser.findAll({
                where: { usr_uuid },
                attributes: ['scp_uuid']
            });

            if (!scopeUsers || scopeUsers.length === 0) {
                return [];
            }

            const allowedScopeUuids = scopeUsers.map(su => su.scp_uuid);

            const scopes = await SequelizeScope.findAll({
                where: {
                    scp_uuid: { [Op.in]: allowedScopeUuids },
                    scp_active: true
                },
                order: [
                    [Sequelize.col('scp_name'), 'ASC']
                ]
            });
            if (!scopes) {
                return [];
            }
            return scopes.map(s => s.get({ plain: true }) as ScopeEntity);
        } catch (error: any) {
            console.error('Error en getScopes:', error.message);
            throw error;
        }
    }

    async findScopeById(scp_uuid: string): Promise<ScopeEntity | null> {
        try {
            const scope = await SequelizeScope.findOne({ 
                where: { scp_uuid } 
            });
            if (!scope) {
                return null;
            }
            return scope.get({ plain: true }) as ScopeEntity;
        } catch (error: any) {
            console.error('Error en findScopeById:', error.message);
            throw error;
        }
    }

    async createScope(scope: ScopeEntity): Promise<ScopeEntity | null> {
        try {
            const { scp_uuid, scp_name, scp_description, scp_isshared, scp_color, scp_icon, usr_uuidowner, scp_active, scp_createdat, scp_updatedat } = scope;
            const result = await SequelizeScope.create({
                scp_uuid,
                scp_name,
                scp_description,
                scp_isshared,
                scp_color,
                scp_icon,
                usr_uuidowner,
                scp_active: scp_active ?? true,
                scp_createdat,
                scp_updatedat
            });

            if (!result) {
                throw new Error(`No se ha agregado el ámbito`);
            }

            await SequelizeScopeUser.create({
                scp_uuid,
                usr_uuid: usr_uuidowner,
                scpu_role: 'OWNER',
                scpu_createdat: scp_createdat
            });

            return result.get({ plain: true }) as ScopeEntity;
        } catch (error: any) {
            console.error('Error en createScope:', error.message);
            throw error;
        }
    }

    async updateScope(scp_uuid: string, scope: ScopeUpdateData): Promise<ScopeEntity | null> {
        try {
            const [updatedCount, [updatedScope]] = await SequelizeScope.update(
                {
                    scp_name: scope.scp_name,
                    scp_description: scope.scp_description,
                    scp_isshared: scope.scp_isshared,
                    scp_color: scope.scp_color,
                    scp_icon: scope.scp_icon,
                    scp_active: scope.scp_active
                },
                {
                    where: { scp_uuid },
                    returning: true,
                }
            );
            if (updatedCount === 0) {
                throw new Error(`No se ha actualizado el ámbito`);
            }
            return updatedScope.get({ plain: true }) as ScopeEntity;
        } catch (error: any) {
            console.error('Error en updateScope:', error.message);
            throw error;
        }
    }

    async deleteScope(scp_uuid: string): Promise<ScopeEntity | null> {
        try {
            const scope = await this.findScopeById(scp_uuid);
            const result = await SequelizeScope.destroy({ where: { scp_uuid } });
            if (!result) {
                throw new Error(`No se ha eliminado el ámbito`);
            }
            return scope;
        } catch (error: any) {
            console.error('Error en deleteScope:', error.message);
            throw error;
        }
    }

    async findScopeByName(usr_uuidowner: string, scp_name: string, excludeUuid?: string | null): Promise<ScopeEntity | null> {
        try {
            const whereCondition: any = { usr_uuidowner, scp_name };
            if (excludeUuid) {
                whereCondition.scp_uuid = { [Op.ne]: excludeUuid };
            }
            const scope = await SequelizeScope.findOne({ where: whereCondition });
            return scope ? (scope.get({ plain: true }) as ScopeEntity) : null;
        } catch (error: any) {
            console.error('Error en findScopeByName:', error.message);
            throw error;
        }
    }
}
