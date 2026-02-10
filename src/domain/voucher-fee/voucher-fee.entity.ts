import { VoucherFeeStatusEntity } from "../voucher-fee-status/voucher-fee-status.entity";

export interface VoucherFeeEntity {
    usr_uuid: string;
    crd_uuid: string;
    per_uuid: string;
    vou_uuid: string;
    vouf_uuid: string;
    vouf_quotanumber: number;
    vouf_quotaamount: number;
    vouf_quotaduedate: Date;
    voufs_uuid: string;
    voufs?: VoucherFeeStatusEntity;
    vouf_createdat: Date;
    vouf_updatedat: Date;
}

export type VoucherFeeUpdateData = Pick<VoucherFeeEntity, 
    'vouf_quotanumber' | 
    'vouf_quotaamount' | 
    'vouf_quotaduedate' | 
    'voufs_uuid'
>;