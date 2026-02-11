import { PaymentMethodEntity, PaymentMethodUpdateData } from "./payment-method.entity";

export interface PaymentMethodRepository {
    getPaymentMethods(): Promise<PaymentMethodEntity[] | null>;
    findPaymentMethodById(paym_uuid: string): Promise<PaymentMethodEntity | null>;
    createPaymentMethod(paymentMethod: PaymentMethodEntity): Promise<PaymentMethodEntity | null>;
    updatePaymentMethod(paym_uuid: string, paymentMethod: PaymentMethodUpdateData): Promise<PaymentMethodEntity | null>;
    deletePaymentMethod(paym_uuid: string): Promise<PaymentMethodEntity | null>;
    findPaymentMethodByName(paym_name: string, excludeUuid?: string | null): Promise<PaymentMethodEntity | null>;
}