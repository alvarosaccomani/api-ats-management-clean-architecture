import { v4 as uuid } from "uuid";
import moment from 'moment';
import { PaymentMethodEntity } from "./payment-method.entity";

export class PaymentMethodValue implements PaymentMethodEntity {
    paym_uuid: string;
    paym_name: string;
    paym_description: string;
    paym_createdat: Date;
    paym_updatedat: Date;
    
    constructor({
            paym_uuid,
            paym_name,
            paym_description,
            paym_createdat,
            paym_updatedat
        }:{ 
            paym_uuid?: string,
            paym_name: string,
            paym_description?: string,
            paym_createdat?: Date,
            paym_updatedat?: Date
        }) {
        this.paym_uuid = uuid();
        this.paym_name = paym_name;
        this.paym_description = paym_description ?? '';
        this.paym_createdat = paym_createdat ?? moment().toDate();
        this.paym_updatedat = paym_updatedat ?? moment().toDate();
    }
}