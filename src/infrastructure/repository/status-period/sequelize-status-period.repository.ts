import { Sequelize } from 'sequelize';
import { StatusPeriodEntity, StatusPeriodUpdateData } from "../../../domain/status-period/status-period.entity";
import { StatusPeriodRepository } from "../../../domain/status-period/status-period.repository";
import { SequelizeStatusPeriod } from "../../model/status-period/status-period.model";
import { Op } from "sequelize";

export class SequelizeStatusPeriodRepository implements StatusPeriodRepository {
    async getStatusPeriods(): Promise<StatusPeriodEntity[] | null> {
        try {
            const statusPeriods = await SequelizeStatusPeriod.findAll({
                order: [
                    [Sequelize.col('sper_name'), 'ASC']
                ]
            });
            if(!statusPeriods) {
                throw new Error(`No hay estados de período`)
            };
            return statusPeriods;
        } catch (error: any) {
            console.error('Error en getStatusPeriods:', error.message);
            throw error;
        }
    }

    async findStatusPeriodById(sper_uuid: string): Promise<StatusPeriodEntity | null> {
        try {
            const statusPeriod = await SequelizeStatusPeriod.findOne({ 
                where: { 
                    sper_uuid: sper_uuid ?? null
                } 
            });
            if(!statusPeriod) {
                throw new Error(`No hay estado de período con el Id: ${sper_uuid}`);
            };
            return statusPeriod.dataValues;
        } catch (error: any) {
            console.error('Error en findStatusPeriodById:', error.message);
            throw error;
        }
    }

    async createStatusPeriod(statusPeriod: StatusPeriodEntity): Promise<StatusPeriodEntity | null> {
        try {
            let { sper_uuid, sper_name, sper_description, sper_createdat, sper_updatedat } = statusPeriod
            const result = await SequelizeStatusPeriod.create({ sper_uuid, sper_name, sper_description, sper_createdat, sper_updatedat });
            if(!result) {
                throw new Error(`No se ha agregado el estado de período`);
            }
            let newStatusPeriod = result.dataValues as SequelizeStatusPeriod
            return newStatusPeriod;
        } catch (error: any) {
            console.error('Error en createStatusPeriod:', error.message);
            throw error;
        }
    }

    async updateStatusPeriod(sper_uuid: string, statusPeriod: StatusPeriodUpdateData): Promise<StatusPeriodEntity | null> {
        try {
            const [updatedCount, [updatedStatusPeriod]] = await SequelizeStatusPeriod.update(
                {
                    sper_name: statusPeriod.sper_name,
                    sper_description: statusPeriod.sper_description
                },
                {
                    where: { sper_uuid },
                    returning: true,
                }
            );
            if (updatedCount === 0) {
                throw new Error(`No se ha actualizado el estado de período`);
            }
            return updatedStatusPeriod.get({ plain: true }) as StatusPeriodEntity;
        } catch (error: any) {
            console.error('Error en updateStatusPeriod:', error.message);
            throw error;
        }
    }

    async deleteStatusPeriod(sper_uuid: string): Promise<StatusPeriodEntity | null> {
        try {
            const statusPeriod = await this.findStatusPeriodById(sper_uuid);
            const result = await SequelizeStatusPeriod.destroy({ where: { sper_uuid } });
            if(!result) {
                throw new Error(`No se ha eliminado el estado de período`);
            };
            return statusPeriod;
        } catch (error: any) {
            console.error('Error en deleteStatusPeriod:', error.message);
            throw error;
        }
    }

    async findStatusPeriodByName(sper_name: string, excludeUuid?: string | null): Promise<StatusPeriodEntity | null> {
        try {
            const whereCondition: any = { sper_name: sper_name ?? null };
            if (excludeUuid) {
                whereCondition.sper_uuid = { [Op.ne]: excludeUuid };
            }
            const statusPeriod = await SequelizeStatusPeriod.findOne({ 
                where: whereCondition
            });
            return statusPeriod;
        } catch (error: any) {
            console.error('Error en findStatusPeriodByName:', error.message);
            throw error;
        }
    }
}