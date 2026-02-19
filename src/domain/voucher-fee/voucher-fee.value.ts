import { v4 as uuid } from "uuid";
import moment from 'moment';
import { VoucherFeeEntity } from "./voucher-fee.entity";

export class VoucherFeeValue implements VoucherFeeEntity {
    usr_uuid: string;
    crd_uuid: string;
    per_uuid: string;
    vou_uuid: string;
    vouf_uuid: string;
    vouf_quotanumber: number;
    vouf_quotaamount: number;
    vouf_quotaduedate: Date;
    voufs_uuid: string;
    vouf_createdat: Date;
    vouf_updatedat: Date;
    
    constructor({
            usr_uuid,
            crd_uuid,
            per_uuid,
            vou_uuid,
            vouf_uuid,
            vouf_quotanumber,
            vouf_quotaamount,
            vouf_quotaduedate,
            voufs_uuid,
            vouf_createdat,
            vouf_updatedat
        }:{ 
            usr_uuid: string,
            crd_uuid: string,
            per_uuid: string,
            vou_uuid: string,
            vouf_uuid?: string,
            vouf_quotanumber: number,
            vouf_quotaamount: number,
            vouf_quotaduedate: Date,
            voufs_uuid: string,
            vouf_createdat?: Date,
            vouf_updatedat?: Date
        }) {
        this.usr_uuid = usr_uuid;
        this.crd_uuid = crd_uuid;
        this.per_uuid = per_uuid;
        this.vou_uuid = vou_uuid;
        this.vouf_uuid = uuid();
        this.vouf_quotanumber = vouf_quotanumber;
        this.vouf_quotaamount = vouf_quotaamount;
        this.vouf_quotaduedate = vouf_quotaduedate;
        this.voufs_uuid = voufs_uuid;
        this.vouf_createdat = vouf_createdat ?? moment().toDate();
        this.vouf_updatedat = vouf_updatedat ?? moment().toDate();
    }
}