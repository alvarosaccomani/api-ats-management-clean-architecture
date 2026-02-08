import { v4 as uuid } from "uuid";
import moment from 'moment';
import { StatusPeriodEntity } from "./status-period.entity";

export class StatusPeriodValue implements StatusPeriodEntity {
    sper_uuid: string;
    sper_name: string;
    sper_description: string;
    sper_createdat: Date;
    sper_updatedat: Date;
    
    constructor({
            sper_uuid,
            sper_name,
            sper_description,
            sper_createdat,
            sper_updatedat
        }:{ 
            sper_uuid?: string,
            sper_name: string,
            sper_description?: string,
            sper_createdat?: Date,
            sper_updatedat?: Date
        }) {
        this.sper_uuid = sper_uuid ?? uuid();
        this.sper_name = sper_name;
        this.sper_description = sper_description ?? '';
        this.sper_createdat = sper_createdat ?? moment().toDate();
        this.sper_updatedat = sper_updatedat ?? moment().toDate();
    }
}