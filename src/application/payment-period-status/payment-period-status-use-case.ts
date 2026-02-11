import { PaymentPeriodStatusRepository } from "../../domain/payment-period-status/payment-period-status.repository";
import { PaymentPeriodStatusValue } from "../../domain/payment-period-status/payment-period-status.value";
import { TimezoneConverter } from "../../infrastructure/utils/TimezoneConverter";

export class PaymentPeriodStatusUseCase {
    constructor(
        private readonly paymentPeriodStatusRepository: PaymentPeriodStatusRepository
    ) {
        this.getPaymentPeriodStatuses = this.getPaymentPeriodStatuses.bind(this);
        this.getDetailPaymentPeriodStatus = this.getDetailPaymentPeriodStatus.bind(this);
        this.createPaymentPeriodStatus = this.createPaymentPeriodStatus.bind(this);
        this.updatePaymentPeriodStatus = this.updatePaymentPeriodStatus.bind(this);
        this.deletePaymentPeriodStatus = this.deletePaymentPeriodStatus.bind(this);
        this.findPaymentPeriodStatusByName = this.findPaymentPeriodStatusByName.bind(this);
    }

    public async getPaymentPeriodStatuses() {
        try {
            const paymentPeriodStatuses = await this.paymentPeriodStatusRepository.getPaymentPeriodStatuses();
            if(!paymentPeriodStatuses) {
                throw new Error('No hay estados de pago de período.');
            }
            return paymentPeriodStatuses.map(paymentPeriodStatus => ({
                payps_uuid: paymentPeriodStatus.payps_uuid,
                payps_name: paymentPeriodStatus.payps_name,
                payps_description: paymentPeriodStatus.payps_description,
                payps_createdat: TimezoneConverter.toIsoStringInTimezone(paymentPeriodStatus.payps_createdat, 'America/Buenos_Aires'),
                payps_updatedat: TimezoneConverter.toIsoStringInTimezone(paymentPeriodStatus.payps_updatedat, 'America/Buenos_Aires'),
            }));
        } catch (error: any) {
            console.error('Error en getPaymentPeriodStatuses (use case):', error.message);
            throw error;
        }
    }

    public async getDetailPaymentPeriodStatus(payps_uuid: string) {
        try {
            const paymentPeriodStatus = await this.paymentPeriodStatusRepository.findPaymentPeriodStatusById(payps_uuid);
            if(!paymentPeriodStatus) {
                throw new Error(`No hay estado de pago de período con el Id: ${payps_uuid}`);
            }
            return {
                payps_uuid: paymentPeriodStatus.payps_uuid,
                payps_name: paymentPeriodStatus.payps_name,
                payps_description: paymentPeriodStatus.payps_description,
                payps_createdat: TimezoneConverter.toIsoStringInTimezone(paymentPeriodStatus.payps_createdat, 'America/Buenos_Aires'),
                payps_updatedat: TimezoneConverter.toIsoStringInTimezone(paymentPeriodStatus.payps_updatedat, 'America/Buenos_Aires'),
            };
        } catch (error: any) {
            console.error('Error en getDetailPaymentPeriodStatus (use case):', error.message);
            throw error;
        }
    }
    
    public async createPaymentPeriodStatus({ payps_uuid, payps_name, payps_description } : { payps_uuid?: string, payps_name: string, payps_description?: string }) {
        try {
            const paymentPeriodStatusValue = new PaymentPeriodStatusValue({ payps_uuid, payps_name, payps_description });
            const paymentPeriodStatusCreated = await this.paymentPeriodStatusRepository.createPaymentPeriodStatus(paymentPeriodStatusValue);
            if(!paymentPeriodStatusCreated) {
                throw new Error(`No se pudo insertar el estado de pago de período.`);
            }
            return {
                payps_uuid: paymentPeriodStatusCreated.payps_uuid,
                payps_name: paymentPeriodStatusCreated.payps_name,
                payps_description: paymentPeriodStatusCreated.payps_description,
                payps_createdat: TimezoneConverter.toIsoStringInTimezone(paymentPeriodStatusCreated.payps_createdat, 'America/Buenos_Aires'),
                payps_updatedat: TimezoneConverter.toIsoStringInTimezone(paymentPeriodStatusCreated.payps_updatedat, 'America/Buenos_Aires'),
            };
        } catch (error: any) {
            console.error('Error en createPaymentPeriodStatus (use case):', error.message);
            throw error;
        }
    }

    public async updatePaymentPeriodStatus(payps_uuid: string, { payps_name, payps_description } : { payps_name: string, payps_description: string }) {
        try {
            const paymentPeriodStatusUpdated = await this.paymentPeriodStatusRepository.updatePaymentPeriodStatus(payps_uuid, { payps_name, payps_description });
            if(!paymentPeriodStatusUpdated) {
                throw new Error(`No se pudo actualizar el estado de pago de período.`);
            }
            return {
                payps_uuid: paymentPeriodStatusUpdated.payps_uuid,
                payps_name: paymentPeriodStatusUpdated.payps_name,
                payps_description: paymentPeriodStatusUpdated.payps_description,
                payps_createdat: TimezoneConverter.toIsoStringInTimezone(paymentPeriodStatusUpdated.payps_createdat, 'America/Buenos_Aires'),
                payps_updatedat: TimezoneConverter.toIsoStringInTimezone(paymentPeriodStatusUpdated.payps_updatedat, 'America/Buenos_Aires'),
            };
        } catch (error: any) {
            console.error('Error en updatePaymentPeriodStatus (use case):', error.message);
            throw error;
        }
    }

    public async deletePaymentPeriodStatus(payps_uuid: string) {
        try {
            const paymentPeriodStatusDeleted = await this.paymentPeriodStatusRepository.deletePaymentPeriodStatus(payps_uuid);
            if(!paymentPeriodStatusDeleted) {
                throw new Error(`No se pudo eliminar el estado de pago de período.`);
            }
            return {
                payps_uuid: paymentPeriodStatusDeleted.payps_uuid,
                payps_name: paymentPeriodStatusDeleted.payps_name,
                payps_description: paymentPeriodStatusDeleted.payps_description,
                payps_createdat: TimezoneConverter.toIsoStringInTimezone(paymentPeriodStatusDeleted.payps_createdat, 'America/Buenos_Aires'),
                payps_updatedat: TimezoneConverter.toIsoStringInTimezone(paymentPeriodStatusDeleted.payps_updatedat, 'America/Buenos_Aires'),
            };
        } catch (error: any) {
            console.error('Error en deletePaymentPeriodStatus (use case):', error.message);
            throw error;
        }
    }

    public async findPaymentPeriodStatusByName(payps_name: string, excludeUuid?: string) {
        try {
            const paymentPeriodStatus = await this.paymentPeriodStatusRepository.findPaymentPeriodStatusByName(payps_name, excludeUuid)
            if(paymentPeriodStatus) {
                throw new Error(`Ya existe un estado de pago de período con el nombre ${payps_name}.`);
            }
            return paymentPeriodStatus
        } catch (error: any) {
            console.error('Error en findPaymentPeriodStatusByName (use case):', error.message);
            throw error;
        }
    }
}