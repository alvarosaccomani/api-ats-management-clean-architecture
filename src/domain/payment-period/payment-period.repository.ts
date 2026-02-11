import { PaymentPeriodEntity, PaymentPeriodUpdateData } from "./payment-period.entity";

export interface PaymentPeriodRepository {
    getPaymentsPeriod(usr_uuid: string, crd_uuid: string, per_uuid: string): Promise<PaymentPeriodEntity[] | null>;
    findPaymentPeriodById(usr_uuid: string, crd_uuid: string, per_uuid: string, payp_uuid: string): Promise<PaymentPeriodEntity | null>;
    createPaymentPeriod(paymentPeriod: PaymentPeriodEntity): Promise<PaymentPeriodEntity | null>;
    updatePaymentPeriod(usr_uuid: string, crd_uuid: string, per_uuid: string, payp_uuid: string, paymentPeriod: PaymentPeriodUpdateData): Promise<PaymentPeriodEntity | null>;
    deletePaymentPeriod(usr_uuid: string, crd_uuid: string, per_uuid: string, payp_uuid: string): Promise<PaymentPeriodEntity | null>;
}