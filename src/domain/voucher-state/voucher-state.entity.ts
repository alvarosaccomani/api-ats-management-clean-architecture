export interface VoucherStateEntity {
    vous_uuid: string;
    vous_name: string;
    vous_description: string;
    vous_createdat: Date;
    vous_updatedat: Date;
}

export type VoucherStateUpdateData = Pick<VoucherStateEntity, 'vous_name' | 'vous_description'>;