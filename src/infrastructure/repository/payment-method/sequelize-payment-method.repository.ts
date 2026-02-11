import { Sequelize } from 'sequelize';
import { PaymentMethodEntity, PaymentMethodUpdateData } from "../../../domain/payment-method/payment-method.entity";
import { PaymentMethodRepository } from "../../../domain/payment-method/payment-method.repository";
import { SequelizePaymentMethod } from "../../model/payment-method/payment-method.model";
import { Op } from "sequelize";

export class SequelizePaymentMethodRepository implements PaymentMethodRepository {
    async getPaymentMethods(): Promise<PaymentMethodEntity[] | null> {
        try {
            const paymentMethods = await SequelizePaymentMethod.findAll({
                order: [
                    [Sequelize.col('paym_name'), 'ASC']
                ]
            });
            if(!paymentMethods) {
                throw new Error(`No hay métodos de pago`)
            };
            return paymentMethods;
        } catch (error: any) {
            console.error('Error en getPaymentMethods:', error.message);
            throw error;
        }
    }

    async findPaymentMethodById(paym_uuid: string): Promise<PaymentMethodEntity | null> {
        try {
            const paymentMethod = await SequelizePaymentMethod.findOne({ 
                where: { 
                    paym_uuid: paym_uuid ?? null
                } 
            });
            if(!paymentMethod) {
                throw new Error(`No hay método de pago con el Id: ${paym_uuid}`);
            };
            return paymentMethod.dataValues;
        } catch (error: any) {
            console.error('Error en findPaymentMethodById:', error.message);
            throw error;
        }
    }

    async createPaymentMethod(paymentMethod: PaymentMethodEntity): Promise<PaymentMethodEntity | null> {
        try {
            let { paym_uuid, paym_name, paym_description, paym_createdat, paym_updatedat } = paymentMethod
            const result = await SequelizePaymentMethod.create({ paym_uuid, paym_name, paym_description, paym_createdat, paym_updatedat });
            if(!result) {
                throw new Error(`No se ha agregado el método de pago`);
            }
            let newPaymentMethod = result.dataValues as SequelizePaymentMethod
            return newPaymentMethod;
        } catch (error: any) {
            console.error('Error en createPaymentMethod:', error.message);
            throw error;
        }
    }

    async updatePaymentMethod(paym_uuid: string, paymentMethod: PaymentMethodUpdateData): Promise<PaymentMethodEntity | null> {
        try {
            const [updatedCount, [updatedPaymentMethod]] = await SequelizePaymentMethod.update(
                {
                    paym_name: paymentMethod.paym_name,
                    paym_description: paymentMethod.paym_description
                },
                {
                    where: { paym_uuid },
                    returning: true,
                }
            );
            if (updatedCount === 0) {
                throw new Error(`No se ha actualizado el método de pago`);
            }
            return updatedPaymentMethod.get({ plain: true }) as PaymentMethodEntity;
        } catch (error: any) {
            console.error('Error en updatePaymentMethod:', error.message);
            throw error;
        }
    }

    async deletePaymentMethod(paym_uuid: string): Promise<PaymentMethodEntity | null> {
        try {
            const paymentMethod = await this.findPaymentMethodById(paym_uuid);
            const result = await SequelizePaymentMethod.destroy({ where: { paym_uuid } });
            if(!result) {
                throw new Error(`No se ha eliminado el método de pago`);
            };
            return paymentMethod;
        } catch (error: any) {
            console.error('Error en deletePaymentMethod:', error.message);
            throw error;
        }
    }

    async findPaymentMethodByName(paym_name: string, excludeUuid?: string | null): Promise<PaymentMethodEntity | null> {
        try {
            const whereCondition: any = { paym_name: paym_name ?? null };
            if (excludeUuid) {
                whereCondition.paym_uuid = { [Op.ne]: excludeUuid };
            }
            const paymentMethod = await SequelizePaymentMethod.findOne({ 
                where: whereCondition
            });
            return paymentMethod;
        } catch (error: any) {
            console.error('Error en findPaymentMethodByName:', error.message);
            throw error;
        }
    }
}