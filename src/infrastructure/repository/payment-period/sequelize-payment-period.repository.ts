import { Sequelize } from 'sequelize';
import { PaymentPeriodEntity, PaymentPeriodUpdateData } from "../../../domain/payment-period/payment-period.entity";
import { PaymentPeriodRepository } from "../../../domain/payment-period/payment-period.repository";
import { SequelizePaymentPeriod } from "../../model/payment-period/payment-period.model";
import { Op } from "sequelize";
import { SequelizePaymentMethod } from '../../model/payment-method/payment-method.model';
import { SequelizePaymentPeriodStatus } from '../../model/payment-period-status/payment-period-status.model';

export class SequelizePaymentPeriodRepository implements PaymentPeriodRepository {
    async getPaymentsPeriod(usr_uuid: string, crd_uuid: string, per_uuid: string): Promise<PaymentPeriodEntity[] | null> {
        try {
            const paymentsPeriod = await SequelizePaymentPeriod.findAll({
                where: {
                    usr_uuid: usr_uuid ?? null,
                    crd_uuid: crd_uuid ?? null,
                    per_uuid: per_uuid ?? null
                },
                include: [
                    {
                        model: SequelizePaymentMethod,
                        as: 'paym'
                    },
                    {
                        model: SequelizePaymentPeriodStatus,
                        as: 'payps'
                    }
                ],
                order: [
                    [Sequelize.col('payp_paymentdate'), 'DESC']
                ]
            });
            if(!paymentsPeriod) {
                throw new Error(`No hay pagos de período`)
            };
            return paymentsPeriod;
        } catch (error: any) {
            console.error('Error en getPaymentsPeriod:', error.message);
            throw error;
        }
    }

    async findPaymentPeriodById(usr_uuid: string, crd_uuid: string, per_uuid: string, payp_uuid: string): Promise<PaymentPeriodEntity | null> {
        try {
            const paymentPeriod = await SequelizePaymentPeriod.findOne({ 
                where: { 
                    usr_uuid: usr_uuid ?? null,
                    crd_uuid: crd_uuid ?? null,
                    per_uuid: per_uuid ?? null,
                    payp_uuid: payp_uuid ?? null
                } 
            });
            if(!paymentPeriod) {
                throw new Error(`No hay pago de período con el Id: ${payp_uuid}`);
            };
            return paymentPeriod.dataValues;
        } catch (error: any) {
            console.error('Error en findPaymentPeriodById:', error.message);
            throw error;
        }
    }

    async createPaymentPeriod(paymentPeriod: PaymentPeriodEntity): Promise<PaymentPeriodEntity | null> {
        try {
            let { usr_uuid, crd_uuid, per_uuid, payp_uuid, payp_paymentdate, payp_amountpaid, paym_uuid, payp_paymentreference, payps_uuid, payp_createdat, payp_updatedat } = paymentPeriod
            const result = await SequelizePaymentPeriod.create({ usr_uuid, crd_uuid, per_uuid, payp_uuid, payp_paymentdate, payp_amountpaid, paym_uuid, payp_paymentreference, payps_uuid, payp_createdat, payp_updatedat });
            if(!result) {
                throw new Error(`No se ha agregado el pago de período`);
            }
            let newPaymentPeriod = result.dataValues as SequelizePaymentPeriod
            return newPaymentPeriod;
        } catch (error: any) {
            console.error('Error en createPaymentPeriod:', error.message);
            throw error;
        }
    }

