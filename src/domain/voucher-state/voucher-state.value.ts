import { v4 as uuid } from "uuid";
import moment from 'moment';
import { VoucherStateEntity } from "./voucher-state.entity";

export class VoucherStateValue implements VoucherStateEntity {
    vous_uuid: string;
    vous_name: string;
    vous_description: string;
    vous_createdat: Date;
    vous_updatedat: Date;
    
    constructor({
            vous_uuid,
            vous_name,
            vous_description,
            vous_createdat,
            vous_updatedat
        }:{ 
            vous_uuid?: string,
            vous_name: string,
            vous_description?: string,
            vous_createdat?: Date,
            vous_updatedat?: Date
        }) {
        this.vous_uuid = uuid();
        this.vous_name = vous_name;
        this.vous_description = vous_description ?? '';
        this.vous_createdat = vous_createdat ?? moment().toDate();
        this.vous_updatedat = vous_updatedat ?? moment().toDate();
    }
}