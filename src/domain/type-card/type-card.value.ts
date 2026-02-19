import { v4 as uuid } from "uuid";
import moment from 'moment';
import { TypeCardEntity } from "./type-card.entity";

export class TypeCardValue implements TypeCardEntity {
    tycrd_uuid: string;
    tycrd_name: string;
    tycrd_description: string;
    tycrd_createdat: Date;
    tycrd_updatedat: Date;
    
    constructor({
            tycrd_uuid,
            tycrd_name,
            tycrd_description,
            tycrd_createdat,
            tycrd_updatedat
        }:{ 
            tycrd_uuid?: string,
            tycrd_name: string,
            tycrd_description?: string,
            tycrd_createdat?: Date,
            tycrd_updatedat?: Date
        }) {
        this.tycrd_uuid = uuid();
        this.tycrd_name = tycrd_name;
        this.tycrd_description = tycrd_description ?? '';
        this.tycrd_createdat = tycrd_createdat ?? moment().toDate();
        this.tycrd_updatedat = tycrd_updatedat ?? moment().toDate();
    }
}