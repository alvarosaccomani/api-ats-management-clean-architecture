import { PaymentMethodEntity } from "../payment-method/payment-method.entity";
import { PaymentPeriodStatusEntity } from "../payment-period-status/payment-period-status.entity";

export interface PaymentPeriodEntity {
    usr_uuid: string;
    crd_uuid: string;
    per_uuid: string;
    payp_uuid: string;
    payp_paymentdate: Date;
    payp_amountpaid: number;
    paym_uuid: string;
    paym?: PaymentMethodEntity;
    payp_paymentreference: string;
    payps_uuid: string;
    payps?: PaymentPeriodStatusEntity;
    payp_createdat: Date;
    payp_updatedat: Date;
}

export type PaymentPeriodUpdateData = Pick<PaymentPeriodEntity, 
    'payp_paymentdate' | 
    'payp_amountpaid' | 
    'paym_uuid' | 
    'payp_paymentreference' | 
    'payps_uuid'
>;