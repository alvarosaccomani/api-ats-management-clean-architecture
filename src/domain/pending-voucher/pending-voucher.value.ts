import { v4 as uuid } from "uuid";
import moment from 'moment';
import { PendingVoucherEntity } from "./pending-voucher.entity";

export class PendingVoucherValue implements PendingVoucherEntity {
    usr_uuid: string;
    pevou_uuid: string;
    pevou_name: string;
    pevou_image: string;
    pevou_unreadcontent: string;
    pevou_unreadtext: string;
    pevou_createdat: Date;
    pevou_updatedat: Date;
    
    constructor({
            usr_uuid,
            pevou_uuid,
            pevou_name,
            pevou_image,
            pevou_unreadcontent,
            pevou_unreadtext,
            pevou_createdat,
            pevou_updatedat
        }:{ 
            usr_uuid: string,
            pevou_uuid?: string,
            pevou_name?: string,
            pevou_image?: string,
            pevou_unreadcontent?: string,
            pevou_unreadtext?: string,
            pevou_createdat?: Date,
            pevou_updatedat?: Date
        }) {
        this.usr_uuid = usr_uuid;
        this.pevou_uuid = uuid();
        this.pevou_name = pevou_name ?? '';
        this.pevou_image = pevou_image ?? '';
        this.pevou_unreadcontent = pevou_unreadcontent ?? '';
        this.pevou_unreadtext = pevou_unreadtext ?? '';
        this.pevou_createdat = pevou_createdat ?? moment().toDate();
        this.pevou_updatedat = pevou_updatedat ?? moment().toDate();
    }
}