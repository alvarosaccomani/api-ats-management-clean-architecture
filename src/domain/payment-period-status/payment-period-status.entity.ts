export interface PaymentPeriodStatusEntity {
    payps_uuid: string;
    payps_name: string;
    payps_description: string;
    payps_createdat: Date;
    payps_updatedat: Date;
}

export type PaymentPeriodStatusUpdateData = Pick<PaymentPeriodStatusEntity, 'payps_name' | 'payps_description'>;