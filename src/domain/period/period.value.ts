import { v4 as uuid } from "uuid";
import moment from 'moment';
import { PeriodEntity } from "./period.entity";

export class PeriodValue implements PeriodEntity {
    usr_uuid: string;
    crd_uuid: string;
    per_uuid: string;
    per_periodnumber: number;
    per_startdate: Date;
    per_enddate: Date;
    per_duedate: Date;
    sper_uuid: string;
    per_previousbalance: number;
    per_interest: number;
    per_createdat: Date;
    per_updatedat: Date;
    
    constructor({
            usr_uuid,
            crd_uuid,
            per_uuid,
            per_periodnumber,
            per_startdate,
            per_enddate,
            per_duedate,
            sper_uuid,
            per_previousbalance,
            per_interest,
            per_createdat,
            per_updatedat
        }:{ 
            usr_uuid: string,
            crd_uuid: string,
            per_uuid?: string,
            per_periodnumber: number,
            per_startdate: Date,
            per_enddate: Date,
            per_duedate: Date,
            sper_uuid: string,
            per_previousbalance?: number,
            per_interest?: number,
            per_createdat?: Date,
            per_updatedat?: Date
        }) {
        this.usr_uuid = usr_uuid;
        this.crd_uuid = crd_uuid;
        this.per_uuid = uuid();
        this.per_periodnumber = per_periodnumber;
        this.per_startdate = per_startdate;
        this.per_enddate = per_enddate;
        this.per_duedate = per_duedate;
        this.sper_uuid = sper_uuid;
        this.per_previousbalance = per_previousbalance ?? 0;
        this.per_interest = per_interest ?? 0;
        this.per_createdat = per_createdat ?? moment().toDate();
        this.per_updatedat = per_updatedat ?? moment().toDate();
    }
}