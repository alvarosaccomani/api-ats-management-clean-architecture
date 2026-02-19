import { v4 as uuid } from "uuid";
import moment from 'moment';
import { VoucherFeeStatusEntity } from "./voucher-fee-status.entity";

export class VoucherFeeStatusValue implements VoucherFeeStatusEntity {
    voufs_uuid: string;
    voufs_name: string;
    voufs_description: string;
    voufs_createdat: Date;
    voufs_updatedat: Date;
    
    constructor({
            voufs_uuid,
            voufs_name,
            voufs_description,
            voufs_createdat,
            voufs_updatedat
        }:{ 
            voufs_uuid?: string,
            voufs_name: string,
            voufs_description?: string,
            voufs_createdat?: Date,
            voufs_updatedat?: Date
        }) {
        this.voufs_uuid = uuid();
        this.voufs_name = voufs_name;
        this.voufs_description = voufs_description ?? '';
        this.voufs_createdat = voufs_createdat ?? moment().toDate();
        this.voufs_updatedat = voufs_updatedat ?? moment().toDate();
    }
}