import { PaymentMethodRepository } from "../../domain/payment-method/payment-method.repository";
import { PaymentMethodValue } from "../../domain/payment-method/payment-method.value";
import { TimezoneConverter } from "../../infrastructure/utils/TimezoneConverter";

export class PaymentMethodUseCase {
    constructor(
        private readonly paymentMethodRepository: PaymentMethodRepository
    ) {
        this.getPaymentMethods = this.getPaymentMethods.bind(this);
        this.getDetailPaymentMethod = this.getDetailPaymentMethod.bind(this);
        this.createPaymentMethod = this.createPaymentMethod.bind(this);
        this.updatePaymentMethod = this.updatePaymentMethod.bind(this);
        this.deletePaymentMethod = this.deletePaymentMethod.bind(this);
        this.findPaymentMethodByName = this.findPaymentMethodByName.bind(this);
    }

    public async getPaymentMethods() {
        try {
            const paymentMethods = await this.paymentMethodRepository.getPaymentMethods();
            if(!paymentMethods) {
                throw new Error('No hay métodos de pago.');
            }
            return paymentMethods.map(paymentMethod => ({
                paym_uuid: paymentMethod.paym_uuid,
                paym_name: paymentMethod.paym_name,
                paym_description: paymentMethod.paym_description,
                paym_createdat: TimezoneConverter.toIsoStringInTimezone(paymentMethod.paym_createdat, 'America/Buenos_Aires'),
                paym_updatedat: TimezoneConverter.toIsoStringInTimezone(paymentMethod.paym_updatedat, 'America/Buenos_Aires'),
            }));
        } catch (error: any) {
            console.error('Error en getPaymentMethods (use case):', error.message);
            throw error;
        }
    }

    public async getDetailPaymentMethod(paym_uuid: string) {
        try {
            const paymentMethod = await this.paymentMethodRepository.findPaymentMethodById(paym_uuid);
            if(!paymentMethod) {
                throw new Error(`No hay método de pago con el Id: ${paym_uuid}`);
            }
            return {
                paym_uuid: paymentMethod.paym_uuid,
                paym_name: paymentMethod.paym_name,
                paym_description: paymentMethod.paym_description,
                paym_createdat: TimezoneConverter.toIsoStringInTimezone(paymentMethod.paym_createdat, 'America/Buenos_Aires'),
                paym_updatedat: TimezoneConverter.toIsoStringInTimezone(paymentMethod.paym_updatedat, 'America/Buenos_Aires'),
            };
        } catch (error: any) {
            console.error('Error en getDetailPaymentMethod (use case):', error.message);
            throw error;
        }
    }
    
    public async createPaymentMethod({ paym_uuid, paym_name, paym_description } : { paym_uuid?: string, paym_name: string, paym_description?: string }) {
        try {
            const paymentMethodValue = new PaymentMethodValue({ paym_uuid, paym_name, paym_description });
            const paymentMethodCreated = await this.paymentMethodRepository.createPaymentMethod(paymentMethodValue);
            if(!paymentMethodCreated) {
                throw new Error(`No se pudo insertar el método de pago.`);
            }
            return {
                paym_uuid: paymentMethodCreated.paym_uuid,
                paym_name: paymentMethodCreated.paym_name,
                paym_description: paymentMethodCreated.paym_description,
                paym_createdat: TimezoneConverter.toIsoStringInTimezone(paymentMethodCreated.paym_createdat, 'America/Buenos_Aires'),
                paym_updatedat: TimezoneConverter.toIsoStringInTimezone(paymentMethodCreated.paym_updatedat, 'America/Buenos_Aires'),
            };
        } catch (error: any) {
            console.error('Error en createPaymentMethod (use case):', error.message);
            throw error;
        }
    }

    public async updatePaymentMethod(paym_uuid: string, { paym_name, paym_description } : { paym_name: string, paym_description: string }) {
        try {
            const paymentMethodUpdated = await this.paymentMethodRepository.updatePaymentMethod(paym_uuid, { paym_name, paym_description });
            if(!paymentMethodUpdated) {
                throw new Error(`No se pudo actualizar el método de pago.`);
            }
            return {
                paym_uuid: paymentMethodUpdated.paym_uuid,
                paym_name: paymentMethodUpdated.paym_name,
                paym_description: paymentMethodUpdated.paym_description,
                paym_createdat: TimezoneConverter.toIsoStringInTimezone(paymentMethodUpdated.paym_createdat, 'America/Buenos_Aires'),
                paym_updatedat: TimezoneConverter.toIsoStringInTimezone(paymentMethodUpdated.paym_updatedat, 'America/Buenos_Aires'),
            };
        } catch (error: any) {
            console.error('Error en updatePaymentMethod (use case):', error.message);
            throw error;
        }
    }

    public async deletePaymentMethod(paym_uuid: string) {
        try {
            const paymentMethodDeleted = await this.paymentMethodRepository.deletePaymentMethod(paym_uuid);
            if(!paymentMethodDeleted) {
                throw new Error(`No se pudo eliminar el método de pago.`);
            }
            return {
                paym_uuid: paymentMethodDeleted.paym_uuid,
                paym_name: paymentMethodDeleted.paym_name,
                paym_description: paymentMethodDeleted.paym_description,
                paym_createdat: TimezoneConverter.toIsoStringInTimezone(paymentMethodDeleted.paym_createdat, 'America/Buenos_Aires'),
                paym_updatedat: TimezoneConverter.toIsoStringInTimezone(paymentMethodDeleted.paym_updatedat, 'America/Buenos_Aires'),
            };
        } catch (error: any) {
            console.error('Error en deletePaymentMethod (use case):', error.message);
            throw error;
        }
    }

    public async findPaymentMethodByName(paym_name: string, excludeUuid?: string) {
        try {
            const paymentMethod = await this.paymentMethodRepository.findPaymentMethodByName(paym_name, excludeUuid)
            if(paymentMethod) {
                throw new Error(`Ya existe un método de pago con el nombre ${paym_name}.`);
            }
            return paymentMethod
        } catch (error: any) {
            console.error('Error en findPaymentMethodByName (use case):', error.message);
            throw error;
        }
    }
}