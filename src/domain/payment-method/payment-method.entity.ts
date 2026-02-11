export interface PaymentMethodEntity {
    paym_uuid: string;
    paym_name: string;
    paym_description: string;
    paym_createdat: Date;
    paym_updatedat: Date;
}

export type PaymentMethodUpdateData = Pick<PaymentMethodEntity, 'paym_name' | 'paym_description'>;