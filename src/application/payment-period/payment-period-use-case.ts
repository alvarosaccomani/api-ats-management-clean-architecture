import { PaymentPeriodRepository } from "../../domain/payment-period/payment-period.repository";
import { PaymentPeriodValue } from "../../domain/payment-period/payment-period.value";
import { TimezoneConverter } from "../../infrastructure/utils/TimezoneConverter";

export class PaymentPeriodUseCase {
    constructor(
        private readonly paymentPeriodRepository: PaymentPeriodRepository
    ) {
        this.getPaymentsPeriod = this.getPaymentsPeriod.bind(this);
        this.getDetailPaymentPeriod = this.getDetailPaymentPeriod.bind(this);
        this.createPaymentPeriod = this.createPaymentPeriod.bind(this);
        this.updatePaymentPeriod = this.updatePaymentPeriod.bind(this);
        this.deletePaymentPeriod = this.deletePaymentPeriod.bind(this);
    }

    public async getPaymentsPeriod(usr_uuid: string, crd_uuid: string, per_uuid: string) {
        try {
            const paymentsPeriod = await this.paymentPeriodRepository.getPaymentsPeriod(usr_uuid, crd_uuid, per_uuid);
            if(!paymentsPeriod) {
                throw new Error('No hay pagos de período.');
            }
            return paymentsPeriod.map(paymentPeriod => ({
                usr_uuid: paymentPeriod.usr_uuid,
                crd_uuid: paymentPeriod.crd_uuid,
                per_uuid: paymentPeriod.per_uuid,
                payp_uuid: paymentPeriod.payp_uuid,
                payp_paymentdate: TimezoneConverter.toIsoStringInTimezone(paymentPeriod.payp_paymentdate, 'America/Buenos_Aires'),
                payp_amountpaid: paymentPeriod.payp_amountpaid,
                paym_uuid: paymentPeriod.paym_uuid,
                paym: paymentPeriod.paym,
                payp_paymentreference: paymentPeriod.payp_paymentreference,
                payps_uuid: paymentPeriod.payps_uuid,
                payps: paymentPeriod.payps,
                payp_createdat: TimezoneConverter.toIsoStringInTimezone(paymentPeriod.payp_createdat, 'America/Buenos_Aires'),
                payp_updatedat: TimezoneConverter.toIsoStringInTimezone(paymentPeriod.payp_updatedat, 'America/Buenos_Aires'),
            }));
        } catch (error: any) {
            console.error('Error en getPaymentsPeriod (use case):', error.message);
            throw error;
        }
    }

    public async getDetailPaymentPeriod(usr_uuid: string, crd_uuid: string, per_uuid: string, payp_uuid: string) {
        try {
            const paymentPeriod = await this.paymentPeriodRepository.findPaymentPeriodById(usr_uuid, crd_uuid, per_uuid, payp_uuid);
            if(!paymentPeriod) {
                throw new Error(`No hay pago de período con el Id: ${payp_uuid}`);
            }
            return {
                usr_uuid: paymentPeriod.usr_uuid,
                crd_uuid: paymentPeriod.crd_uuid,
                per_uuid: paymentPeriod.per_uuid,
                payp_uuid: paymentPeriod.payp_uuid,
                payp_paymentdate: TimezoneConverter.toIsoStringInTimezone(paymentPeriod.payp_paymentdate, 'America/Buenos_Aires'),
                payp_amountpaid: paymentPeriod.payp_amountpaid,
                paym_uuid: paymentPeriod.paym_uuid,
                payp_paymentreference: paymentPeriod.payp_paymentreference,
                payps_uuid: paymentPeriod.payps_uuid,
                payp_createdat: TimezoneConverter.toIsoStringInTimezone(paymentPeriod.payp_createdat, 'America/Buenos_Aires'),
                payp_updatedat: TimezoneConverter.toIsoStringInTimezone(paymentPeriod.payp_updatedat, 'America/Buenos_Aires'),
            };
        } catch (error: any) {
            console.error('Error en getDetailPaymentPeriod (use case):', error.message);
            throw error;
        }
    }
    
