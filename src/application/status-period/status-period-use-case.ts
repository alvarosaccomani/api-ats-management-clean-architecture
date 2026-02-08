import { StatusPeriodRepository } from "../../domain/status-period/status-period.repository";
import { StatusPeriodValue } from "../../domain/status-period/status-period.value";
import { TimezoneConverter } from "../../infrastructure/utils/TimezoneConverter";

export class StatusPeriodUseCase {
    constructor(
        private readonly statusPeriodRepository: StatusPeriodRepository
    ) {
        this.getStatusPeriods = this.getStatusPeriods.bind(this);
        this.getDetailStatusPeriod = this.getDetailStatusPeriod.bind(this);
        this.createStatusPeriod = this.createStatusPeriod.bind(this);
        this.updateStatusPeriod = this.updateStatusPeriod.bind(this);
        this.deleteStatusPeriod = this.deleteStatusPeriod.bind(this);
        this.findStatusPeriodByName = this.findStatusPeriodByName.bind(this);
    }

    public async getStatusPeriods() {
        try {
            const statusPeriods = await this.statusPeriodRepository.getStatusPeriods();
            if(!statusPeriods) {
                throw new Error('No hay estados de período.');
            }
            return statusPeriods.map(statusPeriod => ({
                sper_uuid: statusPeriod.sper_uuid,
                sper_name: statusPeriod.sper_name,
                sper_description: statusPeriod.sper_description,
                sper_createdat: TimezoneConverter.toIsoStringInTimezone(statusPeriod.sper_createdat, 'America/Buenos_Aires'),
                sper_updatedat: TimezoneConverter.toIsoStringInTimezone(statusPeriod.sper_updatedat, 'America/Buenos_Aires'),
            }));
        } catch (error: any) {
            console.error('Error en getStatusPeriods (use case):', error.message);
            throw error;
        }
    }

    public async getDetailStatusPeriod(sper_uuid: string) {
        try {
            const statusPeriod = await this.statusPeriodRepository.findStatusPeriodById(sper_uuid);
            if(!statusPeriod) {
                throw new Error(`No hay estado de período con el Id: ${sper_uuid}`);
            }
            return {
                sper_uuid: statusPeriod.sper_uuid,
                sper_name: statusPeriod.sper_name,
                sper_description: statusPeriod.sper_description,
                sper_createdat: TimezoneConverter.toIsoStringInTimezone(statusPeriod.sper_createdat, 'America/Buenos_Aires'),
                sper_updatedat: TimezoneConverter.toIsoStringInTimezone(statusPeriod.sper_updatedat, 'America/Buenos_Aires'),
            };
        } catch (error: any) {
            console.error('Error en getDetailStatusPeriod (use case):', error.message);
            throw error;
        }
    }
    
    public async createStatusPeriod({ sper_uuid, sper_name, sper_description } : { sper_uuid?: string, sper_name: string, sper_description?: string }) {
        try {
            const statusPeriodValue = new StatusPeriodValue({ sper_uuid, sper_name, sper_description });
            const statusPeriodCreated = await this.statusPeriodRepository.createStatusPeriod(statusPeriodValue);
            if(!statusPeriodCreated) {
                throw new Error(`No se pudo insertar el estado de período.`);
            }
            return {
                sper_uuid: statusPeriodCreated.sper_uuid,
                sper_name: statusPeriodCreated.sper_name,
                sper_description: statusPeriodCreated.sper_description,
                sper_createdat: TimezoneConverter.toIsoStringInTimezone(statusPeriodCreated.sper_createdat, 'America/Buenos_Aires'),
                sper_updatedat: TimezoneConverter.toIsoStringInTimezone(statusPeriodCreated.sper_updatedat, 'America/Buenos_Aires'),
            };
        } catch (error: any) {
            console.error('Error en createStatusPeriod (use case):', error.message);
            throw error;
        }
    }

    public async updateStatusPeriod(sper_uuid: string, { sper_name, sper_description } : { sper_name: string, sper_description: string }) {
        try {
            const statusPeriodUpdated = await this.statusPeriodRepository.updateStatusPeriod(sper_uuid, { sper_name, sper_description });
            if(!statusPeriodUpdated) {
                throw new Error(`No se pudo actualizar el estado de período.`);
            }
            return {
                sper_uuid: statusPeriodUpdated.sper_uuid,
                sper_name: statusPeriodUpdated.sper_name,
                sper_description: statusPeriodUpdated.sper_description,
                sper_createdat: TimezoneConverter.toIsoStringInTimezone(statusPeriodUpdated.sper_createdat, 'America/Buenos_Aires'),
                sper_updatedat: TimezoneConverter.toIsoStringInTimezone(statusPeriodUpdated.sper_updatedat, 'America/Buenos_Aires'),
            };
        } catch (error: any) {
            console.error('Error en updateStatusPeriod (use case):', error.message);
            throw error;
        }
    }

    public async deleteStatusPeriod(sper_uuid: string) {
        try {
            const statusPeriodDeleted = await this.statusPeriodRepository.deleteStatusPeriod(sper_uuid);
            if(!statusPeriodDeleted) {
                throw new Error(`No se pudo eliminar el estado de período.`);
            }
            return {
                sper_uuid: statusPeriodDeleted.sper_uuid,
                sper_name: statusPeriodDeleted.sper_name,
                sper_description: statusPeriodDeleted.sper_description,
                sper_createdat: TimezoneConverter.toIsoStringInTimezone(statusPeriodDeleted.sper_createdat, 'America/Buenos_Aires'),
                sper_updatedat: TimezoneConverter.toIsoStringInTimezone(statusPeriodDeleted.sper_updatedat, 'America/Buenos_Aires'),
            };
        } catch (error: any) {
            console.error('Error en deleteStatusPeriod (use case):', error.message);
            throw error;
        }
    }

    public async findStatusPeriodByName(sper_name: string, excludeUuid?: string) {
        try {
            const statusPeriod = await this.statusPeriodRepository.findStatusPeriodByName(sper_name, excludeUuid)
            if(statusPeriod) {
                throw new Error(`Ya existe un estado de período con el nombre ${sper_name}.`);
            }
            return statusPeriod
        } catch (error: any) {
            console.error('Error en findStatusPeriodByName (use case):', error.message);
            throw error;
        }
    }
}