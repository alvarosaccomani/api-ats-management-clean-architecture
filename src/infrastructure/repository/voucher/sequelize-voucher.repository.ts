import { Sequelize } from 'sequelize';
import { VoucherEntity, VoucherUpdateData } from "../../../domain/voucher/voucher.entity";
import { VoucherRepository } from "../../../domain/voucher/voucher.repository";
import { SequelizeVoucher } from "../../model/voucher/voucher.model";
import { Op } from "sequelize";
import { SequelizeTypeOperation } from '../../model/type-operation/type-operation.model';
import { SequelizeVoucherState } from '../../model/voucher-state/voucher-state.model';

export class SequelizeVoucherRepository implements VoucherRepository {
    async getVouchers(usr_uuid: string, crd_uuid: string, per_uuid: string): Promise<VoucherEntity[] | null> {
        try {
            const vouchers = await SequelizeVoucher.findAll({
                where: {
                    usr_uuid: usr_uuid ?? null,
                    crd_uuid: crd_uuid ?? null,
                    per_uuid: per_uuid ?? null
                },
                include: [
                    {
                        model: SequelizeTypeOperation,
                        as: 'tyop'
                    },
                    {
                        model: SequelizeVoucherState,
                        as: 'vous'
                    }
                ],
                order: [
                    [Sequelize.col('vou_datetime'), 'DESC']
                ]
            });
            if(!vouchers) {
                throw new Error(`No hay comprobantes`)
            };
            return vouchers;
        } catch (error: any) {
            console.error('Error en getVouchers:', error.message);
            throw error;
        }
    }

    async findVoucherById(usr_uuid: string, crd_uuid: string, per_uuid: string, vou_uuid: string): Promise<VoucherEntity | null> {
        try {
            const voucher = await SequelizeVoucher.findOne({ 
                where: { 
                    usr_uuid: usr_uuid ?? null,
                    crd_uuid: crd_uuid ?? null,
                    per_uuid: per_uuid ?? null,
                    vou_uuid: vou_uuid ?? null
                } 
            });
            if(!voucher) {
                throw new Error(`No hay comprobante con el Id: ${vou_uuid}`);
            };
            return voucher.dataValues;
        } catch (error: any) {
            console.error('Error en findVoucherById:', error.message);
            throw error;
        }
    }

    async createVoucher(voucher: VoucherEntity): Promise<VoucherEntity | null> {
        try {
            let { usr_uuid, crd_uuid, per_uuid, vou_uuid, vou_authorizationnumber, vou_transactionnumber, vou_datetime, vou_amount, vou_currency, vou_commercename, vou_commercecuit, vou_commercecategory, tyop_uuid, vou_installments, vou_installmentcount, vou_installmentinterest, vou_poscode, vou_reference, vous_uuid, vou_image, vou_notes, vou_createdat, vou_updatedat } = voucher
            const result = await SequelizeVoucher.create({ usr_uuid, crd_uuid, per_uuid, vou_uuid, vou_authorizationnumber, vou_transactionnumber, vou_datetime, vou_amount, vou_currency, vou_commercename, vou_commercecuit, vou_commercecategory, tyop_uuid, vou_installments, vou_installmentcount, vou_installmentinterest, vou_poscode, vou_reference, vous_uuid, vou_image, vou_notes, vou_createdat, vou_updatedat });
            if(!result) {
                throw new Error(`No se ha agregado el comprobante`);
            }
            let newVoucher = result.dataValues as SequelizeVoucher
            return newVoucher;
        } catch (error: any) {
            console.error('Error en createVoucher:', error.message);
            throw error;
        }
    }

    async updateVoucher(usr_uuid: string, crd_uuid: string, per_uuid: string, vou_uuid: string, voucher: VoucherUpdateData): Promise<VoucherEntity | null> {
        try {
            const [updatedCount, [updatedVoucher]] = await SequelizeVoucher.update(
                {
                    vou_authorizationnumber: voucher.vou_authorizationnumber,
                    vou_transactionnumber: voucher.vou_transactionnumber,
                    vou_datetime: voucher.vou_datetime,
                    vou_amount: voucher.vou_amount,
                    vou_currency: voucher.vou_currency,
                    vou_commercename: voucher.vou_commercename,
                    vou_commercecuit: voucher.vou_commercecuit,
                    vou_commercecategory: voucher.vou_commercecategory,
                    tyop_uuid: voucher.tyop_uuid,
                    vou_installments: voucher.vou_installments,
                    vou_installmentcount: voucher.vou_installmentcount,
                    vou_installmentinterest: voucher.vou_installmentinterest,
                    vou_poscode: voucher.vou_poscode,
                    vou_reference: voucher.vou_reference,
                    vous_uuid: voucher.vous_uuid,
                    vou_image: voucher.vou_image,
                    vou_notes: voucher.vou_notes
                },
                {
                    where: { usr_uuid, crd_uuid, per_uuid, vou_uuid },
                    returning: true,
                }
            );
            if (updatedCount === 0) {
                throw new Error(`No se ha actualizado el comprobante`);
            }
            return updatedVoucher.get({ plain: true }) as VoucherEntity;
        } catch (error: any) {
            console.error('Error en updateVoucher:', error.message);
            throw error;
        }
    }

