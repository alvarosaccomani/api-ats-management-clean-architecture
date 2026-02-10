import { Sequelize } from 'sequelize';
import { VoucherFeeStatusEntity, VoucherFeeStatusUpdateData } from "../../../domain/voucher-fee-status/voucher-fee-status.entity";
import { VoucherFeeStatusRepository } from "../../../domain/voucher-fee-status/voucher-fee-status.repository";
import { SequelizeVoucherFeeStatus } from "../../model/voucher-fee-status/voucher-fee-status.model";
import { Op } from "sequelize";

export class SequelizeVoucherFeeStatusRepository implements VoucherFeeStatusRepository {
    async getVoucherFeeStatuses(): Promise<VoucherFeeStatusEntity[] | null> {
        try {
            const voucherFeeStatuses = await SequelizeVoucherFeeStatus.findAll({
                order: [
                    [Sequelize.col('voufs_name'), 'ASC']
                ]
            });
            if(!voucherFeeStatuses) {
                throw new Error(`No hay estados de cuota de comprobante`)
            };
            return voucherFeeStatuses;
        } catch (error: any) {
            console.error('Error en getVoucherFeeStatuses:', error.message);
            throw error;
        }
    }

    async findVoucherFeeStatusById(voufs_uuid: string): Promise<VoucherFeeStatusEntity | null> {
        try {
            const voucherFeeStatus = await SequelizeVoucherFeeStatus.findOne({ 
                where: { 
                    voufs_uuid: voufs_uuid ?? null
                } 
            });
            if(!voucherFeeStatus) {
                throw new Error(`No hay estado de cuota de comprobante con el Id: ${voufs_uuid}`);
            };
            return voucherFeeStatus.dataValues;
        } catch (error: any) {
            console.error('Error en findVoucherFeeStatusById:', error.message);
            throw error;
        }
    }

    async createVoucherFeeStatus(voucherFeeStatus: VoucherFeeStatusEntity): Promise<VoucherFeeStatusEntity | null> {
        try {
            let { voufs_uuid, voufs_name, voufs_description, voufs_createdat, voufs_updatedat } = voucherFeeStatus
            const result = await SequelizeVoucherFeeStatus.create({ voufs_uuid, voufs_name, voufs_description, voufs_createdat, voufs_updatedat });
            if(!result) {
                throw new Error(`No se ha agregado el estado de cuota de comprobante`);
            }
            let newVoucherFeeStatus = result.dataValues as SequelizeVoucherFeeStatus
            return newVoucherFeeStatus;
        } catch (error: any) {
            console.error('Error en createVoucherFeeStatus:', error.message);
            throw error;
        }
    }

    async updateVoucherFeeStatus(voufs_uuid: string, voucherFeeStatus: VoucherFeeStatusUpdateData): Promise<VoucherFeeStatusEntity | null> {
        try {
            const [updatedCount, [updatedVoucherFeeStatus]] = await SequelizeVoucherFeeStatus.update(
                {
                    voufs_name: voucherFeeStatus.voufs_name,
                    voufs_description: voucherFeeStatus.voufs_description
                },
                {
                    where: { voufs_uuid },
                    returning: true,
                }
            );
            if (updatedCount === 0) {
                throw new Error(`No se ha actualizado el estado de cuota de comprobante`);
            }
            return updatedVoucherFeeStatus.get({ plain: true }) as VoucherFeeStatusEntity;
        } catch (error: any) {
            console.error('Error en updateVoucherFeeStatus:', error.message);
            throw error;
        }
    }

    async deleteVoucherFeeStatus(voufs_uuid: string): Promise<VoucherFeeStatusEntity | null> {
        try {
            const voucherFeeStatus = await this.findVoucherFeeStatusById(voufs_uuid);
            const result = await SequelizeVoucherFeeStatus.destroy({ where: { voufs_uuid } });
            if(!result) {
                throw new Error(`No se ha eliminado el estado de cuota de comprobante`);
            };
            return voucherFeeStatus;
        } catch (error: any) {
            console.error('Error en deleteVoucherFeeStatus:', error.message);
            throw error;
        }
    }

    async findVoucherFeeStatusByName(voufs_name: string, excludeUuid?: string | null): Promise<VoucherFeeStatusEntity | null> {
        try {
            const whereCondition: any = { voufs_name: voufs_name ?? null };
            if (excludeUuid) {
                whereCondition.voufs_uuid = { [Op.ne]: excludeUuid };
            }
            const voucherFeeStatus = await SequelizeVoucherFeeStatus.findOne({ 
                where: whereCondition
            });
            return voucherFeeStatus;
        } catch (error: any) {
            console.error('Error en findVoucherFeeStatusByName:', error.message);
            throw error;
        }
    }
}