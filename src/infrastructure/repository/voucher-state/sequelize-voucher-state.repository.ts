import { Sequelize } from 'sequelize';
import { VoucherStateEntity, VoucherStateUpdateData } from "../../../domain/voucher-state/voucher-state.entity";
import { VoucherStateRepository } from "../../../domain/voucher-state/voucher-state.repository";
import { SequelizeVoucherState } from "../../model/voucher-state/voucher-state.model";
import { Op } from "sequelize";

export class SequelizeVoucherStateRepository implements VoucherStateRepository {
    async getVoucherStates(): Promise<VoucherStateEntity[] | null> {
        try {
            const voucherStates = await SequelizeVoucherState.findAll({
                order: [
                    [Sequelize.col('vous_name'), 'ASC']
                ]
            });
            if(!voucherStates) {
                throw new Error(`No hay estados de comprobante`)
            };
            return voucherStates;
        } catch (error: any) {
            console.error('Error en getVoucherStates:', error.message);
            throw error;
        }
    }

    async findVoucherStateById(vous_uuid: string): Promise<VoucherStateEntity | null> {
        try {
            const voucherState = await SequelizeVoucherState.findOne({ 
                where: { 
                    vous_uuid: vous_uuid ?? null
                } 
            });
            if(!voucherState) {
                throw new Error(`No hay estado de comprobante con el Id: ${vous_uuid}`);
            };
            return voucherState.dataValues;
        } catch (error: any) {
            console.error('Error en findVoucherStateById:', error.message);
            throw error;
        }
    }

    async createVoucherState(voucherState: VoucherStateEntity): Promise<VoucherStateEntity | null> {
        try {
            let { vous_uuid, vous_name, vous_description, vous_createdat, vous_updatedat } = voucherState
            const result = await SequelizeVoucherState.create({ vous_uuid, vous_name, vous_description, vous_createdat, vous_updatedat });
            if(!result) {
                throw new Error(`No se ha agregado el estado de comprobante`);
            }
            let newVoucherState = result.dataValues as SequelizeVoucherState
            return newVoucherState;
        } catch (error: any) {
            console.error('Error en createVoucherState:', error.message);
            throw error;
        }
    }

    async updateVoucherState(vous_uuid: string, voucherState: VoucherStateUpdateData): Promise<VoucherStateEntity | null> {
        try {
            const [updatedCount, [updatedVoucherState]] = await SequelizeVoucherState.update(
                {
                    vous_name: voucherState.vous_name,
                    vous_description: voucherState.vous_description
                },
                {
                    where: { vous_uuid },
                    returning: true,
                }
            );
            if (updatedCount === 0) {
                throw new Error(`No se ha actualizado el estado de comprobante`);
            }
            return updatedVoucherState.get({ plain: true }) as VoucherStateEntity;
        } catch (error: any) {
            console.error('Error en updateVoucherState:', error.message);
            throw error;
        }
    }

    async deleteVoucherState(vous_uuid: string): Promise<VoucherStateEntity | null> {
        try {
            const voucherState = await this.findVoucherStateById(vous_uuid);
            const result = await SequelizeVoucherState.destroy({ where: { vous_uuid } });
            if(!result) {
                throw new Error(`No se ha eliminado el estado de comprobante`);
            };
            return voucherState;
        } catch (error: any) {
            console.error('Error en deleteVoucherState:', error.message);
            throw error;
        }
    }

    async findVoucherStateByName(vous_name: string, excludeUuid?: string | null): Promise<VoucherStateEntity | null> {
        try {
            const whereCondition: any = { vous_name: vous_name ?? null };
            if (excludeUuid) {
                whereCondition.vous_uuid = { [Op.ne]: excludeUuid };
            }
            const voucherState = await SequelizeVoucherState.findOne({ 
                where: whereCondition
            });
            return voucherState;
        } catch (error: any) {
            console.error('Error en findVoucherStateByName:', error.message);
            throw error;
        }
    }
}