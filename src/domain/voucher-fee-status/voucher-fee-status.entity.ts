export interface VoucherFeeStatusEntity {
    voufs_uuid: string;
    voufs_name: string;
    voufs_description: string;
    voufs_createdat: Date;
    voufs_updatedat: Date;
}

export type VoucherFeeStatusUpdateData = Pick<VoucherFeeStatusEntity, 'voufs_name' | 'voufs_description'>;