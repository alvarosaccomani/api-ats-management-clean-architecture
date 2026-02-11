import { v4 as uuid } from "uuid";
import moment from 'moment';
import { PaymentPeriodStatusEntity } from "./payment-period-status.entity";

export class PaymentPeriodStatusValue implements PaymentPeriodStatusEntity {
    payps_uuid: string;
    payps_name: string;
    payps_description: string;
    payps_createdat: Date;
    payps_updatedat: Date;
    
    constructor({
            payps_uuid,
            payps_name,
            payps_description,
            payps_createdat,
            payps_updatedat
        }:{ 
            payps_uuid?: string,
            payps_name: string,
            payps_description?: string,
            payps_createdat?: Date,
            payps_updatedat?: Date
        }) {
        this.payps_uuid = payps_uuid ?? uuid();
        this.payps_name = payps_name;
        this.payps_description = payps_description ?? '';
        this.payps_createdat = payps_createdat ?? moment().toDate();
        this.payps_updatedat = payps_updatedat ?? moment().toDate();
    }
}