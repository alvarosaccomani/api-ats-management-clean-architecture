import { PaymentPeriodStatusEntity, PaymentPeriodStatusUpdateData } from "./payment-period-status.entity";

export interface PaymentPeriodStatusRepository {
    getPaymentPeriodStatuses(): Promise<PaymentPeriodStatusEntity[] | null>;
    findPaymentPeriodStatusById(payps_uuid: string): Promise<PaymentPeriodStatusEntity | null>;
    createPaymentPeriodStatus(paymentPeriodStatus: PaymentPeriodStatusEntity): Promise<PaymentPeriodStatusEntity | null>;
    updatePaymentPeriodStatus(payps_uuid: string, paymentPeriodStatus: PaymentPeriodStatusUpdateData): Promise<PaymentPeriodStatusEntity | null>;
    deletePaymentPeriodStatus(payps_uuid: string): Promise<PaymentPeriodStatusEntity | null>;
    findPaymentPeriodStatusByName(payps_name: string, excludeUuid?: string | null): Promise<PaymentPeriodStatusEntity | null>;
}