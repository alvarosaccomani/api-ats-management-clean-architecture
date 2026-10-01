import { ScopeRepository } from "../../domain/scope/scope.repository";
import { ScopeValue } from "../../domain/scope/scope.value";
import { TimezoneConverter } from "../../infrastructure/utils/TimezoneConverter";

export class ScopeUseCase {
    constructor(
        private readonly scopeRepository: ScopeRepository
    ) {
        this.getScopes = this.getScopes.bind(this);
        this.getDetailScope = this.getDetailScope.bind(this);
        this.createScope = this.createScope.bind(this);
        this.updateScope = this.updateScope.bind(this);
        this.deleteScope = this.deleteScope.bind(this);
    }

    public async getScopes(usr_uuid: string) {
        try {
            const scopes = await this.scopeRepository.getScopes(usr_uuid);
            if (!scopes) {
                throw new Error('No hay ámbitos disponibles.');
            }
            return scopes.map(scope => ({
                scp_uuid: scope.scp_uuid,
                scp_name: scope.scp_name,
                scp_description: scope.scp_description,
                scp_isshared: scope.scp_isshared,
                scp_color: scope.scp_color,
                scp_icon: scope.scp_icon,
                usr_uuidowner: scope.usr_uuidowner,
                scp_active: scope.scp_active,
                scp_createdat: TimezoneConverter.toIsoStringInTimezone(scope.scp_createdat, 'America/Buenos_Aires'),
                scp_updatedat: TimezoneConverter.toIsoStringInTimezone(scope.scp_updatedat, 'America/Buenos_Aires'),
            }));
        } catch (error: any) {
            console.error('Error en getScopes (use case):', error.message);
            throw error;
        }
    }

    public async getDetailScope(scp_uuid: string) {
        try {
            const scope = await this.scopeRepository.findScopeById(scp_uuid);
            if (!scope) {
                throw new Error(`No hay ámbito con el Id: ${scp_uuid}`);
            }
            return {
                scp_uuid: scope.scp_uuid,
                scp_name: scope.scp_name,
                scp_description: scope.scp_description,
                scp_isshared: scope.scp_isshared,
                scp_color: scope.scp_color,
                scp_icon: scope.scp_icon,
                usr_uuidowner: scope.usr_uuidowner,
                scp_active: scope.scp_active,
                scp_createdat: TimezoneConverter.toIsoStringInTimezone(scope.scp_createdat, 'America/Buenos_Aires'),
                scp_updatedat: TimezoneConverter.toIsoStringInTimezone(scope.scp_updatedat, 'America/Buenos_Aires'),
            };
        } catch (error: any) {
            console.error('Error en getDetailScope (use case):', error.message);
            throw error;
        }
    }

    public async createScope({
        scp_uuid,
        scp_name,
        scp_description,
        scp_isshared,
        scp_color,
        scp_icon,
        usr_uuidowner,
        scp_active
    }: {
        scp_uuid?: string;
        scp_name: string;
        scp_description?: string | null;
        scp_isshared?: boolean;
        scp_color?: string | null;
        scp_icon?: string | null;
        usr_uuidowner: string;
        scp_active?: boolean;
    }) {
        try {
            const existing = await this.scopeRepository.findScopeByName(usr_uuidowner, scp_name);
            if (existing) {
                throw new Error(`Ya existe un ámbito con el nombre "${scp_name}".`);
            }
            const scopeValue = new ScopeValue({
                scp_uuid,
                scp_name,
                scp_description,
                scp_isshared,
                scp_color,
                scp_icon,
                usr_uuidowner,
                scp_active
            });
            const scopeCreated = await this.scopeRepository.createScope(scopeValue);
            if (!scopeCreated) {
                throw new Error(`No se pudo insertar el ámbito.`);
            }
            return {
                scp_uuid: scopeCreated.scp_uuid,
                scp_name: scopeCreated.scp_name,
                scp_description: scopeCreated.scp_description,
                scp_isshared: scopeCreated.scp_isshared,
                scp_color: scopeCreated.scp_color,
                scp_icon: scopeCreated.scp_icon,
                usr_uuidowner: scopeCreated.usr_uuidowner,
                scp_active: scopeCreated.scp_active,
                scp_createdat: TimezoneConverter.toIsoStringInTimezone(scopeCreated.scp_createdat, 'America/Buenos_Aires'),
                scp_updatedat: TimezoneConverter.toIsoStringInTimezone(scopeCreated.scp_updatedat, 'America/Buenos_Aires'),
            };
        } catch (error: any) {
            console.error('Error en createScope (use case):', error.message);
            throw error;
        }
    }

    public async updateScope(scp_uuid: string, usr_uuidowner: string, {
        scp_name,
        scp_description,
        scp_isshared,
        scp_color,
        scp_icon,
        scp_active
    }: {
        scp_name: string;
        scp_description?: string | null;
        scp_isshared: boolean;
        scp_color?: string | null;
        scp_icon?: string | null;
        scp_active: boolean;
    }) {
        try {
            const existing = await this.scopeRepository.findScopeByName(usr_uuidowner, scp_name, scp_uuid);
            if (existing) {
                throw new Error(`Ya existe otro ámbito con el nombre "${scp_name}".`);
            }
            const scopeUpdated = await this.scopeRepository.updateScope(scp_uuid, {
                scp_name,
                scp_description,
                scp_isshared,
                scp_color,
                scp_icon,
                scp_active
            });
            if (!scopeUpdated) {
                throw new Error(`No se pudo actualizar el ámbito.`);
            }
            return {
                scp_uuid: scopeUpdated.scp_uuid,
                scp_name: scopeUpdated.scp_name,
                scp_description: scopeUpdated.scp_description,
                scp_isshared: scopeUpdated.scp_isshared,
                scp_color: scopeUpdated.scp_color,
                scp_icon: scopeUpdated.scp_icon,
                usr_uuidowner: scopeUpdated.usr_uuidowner,
                scp_active: scopeUpdated.scp_active,
                scp_createdat: TimezoneConverter.toIsoStringInTimezone(scopeUpdated.scp_createdat, 'America/Buenos_Aires'),
                scp_updatedat: TimezoneConverter.toIsoStringInTimezone(scopeUpdated.scp_updatedat, 'America/Buenos_Aires'),
            };
        } catch (error: any) {
            console.error('Error en updateScope (use case):', error.message);
            throw error;
        }
    }

    public async deleteScope(scp_uuid: string) {
        try {
            const scopeDeleted = await this.scopeRepository.deleteScope(scp_uuid);
            if (!scopeDeleted) {
                throw new Error(`No se pudo eliminar el ámbito.`);
            }
            return {
                scp_uuid: scopeDeleted.scp_uuid,
                scp_name: scopeDeleted.scp_name,
                scp_description: scopeDeleted.scp_description,
                scp_isshared: scopeDeleted.scp_isshared,
                scp_color: scopeDeleted.scp_color,
                scp_icon: scopeDeleted.scp_icon,
                usr_uuidowner: scopeDeleted.usr_uuidowner,
                scp_active: scopeDeleted.scp_active,
                scp_createdat: TimezoneConverter.toIsoStringInTimezone(scopeDeleted.scp_createdat, 'America/Buenos_Aires'),
                scp_updatedat: TimezoneConverter.toIsoStringInTimezone(scopeDeleted.scp_updatedat, 'America/Buenos_Aires'),
            };
        } catch (error: any) {
            console.error('Error en deleteScope (use case):', error.message);
            throw error;
        }
    }
}
