import { v4 as uuid } from "uuid";
import moment from 'moment';
import { PaymentPeriodEntity } from "./payment-period.entity";

export class PaymentPeriodValue implements PaymentPeriodEntity {
    usr_uuid: string;
    crd_uuid: string;
    per_uuid: string;
    payp_uuid: string;
    payp_paymentdate: Date;
    payp_amountpaid: number;
    paym_uuid: string;
    payp_paymentreference: string;
    payps_uuid: string;
    payp_createdat: Date;
    payp_updatedat: Date;
    
    constructor({
            usr_uuid,
            crd_uuid,
            per_uuid,
            payp_uuid,
            payp_paymentdate,
            payp_amountpaid,
            paym_uuid,
            payp_paymentreference,
            payps_uuid,
            payp_createdat,
            payp_updatedat
        }:{ 
            usr_uuid: string,
            crd_uuid: string,
            per_uuid: string,
            payp_uuid?: string,
            payp_paymentdate?: Date,
            payp_amountpaid: number,
            paym_uuid: string,
            payp_paymentreference?: string,
            payps_uuid: string,
            payp_createdat?: Date,
            payp_updatedat?: Date
        }) {
        this.usr_uuid = usr_uuid;
        this.crd_uuid = crd_uuid;
        this.per_uuid = per_uuid;
        this.payp_uuid = uuid();
        this.payp_paymentdate = payp_paymentdate ?? moment().toDate();
        this.payp_amountpaid = payp_amountpaid;
        this.paym_uuid = paym_uuid;
        this.payp_paymentreference = payp_paymentreference ?? '';
        this.payps_uuid = payps_uuid;
        this.payp_createdat = payp_createdat ?? moment().toDate();
        this.payp_updatedat = payp_updatedat ?? moment().toDate();
    }
}