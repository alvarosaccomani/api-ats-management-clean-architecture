import { PeriodRepository } from "../../domain/period/period.repository";
import { PeriodValue } from "../../domain/period/period.value";
import { TimezoneConverter } from "../../infrastructure/utils/TimezoneConverter";

export class PeriodUseCase {
    constructor(
        private readonly periodRepository: PeriodRepository
    ) {
        this.getPeriods = this.getPeriods.bind(this);
        this.getDetailPeriod = this.getDetailPeriod.bind(this);
        this.createPeriod = this.createPeriod.bind(this);
        this.updatePeriod = this.updatePeriod.bind(this);
        this.deletePeriod = this.deletePeriod.bind(this);
        this.findPeriodByNumber = this.findPeriodByNumber.bind(this);
    }

    public async getPeriods(usr_uuid: string, crd_uuid: string) {
        try {
            const periods = await this.periodRepository.getPeriods(usr_uuid, crd_uuid);
            if(!periods) {
                throw new Error('No hay períodos.');
            }
            return periods.map(period => ({
                usr_uuid: period.usr_uuid,
                crd_uuid: period.crd_uuid,
                per_uuid: period.per_uuid,
                per_periodnumber: period.per_periodnumber,
                per_startdate: period.per_startdate,
                per_enddate: period.per_enddate,
                per_duedate: period.per_duedate,
                sper_uuid: period.sper_uuid,
                sper: period.sper,
                per_previousbalance: period.per_previousbalance,
                per_interest: period.per_interest,
                per_createdat: TimezoneConverter.toIsoStringInTimezone(period.per_createdat, 'America/Buenos_Aires'),
                per_updatedat: TimezoneConverter.toIsoStringInTimezone(period.per_updatedat, 'America/Buenos_Aires'),
            }));
        } catch (error: any) {
            console.error('Error en getPeriods (use case):', error.message);
            throw error;
        }
    }

    public async getDetailPeriod(usr_uuid: string, crd_uuid: string, per_uuid: string) {
        try {
            const period = await this.periodRepository.findPeriodById(usr_uuid, crd_uuid, per_uuid);
            if(!period) {
                throw new Error(`No hay período con el Id: ${per_uuid}`);
            }
            return {
                usr_uuid: period.usr_uuid,
                crd_uuid: period.crd_uuid,
                per_uuid: period.per_uuid,
                per_periodnumber: period.per_periodnumber,
                per_startdate: period.per_startdate,
                per_enddate: period.per_enddate,
                per_duedate: period.per_duedate,
                sper_uuid: period.sper_uuid,
                per_previousbalance: period.per_previousbalance,
                per_interest: period.per_interest,
                per_createdat: TimezoneConverter.toIsoStringInTimezone(period.per_createdat, 'America/Buenos_Aires'),
                per_updatedat: TimezoneConverter.toIsoStringInTimezone(period.per_updatedat, 'America/Buenos_Aires'),
            };
        } catch (error: any) {
            console.error('Error en getDetailPeriod (use case):', error.message);
            throw error;
        }
    }
    
    public async createPeriod({ 
        usr_uuid, 
        crd_uuid, 
        per_uuid, 
        per_periodnumber, 
        per_startdate, 
        per_enddate, 
        per_duedate, 
        sper_uuid, 
        per_previousbalance, 
        per_interest 
    } : { 
        usr_uuid: string,
        crd_uuid: string,
        per_uuid?: string,
        per_periodnumber: number,
        per_startdate: Date,
        per_enddate: Date,
        per_duedate: Date,
        sper_uuid: string,
        per_previousbalance?: number,
        per_interest?: number
    }) {
        try {
            const periodValue = new PeriodValue({ 
                usr_uuid, 
                crd_uuid, 
                per_uuid, 
                per_periodnumber, 
                per_startdate, 
                per_enddate, 
                per_duedate, 
                sper_uuid, 
                per_previousbalance, 
                per_interest 
            });
            const periodCreated = await this.periodRepository.createPeriod(periodValue);
            if(!periodCreated) {
                throw new Error(`No se pudo insertar el período.`);
            }
            return {
                usr_uuid: periodCreated.usr_uuid,
                crd_uuid: periodCreated.crd_uuid,
                per_uuid: periodCreated.per_uuid,
                per_periodnumber: periodCreated.per_periodnumber,
                per_startdate: periodCreated.per_startdate,
                per_enddate: periodCreated.per_enddate,
                per_duedate: periodCreated.per_duedate,
                sper_uuid: periodCreated.sper_uuid,
                per_previousbalance: periodCreated.per_previousbalance,
                per_interest: periodCreated.per_interest,
                per_createdat: TimezoneConverter.toIsoStringInTimezone(periodCreated.per_createdat, 'America/Buenos_Aires'),
                per_updatedat: TimezoneConverter.toIsoStringInTimezone(periodCreated.per_updatedat, 'America/Buenos_Aires'),
            };
        } catch (error: any) {
            console.error('Error en createPeriod (use case):', error.message);
            throw error;
        }
    }

