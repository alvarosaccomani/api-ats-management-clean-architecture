import { Sequelize } from 'sequelize';
import { PeriodEntity, PeriodUpdateData } from "../../../domain/period/period.entity";
import { PeriodRepository } from "../../../domain/period/period.repository";
import { SequelizePeriod } from "../../model/period/period.model";
import { Op } from "sequelize";
import { SequelizeStatusPeriod } from '../../model/status-period/status-period.model';

export class SequelizePeriodRepository implements PeriodRepository {
    async getPeriods(usr_uuid: string, crd_uuid: string): Promise<PeriodEntity[] | null> {
        try {
            const periods = await SequelizePeriod.findAll({
                where: {
                    usr_uuid: usr_uuid ?? null,
                    crd_uuid: crd_uuid ?? null
                },
                include: [
                    {
                        model: SequelizeStatusPeriod,
                        as: 'sper'
                    }
                ],
                order: [
                    [Sequelize.col('per_periodnumber'), 'DESC']
                ]
            });
            if(!periods) {
                throw new Error(`No hay períodos`)
            };
            return periods;
        } catch (error: any) {
            console.error('Error en getPeriods:', error.message);
            throw error;
        }
    }

    async findPeriodById(usr_uuid: string, crd_uuid: string, per_uuid: string): Promise<PeriodEntity | null> {
        try {
            const period = await SequelizePeriod.findOne({ 
                where: { 
                    usr_uuid: usr_uuid ?? null,
                    crd_uuid: crd_uuid ?? null,
                    per_uuid: per_uuid ?? null
                } 
            });
            if(!period) {
                throw new Error(`No hay período con el Id: ${per_uuid}`);
            };
            return period.dataValues;
        } catch (error: any) {
            console.error('Error en findPeriodById:', error.message);
            throw error;
        }
    }

    async createPeriod(period: PeriodEntity): Promise<PeriodEntity | null> {
        try {
            let { usr_uuid, crd_uuid, per_uuid, per_periodnumber, per_startdate, per_enddate, per_duedate, sper_uuid, per_previousbalance, per_interest, per_createdat, per_updatedat } = period
            const result = await SequelizePeriod.create({ usr_uuid, crd_uuid, per_uuid, per_periodnumber, per_startdate, per_enddate, per_duedate, sper_uuid, per_previousbalance, per_interest, per_createdat, per_updatedat });
            if(!result) {
                throw new Error(`No se ha agregado el período`);
            }
            let newPeriod = result.dataValues as SequelizePeriod
            return newPeriod;
        } catch (error: any) {
            console.error('Error en createPeriod:', error.message);
            throw error;
        }
    }

    async updatePeriod(usr_uuid: string, crd_uuid: string, per_uuid: string, period: PeriodUpdateData): Promise<PeriodEntity | null> {
        try {
            const [updatedCount, [updatedPeriod]] = await SequelizePeriod.update(
                {
                    per_periodnumber: period.per_periodnumber,
                    per_startdate: period.per_startdate,
                    per_enddate: period.per_enddate,
                    per_duedate: period.per_duedate,
                    sper_uuid: period.sper_uuid,
                    per_previousbalance: period.per_previousbalance,
                    per_interest: period.per_interest
                },
                {
                    where: { usr_uuid, crd_uuid, per_uuid },
                    returning: true,
                }
            );
            if (updatedCount === 0) {
                throw new Error(`No se ha actualizado el período`);
            }
            return updatedPeriod.get({ plain: true }) as PeriodEntity;
        } catch (error: any) {
            console.error('Error en updatePeriod:', error.message);
            throw error;
        }
    }

    async deletePeriod(usr_uuid: string, crd_uuid: string, per_uuid: string): Promise<PeriodEntity | null> {
        try {
            const period = await this.findPeriodById(usr_uuid, crd_uuid, per_uuid);
            const result = await SequelizePeriod.destroy({ where: { usr_uuid, crd_uuid, per_uuid } });
            if(!result) {
                throw new Error(`No se ha eliminado el período`);
            };
            return period;
        } catch (error: any) {
            console.error('Error en deletePeriod:', error.message);
            throw error;
        }
    }

    async findPeriodByNumber(usr_uuid: string, crd_uuid: string, per_periodnumber: number): Promise<PeriodEntity | null> {
        try {
            const period = await SequelizePeriod.findOne({ 
                where: { 
                    usr_uuid: usr_uuid ?? null,
                    crd_uuid: crd_uuid ?? null,
                    per_periodnumber: per_periodnumber ?? null
                } 
            });
            return period;
        } catch (error: any) {
            console.error('Error en findPeriodByNumber:', error.message);
            throw error;
        }
    }

    async findPeriodsByStatus(usr_uuid: string, crd_uuid: string, sper_uuid: string): Promise<PeriodEntity[] | null> {
        try {
            const periods = await SequelizePeriod.findAll({
                where: {
                    usr_uuid: usr_uuid ?? null,
                    crd_uuid: crd_uuid ?? null,
                    sper_uuid: sper_uuid ?? null
                }
            });
            return periods;
        } catch (error: any) {
            console.error('Error en findPeriodsByStatus:', error.message);
            throw error;
        }
    }

    async findOpenPeriods(usr_uuid: string, crd_uuid: string): Promise<PeriodEntity[] | null> {
        try {
            const periods = await SequelizePeriod.findAll({
                where: {
                    usr_uuid: usr_uuid ?? null,
                    crd_uuid: crd_uuid ?? null
                },
                limit: 1,
                order: [
                    [Sequelize.col('per_periodnumber'), 'DESC']
                ]
            });
            return periods;
        } catch (error: any) {
            console.error('Error en findOpenPeriods:', error.message);
            throw error;
        }
    }

    async findPeriodsByDateRange(usr_uuid: string, crd_uuid: string, startDate: Date, endDate: Date): Promise<PeriodEntity[] | null> {
        try {
            const periods = await SequelizePeriod.findAll({
                where: {
                    usr_uuid: usr_uuid ?? null,
                    crd_uuid: crd_uuid ?? null,
                    per_startdate: {
                        [Op.gte]: startDate
                    },
                    per_enddate: {
                        [Op.lte]: endDate
                    }
                }
            });
            return periods;
        } catch (error: any) {
            console.error('Error en findPeriodsByDateRange:', error.message);
            throw error;
        }
    }
}