    async deleteVoucher(usr_uuid: string, crd_uuid: string, per_uuid: string, vou_uuid: string): Promise<VoucherEntity | null> {
        try {
            const voucher = await this.findVoucherById(usr_uuid, crd_uuid, per_uuid, vou_uuid);
            const result = await SequelizeVoucher.destroy({ where: { usr_uuid, crd_uuid, per_uuid, vou_uuid } });
            if(!result) {
                throw new Error(`No se ha eliminado el comprobante`);
            };
            return voucher;
        } catch (error: any) {
            console.error('Error en deleteVoucher:', error.message);
            throw error;
        }
    }

    async findVoucherByTransactionNumber(vou_transactionnumber: string): Promise<VoucherEntity | null> {
        try {
            const voucher = await SequelizeVoucher.findOne({ 
                where: { 
                    vou_transactionnumber: vou_transactionnumber ?? null
                } 
            });
            return voucher;
        } catch (error: any) {
            console.error('Error en findVoucherByTransactionNumber:', error.message);
            throw error;
        }
    }

    async findVouchersByType(usr_uuid: string, crd_uuid: string, per_uuid: string, tyop_uuid: string): Promise<VoucherEntity[] | null> {
        try {
            const vouchers = await SequelizeVoucher.findAll({
                where: {
                    usr_uuid: usr_uuid ?? null,
                    crd_uuid: crd_uuid ?? null,
                    per_uuid: per_uuid ?? null,
                    tyop_uuid: tyop_uuid ?? null
                }
            });
            return vouchers;
        } catch (error: any) {
            console.error('Error en findVouchersByType:', error.message);
            throw error;
        }
    }

    async findVouchersByState(usr_uuid: string, crd_uuid: string, per_uuid: string, vous_uuid: string): Promise<VoucherEntity[] | null> {
        try {
            const vouchers = await SequelizeVoucher.findAll({
                where: {
                    usr_uuid: usr_uuid ?? null,
                    crd_uuid: crd_uuid ?? null,
                    per_uuid: per_uuid ?? null,
                    vous_uuid: vous_uuid ?? null
                }
            });
            return vouchers;
        } catch (error: any) {
            console.error('Error en findVouchersByState:', error.message);
            throw error;
        }
    }

    async findVouchersByCommerce(usr_uuid: string, crd_uuid: string, per_uuid: string, vou_commercename: string): Promise<VoucherEntity[] | null> {
        try {
            const vouchers = await SequelizeVoucher.findAll({
                where: {
                    usr_uuid: usr_uuid ?? null,
                    crd_uuid: crd_uuid ?? null,
                    per_uuid: per_uuid ?? null,
                    vou_commercename: {
                        [Op.like]: `%${vou_commercename}%`
                    }
                }
            });
            return vouchers;
        } catch (error: any) {
            console.error('Error en findVouchersByCommerce:', error.message);
            throw error;
        }
    }

    async findVouchersByDateRange(usr_uuid: string, crd_uuid: string, per_uuid: string, startDate: Date, endDate: Date): Promise<VoucherEntity[] | null> {
        try {
            const vouchers = await SequelizeVoucher.findAll({
                where: {
                    usr_uuid: usr_uuid ?? null,
                    crd_uuid: crd_uuid ?? null,
                    per_uuid: per_uuid ?? null,
                    vou_datetime: {
                        [Op.between]: [startDate, endDate]
                    }
                }
            });
            return vouchers;
        } catch (error: any) {
            console.error('Error en findVouchersByDateRange:', error.message);
            throw error;
        }
    }

    async findVouchersByAmountRange(usr_uuid: string, crd_uuid: string, per_uuid: string, minAmount: number, maxAmount: number): Promise<VoucherEntity[] | null> {
        try {
            const vouchers = await SequelizeVoucher.findAll({
                where: {
                    usr_uuid: usr_uuid ?? null,
                    crd_uuid: crd_uuid ?? null,
                    per_uuid: per_uuid ?? null,
                    vou_amount: {
                        [Op.between]: [minAmount, maxAmount]
                    }
                }
            });
            return vouchers;
        } catch (error: any) {
            console.error('Error en findVouchersByAmountRange:', error.message);
            throw error;
        }
    }
}