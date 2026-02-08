import { v4 as uuid } from "uuid";
import moment from 'moment';
import { BrandCardEntity } from "./brand-card.entity";

export class BrandCardValue implements BrandCardEntity {
    brcrd_uuid: string;
    brcrd_name: string;
    brcrd_description: string;
    brcrd_createdat: Date;
    brcrd_updatedat: Date;
    
    constructor({
            brcrd_uuid,
            brcrd_name,
            brcrd_description,
            brcrd_createdat,
            brcrd_updatedat
        }:{ 
            brcrd_uuid?: string,
            brcrd_name: string,
            brcrd_description?: string,
            brcrd_createdat?: Date,
            brcrd_updatedat?: Date
        }) {
        this.brcrd_uuid = brcrd_uuid ?? uuid();
        this.brcrd_name = brcrd_name;
        this.brcrd_description = brcrd_description ?? '';
        this.brcrd_createdat = brcrd_createdat ?? moment().toDate();
        this.brcrd_updatedat = brcrd_updatedat ?? moment().toDate();
    }
}