    async updatePaymentPeriod(usr_uuid: string, crd_uuid: string, per_uuid: string, payp_uuid: string, paymentPeriod: PaymentPeriodUpdateData): Promise<PaymentPeriodEntity | null> {
        try {
            const [updatedCount, [updatedPaymentPeriod]] = await SequelizePaymentPeriod.update(
                {
                    payp_paymentdate: paymentPeriod.payp_paymentdate,
                    payp_amountpaid: paymentPeriod.payp_amountpaid,
                    paym_uuid: paymentPeriod.paym_uuid,
                    payp_paymentreference: paymentPeriod.payp_paymentreference,
                    payps_uuid: paymentPeriod.payps_uuid
                },
                {
                    where: { usr_uuid, crd_uuid, per_uuid, payp_uuid },
                    returning: true,
                }
            );
            if (updatedCount === 0) {
                throw new Error(`No se ha actualizado el pago de período`);
            }
            return updatedPaymentPeriod.get({ plain: true }) as PaymentPeriodEntity;
        } catch (error: any) {
            console.error('Error en updatePaymentPeriod:', error.message);
            throw error;
        }
    }

    async deletePaymentPeriod(usr_uuid: string, crd_uuid: string, per_uuid: string, payp_uuid: string): Promise<PaymentPeriodEntity | null> {
        try {
            const paymentPeriod = await this.findPaymentPeriodById(usr_uuid, crd_uuid, per_uuid, payp_uuid);
            const result = await SequelizePaymentPeriod.destroy({ where: { usr_uuid, crd_uuid, per_uuid, payp_uuid } });
            if(!result) {
                throw new Error(`No se ha eliminado el pago de período`);
            };
            return paymentPeriod;
        } catch (error: any) {
            console.error('Error en deletePaymentPeriod:', error.message);
            throw error;
        }
    }

    async findPaymentsByMethod(usr_uuid: string, crd_uuid: string, per_uuid: string, paym_uuid: string): Promise<PaymentPeriodEntity[] | null> {
        try {
            const paymentsPeriod = await SequelizePaymentPeriod.findAll({
                where: {
                    usr_uuid: usr_uuid ?? null,
                    crd_uuid: crd_uuid ?? null,
                    per_uuid: per_uuid ?? null,
                    paym_uuid: paym_uuid ?? null
                }
            });
            return paymentsPeriod;
        } catch (error: any) {
            console.error('Error en findPaymentsByMethod:', error.message);
            throw error;
        }
    }

    async findPaymentsByStatus(usr_uuid: string, crd_uuid: string, per_uuid: string, payps_uuid: string): Promise<PaymentPeriodEntity[] | null> {
        try {
            const paymentsPeriod = await SequelizePaymentPeriod.findAll({
                where: {
                    usr_uuid: usr_uuid ?? null,
                    crd_uuid: crd_uuid ?? null,
                    per_uuid: per_uuid ?? null,
                    payps_uuid: payps_uuid ?? null
                }
            });
            return paymentsPeriod;
        } catch (error: any) {
            console.error('Error en findPaymentsByStatus:', error.message);
            throw error;
        }
    }

    async findPaymentsByDateRange(usr_uuid: string, crd_uuid: string, per_uuid: string, startDate: Date, endDate: Date): Promise<PaymentPeriodEntity[] | null> {
        try {
            const paymentsPeriod = await SequelizePaymentPeriod.findAll({
                where: {
                    usr_uuid: usr_uuid ?? null,
                    crd_uuid: crd_uuid ?? null,
                    per_uuid: per_uuid ?? null,
                    payp_paymentdate: {
                        [Op.between]: [startDate, endDate]
                    }
                }
            });
            return paymentsPeriod;
        } catch (error: any) {
            console.error('Error en findPaymentsByDateRange:', error.message);
            throw error;
        }
    }

    async findPaymentsByAmountRange(usr_uuid: string, crd_uuid: string, per_uuid: string, minAmount: number, maxAmount: number): Promise<PaymentPeriodEntity[] | null> {
        try {
            const paymentsPeriod = await SequelizePaymentPeriod.findAll({
                where: {
                    usr_uuid: usr_uuid ?? null,
                    crd_uuid: crd_uuid ?? null,
                    per_uuid: per_uuid ?? null,
                    payp_amountpaid: {
                        [Op.between]: [minAmount, maxAmount]
                    }
                }
            });
            return paymentsPeriod;
        } catch (error: any) {
            console.error('Error en findPaymentsByAmountRange:', error.message);
            throw error;
        }
    }
}