import { v4 as uuid } from "uuid";
import moment from 'moment';
import { BankEntity } from "./bank.entity";

export class BankValue implements BankEntity {
    usr_uuid: string;
    ban_uuid: string;
    ban_name: string;
    ban_description: string;
    ban_createdat: Date;
    ban_updatedat: Date;
    
    constructor({
            usr_uuid,
            ban_uuid,
            ban_name,
            ban_description,
            ban_createdat,
            ban_updatedat
        }:{ 
            usr_uuid: string,
            ban_uuid?: string,
            ban_name: string,
            ban_description?: string,
            ban_createdat?: Date,
            ban_updatedat?: Date
        }) {
            this.usr_uuid = usr_uuid;
            this.ban_uuid = uuid();
            this.ban_name = ban_name;
            this.ban_description = ban_description ?? '';
            this.ban_createdat = ban_createdat ?? moment().toDate();
            this.ban_updatedat = ban_updatedat ?? moment().toDate();
    }
}