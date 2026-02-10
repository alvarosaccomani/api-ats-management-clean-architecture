import { Sequelize } from 'sequelize';
import { VoucherFeeEntity, VoucherFeeUpdateData } from "../../../domain/voucher-fee/voucher-fee.entity";
import { VoucherFeeRepository } from "../../../domain/voucher-fee/voucher-fee.repository";
import { SequelizeVoucherFee } from "../../model/voucher-fee/voucher-fee.model";
import { Op } from "sequelize";
import { SequelizeVoucherFeeStatus } from '../../model/voucher-fee-status/voucher-fee-status.model';

export class SequelizeVoucherFeeRepository implements VoucherFeeRepository {
    async getVoucherFees(usr_uuid: string, crd_uuid: string, per_uuid: string, vou_uuid: string): Promise<VoucherFeeEntity[] | null> {
        try {
            const voucherFees = await SequelizeVoucherFee.findAll({
                where: {
                    usr_uuid: usr_uuid ?? null,
                    crd_uuid: crd_uuid ?? null,
                    per_uuid: per_uuid ?? null,
                    vou_uuid: vou_uuid ?? null
                },
                include: [
                    {
                        model: SequelizeVoucherFeeStatus,
                        as: 'voufs'
                    }
                ],
                order: [
                    [Sequelize.col('vouf_quotanumber'), 'ASC']
                ]
            });
            if(!voucherFees) {
                throw new Error(`No hay cuotas de comprobante`)
            };
            return voucherFees;
        } catch (error: any) {
            console.error('Error en getVoucherFees:', error.message);
            throw error;
        }
    }

    async findVoucherFeeById(usr_uuid: string, crd_uuid: string, per_uuid: string, vou_uuid: string, vouf_uuid: string): Promise<VoucherFeeEntity | null> {
        try {
            const voucherFee = await SequelizeVoucherFee.findOne({ 
                where: { 
                    usr_uuid: usr_uuid ?? null,
                    crd_uuid: crd_uuid ?? null,
                    per_uuid: per_uuid ?? null,
                    vou_uuid: vou_uuid ?? null,
                    vouf_uuid: vouf_uuid ?? null
                } 
            });
            if(!voucherFee) {
                throw new Error(`No hay cuota de comprobante con el Id: ${vouf_uuid}`);
            };
            return voucherFee.dataValues;
        } catch (error: any) {
            console.error('Error en findVoucherFeeById:', error.message);
            throw error;
        }
    }

    async createVoucherFee(voucherFee: VoucherFeeEntity): Promise<VoucherFeeEntity | null> {
        try {
            let { usr_uuid, crd_uuid, per_uuid, vou_uuid, vouf_uuid, vouf_quotanumber, vouf_quotaamount, vouf_quotaduedate, voufs_uuid, vouf_createdat, vouf_updatedat } = voucherFee
            const result = await SequelizeVoucherFee.create({ usr_uuid, crd_uuid, per_uuid, vou_uuid, vouf_uuid, vouf_quotanumber, vouf_quotaamount, vouf_quotaduedate, voufs_uuid, vouf_createdat, vouf_updatedat });
            if(!result) {
                throw new Error(`No se ha agregado la cuota de comprobante`);
            }
            let newVoucherFee = result.dataValues as SequelizeVoucherFee
            return newVoucherFee;
        } catch (error: any) {
            console.error('Error en createVoucherFee:', error.message);
            throw error;
        }
    }

    async updateVoucherFee(usr_uuid: string, crd_uuid: string, per_uuid: string, vou_uuid: string, vouf_uuid: string, voucherFee: VoucherFeeUpdateData): Promise<VoucherFeeEntity | null> {
        try {
            const [updatedCount, [updatedVoucherFee]] = await SequelizeVoucherFee.update(
                {
                    vouf_quotanumber: voucherFee.vouf_quotanumber,
                    vouf_quotaamount: voucherFee.vouf_quotaamount,
                    vouf_quotaduedate: voucherFee.vouf_quotaduedate,
                    voufs_uuid: voucherFee.voufs_uuid
                },
                {
                    where: { usr_uuid, crd_uuid, per_uuid, vou_uuid, vouf_uuid },
                    returning: true,
                }
            );
            if (updatedCount === 0) {
                throw new Error(`No se ha actualizado la cuota de comprobante`);
            }
            return updatedVoucherFee.get({ plain: true }) as VoucherFeeEntity;
        } catch (error: any) {
            console.error('Error en updateVoucherFee:', error.message);
            throw error;
        }
    }

    async deleteVoucherFee(usr_uuid: string, crd_uuid: string, per_uuid: string, vou_uuid: string, vouf_uuid: string): Promise<VoucherFeeEntity | null> {
        try {
            const voucherFee = await this.findVoucherFeeById(usr_uuid, crd_uuid, per_uuid, vou_uuid, vouf_uuid);
            const result = await SequelizeVoucherFee.destroy({ where: { usr_uuid, crd_uuid, per_uuid, vou_uuid, vouf_uuid } });
            if(!result) {
                throw new Error(`No se ha eliminado la cuota de comprobante`);
            };
            return voucherFee;
        } catch (error: any) {
            console.error('Error en deleteVoucherFee:', error.message);
            throw error;
        }
    }

    async findVoucherFeesByStatus(usr_uuid: string, crd_uuid: string, per_uuid: string, vou_uuid: string, voufs_uuid: string): Promise<VoucherFeeEntity[] | null> {
        try {
            const voucherFees = await SequelizeVoucherFee.findAll({
                where: {
                    usr_uuid: usr_uuid ?? null,
                    crd_uuid: crd_uuid ?? null,
                    per_uuid: per_uuid ?? null,
                    vou_uuid: vou_uuid ?? null,
                    voufs_uuid: voufs_uuid ?? null
                }
            });
            return voucherFees;
        } catch (error: any) {
            console.error('Error en findVoucherFeesByStatus:', error.message);
            throw error;
        }
    }

    async findPendingFees(usr_uuid: string, crd_uuid: string, per_uuid: string, vou_uuid: string): Promise<VoucherFeeEntity[] | null> {
        try {
            const voucherFees = await SequelizeVoucherFee.findAll({
                where: {
                    usr_uuid: usr_uuid ?? null,
                    crd_uuid: crd_uuid ?? null,
                    per_uuid: per_uuid ?? null,
                    vou_uuid: vou_uuid ?? null
                },
                order: [
                    [Sequelize.col('vouf_quotaduedate'), 'ASC']
                ]
            });
            return voucherFees;
        } catch (error: any) {
            console.error('Error en findPendingFees:', error.message);
            throw error;
        }
    }

    async findVoucherFeesByDueDateRange(usr_uuid: string, crd_uuid: string, per_uuid: string, vou_uuid: string, startDate: Date, endDate: Date): Promise<VoucherFeeEntity[] | null> {
        try {
            const voucherFees = await SequelizeVoucherFee.findAll({
                where: {
                    usr_uuid: usr_uuid ?? null,
                    crd_uuid: crd_uuid ?? null,
                    per_uuid: per_uuid ?? null,
                    vou_uuid: vou_uuid ?? null,
                    vouf_quotaduedate: {
                        [Op.between]: [startDate, endDate]
                    }
                }
            });
            return voucherFees;
        } catch (error: any) {
            console.error('Error en findVoucherFeesByDueDateRange:', error.message);
            throw error;
        }
    }
}