    public async updatePeriod(usr_uuid: string, crd_uuid: string, per_uuid: string, { 
        per_periodnumber, 
        per_startdate, 
        per_enddate, 
        per_duedate, 
        sper_uuid, 
        per_previousbalance, 
        per_interest 
    } : { 
        per_periodnumber: number,
        per_startdate: Date,
        per_enddate: Date,
        per_duedate: Date,
        sper_uuid: string,
        per_previousbalance: number,
        per_interest: number
    }) {
        try {
            const periodUpdated = await this.periodRepository.updatePeriod(usr_uuid, crd_uuid, per_uuid, { 
                per_periodnumber, 
                per_startdate, 
                per_enddate, 
                per_duedate, 
                sper_uuid, 
                per_previousbalance, 
                per_interest 
            });
            if(!periodUpdated) {
                throw new Error(`No se pudo actualizar el período.`);
            }
            return {
                usr_uuid: periodUpdated.usr_uuid,
                crd_uuid: periodUpdated.crd_uuid,
                per_uuid: periodUpdated.per_uuid,
                per_periodnumber: periodUpdated.per_periodnumber,
                per_startdate: periodUpdated.per_startdate,
                per_enddate: periodUpdated.per_enddate,
                per_duedate: periodUpdated.per_duedate,
                sper_uuid: periodUpdated.sper_uuid,
                per_previousbalance: periodUpdated.per_previousbalance,
                per_interest: periodUpdated.per_interest,
                per_createdat: TimezoneConverter.toIsoStringInTimezone(periodUpdated.per_createdat, 'America/Buenos_Aires'),
                per_updatedat: TimezoneConverter.toIsoStringInTimezone(periodUpdated.per_updatedat, 'America/Buenos_Aires'),
            };
        } catch (error: any) {
            console.error('Error en updatePeriod (use case):', error.message);
            throw error;
        }
    }

    public async deletePeriod(usr_uuid: string, crd_uuid: string, per_uuid: string) {
        try {
            const periodDeleted = await this.periodRepository.deletePeriod(usr_uuid, crd_uuid, per_uuid);
            if(!periodDeleted) {
                throw new Error(`No se pudo eliminar el período.`);
            }
            return {
                usr_uuid: periodDeleted.usr_uuid,
                crd_uuid: periodDeleted.crd_uuid,
                per_uuid: periodDeleted.per_uuid,
                per_periodnumber: periodDeleted.per_periodnumber,
                per_startdate: periodDeleted.per_startdate,
                per_enddate: periodDeleted.per_enddate,
                per_duedate: periodDeleted.per_duedate,
                sper_uuid: periodDeleted.sper_uuid,
                per_previousbalance: periodDeleted.per_previousbalance,
                per_interest: periodDeleted.per_interest,
                per_createdat: TimezoneConverter.toIsoStringInTimezone(periodDeleted.per_createdat, 'America/Buenos_Aires'),
                per_updatedat: TimezoneConverter.toIsoStringInTimezone(periodDeleted.per_updatedat, 'America/Buenos_Aires'),
            };
        } catch (error: any) {
            console.error('Error en deletePeriod (use case):', error.message);
            throw error;
        }
    }

    public async findPeriodByNumber(usr_uuid: string, crd_uuid: string, per_periodnumber: number) {
        try {
            const period = await this.periodRepository.findPeriodByNumber(usr_uuid, crd_uuid, per_periodnumber)
            if(period) {
                throw new Error(`Ya existe un período con el número ${per_periodnumber}.`);
            }
            return period
        } catch (error: any) {
            console.error('Error en findPeriodByNumber (use case):', error.message);
            throw error;
        }
    }
}