import { Sequelize } from 'sequelize';
import { PaymentPeriodStatusEntity, PaymentPeriodStatusUpdateData } from "../../../domain/payment-period-status/payment-period-status.entity";
import { PaymentPeriodStatusRepository } from "../../../domain/payment-period-status/payment-period-status.repository";
import { SequelizePaymentPeriodStatus } from "../../model/payment-period-status/payment-period-status.model";
import { Op } from "sequelize";

export class SequelizePaymentPeriodStatusRepository implements PaymentPeriodStatusRepository {
    async getPaymentPeriodStatuses(): Promise<PaymentPeriodStatusEntity[] | null> {
        try {
            const paymentPeriodStatuses = await SequelizePaymentPeriodStatus.findAll({
                order: [
                    [Sequelize.col('payps_name'), 'ASC']
                ]
            });
            if(!paymentPeriodStatuses) {
                throw new Error(`No hay estados de pago de período`)
            };
            return paymentPeriodStatuses;
        } catch (error: any) {
            console.error('Error en getPaymentPeriodStatuses:', error.message);
            throw error;
        }
    }

    async findPaymentPeriodStatusById(payps_uuid: string): Promise<PaymentPeriodStatusEntity | null> {
        try {
            const paymentPeriodStatus = await SequelizePaymentPeriodStatus.findOne({ 
                where: { 
                    payps_uuid: payps_uuid ?? null
                } 
            });
            if(!paymentPeriodStatus) {
                throw new Error(`No hay estado de pago de período con el Id: ${payps_uuid}`);
            };
            return paymentPeriodStatus.dataValues;
        } catch (error: any) {
            console.error('Error en findPaymentPeriodStatusById:', error.message);
            throw error;
        }
    }

    async createPaymentPeriodStatus(paymentPeriodStatus: PaymentPeriodStatusEntity): Promise<PaymentPeriodStatusEntity | null> {
        try {
            let { payps_uuid, payps_name, payps_description, payps_createdat, payps_updatedat } = paymentPeriodStatus
            const result = await SequelizePaymentPeriodStatus.create({ payps_uuid, payps_name, payps_description, payps_createdat, payps_updatedat });
            if(!result) {
                throw new Error(`No se ha agregado el estado de pago de período`);
            }
            let newPaymentPeriodStatus = result.dataValues as SequelizePaymentPeriodStatus
            return newPaymentPeriodStatus;
        } catch (error: any) {
            console.error('Error en createPaymentPeriodStatus:', error.message);
            throw error;
        }
    }

    async updatePaymentPeriodStatus(payps_uuid: string, paymentPeriodStatus: PaymentPeriodStatusUpdateData): Promise<PaymentPeriodStatusEntity | null> {
        try {
            const [updatedCount, [updatedPaymentPeriodStatus]] = await SequelizePaymentPeriodStatus.update(
                {
                    payps_name: paymentPeriodStatus.payps_name,
                    payps_description: paymentPeriodStatus.payps_description
                },
                {
                    where: { payps_uuid },
                    returning: true,
                }
            );
            if (updatedCount === 0) {
                throw new Error(`No se ha actualizado el estado de pago de período`);
            }
            return updatedPaymentPeriodStatus.get({ plain: true }) as PaymentPeriodStatusEntity;
        } catch (error: any) {
            console.error('Error en updatePaymentPeriodStatus:', error.message);
            throw error;
        }
    }

    async deletePaymentPeriodStatus(payps_uuid: string): Promise<PaymentPeriodStatusEntity | null> {
        try {
            const paymentPeriodStatus = await this.findPaymentPeriodStatusById(payps_uuid);
            const result = await SequelizePaymentPeriodStatus.destroy({ where: { payps_uuid } });
            if(!result) {
                throw new Error(`No se ha eliminado el estado de pago de período`);
            };
            return paymentPeriodStatus;
        } catch (error: any) {
            console.error('Error en deletePaymentPeriodStatus:', error.message);
            throw error;
        }
    }

    async findPaymentPeriodStatusByName(payps_name: string, excludeUuid?: string | null): Promise<PaymentPeriodStatusEntity | null> {
        try {
            const whereCondition: any = { payps_name: payps_name ?? null };
            if (excludeUuid) {
                whereCondition.payps_uuid = { [Op.ne]: excludeUuid };
            }
            const paymentPeriodStatus = await SequelizePaymentPeriodStatus.findOne({ 
                where: whereCondition
            });
            return paymentPeriodStatus;
        } catch (error: any) {
            console.error('Error en findPaymentPeriodStatusByName:', error.message);
            throw error;
        }
    }
}