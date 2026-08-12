import { Sequelize } from 'sequelize';
import { PendingVoucherEntity, PendingVoucherUpdateData } from "../../../domain/pending-voucher/pending-voucher.entity";
import { PendingVoucherRepository } from "../../../domain/pending-voucher/pending-voucher.repository";
import { SequelizePendingVoucher } from "../../model/pending-voucher/pending-voucher.model";
import { Op } from "sequelize";

export class SequelizePendingVoucherRepository implements PendingVoucherRepository {
    async getPendingVouchers(usr_uuid: string): Promise<PendingVoucherEntity[] | null> {
        try {
            const pendingVouchers = await SequelizePendingVoucher.findAll({
                where: {
                    usr_uuid: usr_uuid ?? null
                },
                order: [
                    [Sequelize.col('pevou_createdat'), 'ASC']
                ]
            });
            if(!pendingVouchers) {
                throw new Error(`No hay comprobantes pendientes`)
            };
            return pendingVouchers;
        } catch (error: any) {
            console.error('Error en getPendingVouchers:', error.message);
            throw error;
        }
    }

    async findPendingVoucherById(usr_uuid: string, pevou_uuid: string): Promise<PendingVoucherEntity | null> {
        try {
            const pendingVoucher = await SequelizePendingVoucher.findOne({ 
                where: { 
                    usr_uuid: usr_uuid ?? null,
                    pevou_uuid: pevou_uuid ?? null
                } 
            });
            if(!pendingVoucher) {
                throw new Error(`No hay comprobante pendiente con el Id: ${pevou_uuid}`);
            };
            return pendingVoucher.dataValues;
        } catch (error: any) {
            console.error('Error en findPendingVoucherById:', error.message);
            throw error;
        }
    }

    async createPendingVoucher(pendingVoucher: PendingVoucherEntity): Promise<PendingVoucherEntity | null> {
        try {
            let { usr_uuid, pevou_uuid, pevou_name, pevou_image, pevou_unreadcontent, pevou_unreadtext, pevou_createdat, pevou_updatedat } = pendingVoucher
            const result = await SequelizePendingVoucher.create({ usr_uuid, pevou_uuid, pevou_name, pevou_image, pevou_unreadcontent, pevou_unreadtext, pevou_createdat, pevou_updatedat });
            if(!result) {
                throw new Error(`No se ha agregado el comprobante pendiente`);
            }
            let newPendingVoucher = result.dataValues as SequelizePendingVoucher
            return newPendingVoucher;
        } catch (error: any) {
            console.error('Error en createPendingVoucher:', error.message);
            throw error;
        }
    }

    async updatePendingVoucher(usr_uuid: string, pevou_uuid: string, pendingVoucher: PendingVoucherUpdateData): Promise<PendingVoucherEntity | null> {
        try {
            const [updatedCount, [updatedPendingVoucher]] = await SequelizePendingVoucher.update(
                {
                    pevou_image: pendingVoucher.pevou_image,
                    pevou_unreadcontent: pendingVoucher.pevou_unreadcontent,
                    pevou_unreadtext: pendingVoucher.pevou_unreadtext
                },
                {
                    where: { usr_uuid, pevou_uuid },
                    returning: true,
                }
            );
            if (updatedCount === 0) {
                throw new Error(`No se ha actualizado el comprobante pendiente`);
            }
            return updatedPendingVoucher.get({ plain: true }) as PendingVoucherEntity;
        } catch (error: any) {
            console.error('Error en updatePendingVoucher:', error.message);
            throw error;
        }
    }

    async deletePendingVoucher(usr_uuid: string, pevou_uuid: string): Promise<PendingVoucherEntity | null> {
        try {
            const pendingVoucher = await this.findPendingVoucherById(usr_uuid, pevou_uuid);
            const result = await SequelizePendingVoucher.destroy({ where: { usr_uuid, pevou_uuid } });
            if(!result) {
                throw new Error(`No se ha eliminado el comprobante pendiente`);
            };
            return pendingVoucher;
        } catch (error: any) {
            console.error('Error en deleteVoucherState:', error.message);
            throw error;
        }
    }

    async findPendingVoucherByName(usr_uuid: string, pevou_name: string, excludeUuid?: string | null): Promise<PendingVoucherEntity | null> {
        try {
            const whereCondition: any = {
                usr_uuid: usr_uuid ?? null,
                pevou_name: pevou_name ?? null
            };
            if (excludeUuid) {
                whereCondition.pevou_uuid = { [Op.ne]: excludeUuid };
            }
            const pendingVoucher = await SequelizePendingVoucher.findOne({ 
                where: whereCondition
            });
            return pendingVoucher;
        } catch (error: any) {
            console.error('Error en findPendingVoucherByName:', error.message);
            throw error;
        }
    }
}