    public async createPaymentPeriod({ 
        usr_uuid, 
        crd_uuid, 
        per_uuid, 
        payp_uuid, 
        payp_paymentdate, 
        payp_amountpaid, 
        paym_uuid, 
        payp_paymentreference, 
        payps_uuid 
    } : { 
        usr_uuid: string,
        crd_uuid: string,
        per_uuid: string,
        payp_uuid?: string,
        payp_paymentdate?: Date,
        payp_amountpaid: number,
        paym_uuid: string,
        payp_paymentreference?: string,
        payps_uuid: string
    }) {
        try {
            const paymentPeriodValue = new PaymentPeriodValue({ 
                usr_uuid, 
                crd_uuid, 
                per_uuid, 
                payp_uuid, 
                payp_paymentdate, 
                payp_amountpaid, 
                paym_uuid, 
                payp_paymentreference, 
                payps_uuid 
            });
            const paymentPeriodCreated = await this.paymentPeriodRepository.createPaymentPeriod(paymentPeriodValue);
            if(!paymentPeriodCreated) {
                throw new Error(`No se pudo insertar el pago de período.`);
            }
            return {
                usr_uuid: paymentPeriodCreated.usr_uuid,
                crd_uuid: paymentPeriodCreated.crd_uuid,
                per_uuid: paymentPeriodCreated.per_uuid,
                payp_uuid: paymentPeriodCreated.payp_uuid,
                payp_paymentdate: TimezoneConverter.toIsoStringInTimezone(paymentPeriodCreated.payp_paymentdate, 'America/Buenos_Aires'),
                payp_amountpaid: paymentPeriodCreated.payp_amountpaid,
                paym_uuid: paymentPeriodCreated.paym_uuid,
                payp_paymentreference: paymentPeriodCreated.payp_paymentreference,
                payps_uuid: paymentPeriodCreated.payps_uuid,
                payp_createdat: TimezoneConverter.toIsoStringInTimezone(paymentPeriodCreated.payp_createdat, 'America/Buenos_Aires'),
                payp_updatedat: TimezoneConverter.toIsoStringInTimezone(paymentPeriodCreated.payp_updatedat, 'America/Buenos_Aires'),
            };
        } catch (error: any) {
            console.error('Error en createPaymentPeriod (use case):', error.message);
            throw error;
        }
    }

    public async updatePaymentPeriod(usr_uuid: string, crd_uuid: string, per_uuid: string, payp_uuid: string, { 
        payp_paymentdate, 
        payp_amountpaid, 
        paym_uuid, 
        payp_paymentreference, 
        payps_uuid 
    } : { 
        payp_paymentdate: Date,
        payp_amountpaid: number,
        paym_uuid: string,
        payp_paymentreference: string,
        payps_uuid: string
    }) {
        try {
            const paymentPeriodUpdated = await this.paymentPeriodRepository.updatePaymentPeriod(usr_uuid, crd_uuid, per_uuid, payp_uuid, { 
                payp_paymentdate, 
                payp_amountpaid, 
                paym_uuid, 
                payp_paymentreference, 
                payps_uuid 
            });
            if(!paymentPeriodUpdated) {
                throw new Error(`No se pudo actualizar el pago de período.`);
            }
            return {
                usr_uuid: paymentPeriodUpdated.usr_uuid,
                crd_uuid: paymentPeriodUpdated.crd_uuid,
                per_uuid: paymentPeriodUpdated.per_uuid,
                payp_uuid: paymentPeriodUpdated.payp_uuid,
                payp_paymentdate: TimezoneConverter.toIsoStringInTimezone(paymentPeriodUpdated.payp_paymentdate, 'America/Buenos_Aires'),
                payp_amountpaid: paymentPeriodUpdated.payp_amountpaid,
                paym_uuid: paymentPeriodUpdated.paym_uuid,
                payp_paymentreference: paymentPeriodUpdated.payp_paymentreference,
                payps_uuid: paymentPeriodUpdated.payps_uuid,
                payp_createdat: TimezoneConverter.toIsoStringInTimezone(paymentPeriodUpdated.payp_createdat, 'America/Buenos_Aires'),
                payp_updatedat: TimezoneConverter.toIsoStringInTimezone(paymentPeriodUpdated.payp_updatedat, 'America/Buenos_Aires'),
            };
        } catch (error: any) {
            console.error('Error en updatePaymentPeriod (use case):', error.message);
            throw error;
        }
    }

    public async deletePaymentPeriod(usr_uuid: string, crd_uuid: string, per_uuid: string, payp_uuid: string) {
        try {
            const paymentPeriodDeleted = await this.paymentPeriodRepository.deletePaymentPeriod(usr_uuid, crd_uuid, per_uuid, payp_uuid);
            if(!paymentPeriodDeleted) {
                throw new Error(`No se pudo eliminar el pago de período.`);
            }
            return {
                usr_uuid: paymentPeriodDeleted.usr_uuid,
                crd_uuid: paymentPeriodDeleted.crd_uuid,
                per_uuid: paymentPeriodDeleted.per_uuid,
                payp_uuid: paymentPeriodDeleted.payp_uuid,
                payp_paymentdate: TimezoneConverter.toIsoStringInTimezone(paymentPeriodDeleted.payp_paymentdate, 'America/Buenos_Aires'),
                payp_amountpaid: paymentPeriodDeleted.payp_amountpaid,
                paym_uuid: paymentPeriodDeleted.paym_uuid,
                payp_paymentreference: paymentPeriodDeleted.payp_paymentreference,
                payps_uuid: paymentPeriodDeleted.payps_uuid,
                payp_createdat: TimezoneConverter.toIsoStringInTimezone(paymentPeriodDeleted.payp_createdat, 'America/Buenos_Aires'),
                payp_updatedat: TimezoneConverter.toIsoStringInTimezone(paymentPeriodDeleted.payp_updatedat, 'America/Buenos_Aires'),
            };
        } catch (error: any) {
            console.error('Error en deletePaymentPeriod (use case):', error.message);
            throw error;
        }
    }
}