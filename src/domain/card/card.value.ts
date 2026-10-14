import { v4 as uuid } from "uuid";
import moment from 'moment';
import { CardEntity } from "./card.entity";

export class CardValue implements CardEntity {
    usr_uuid: string;
    crd_uuid: string;
    scp_uuid?: string | null;
    crd_alias?: string | null;
    crd_cardholdername?: string | null;
    crd_maskedcardnumber: string;
    crd_last4digits: string;
    tycrd_uuid: string;
    brcrd_uuid: string;
    ban_uuid: string;
    crd_expirationdate: Date;
    crd_creditlimit: number | null;
    crd_active: boolean;
    crd_allowdelegation?: boolean;
    crd_createdat: Date;
    crd_updatedat: Date;
    
    constructor({
            usr_uuid,
            crd_uuid,
            scp_uuid,
            crd_alias,
            crd_cardholdername,
            crd_maskedcardnumber,
            crd_last4digits,
            tycrd_uuid,
            brcrd_uuid,
            ban_uuid,
            crd_expirationdate,
            crd_creditlimit,
            crd_active,
            crd_allowdelegation,
            crd_createdat,
            crd_updatedat
        }:{ 
            usr_uuid: string,
            crd_uuid?: string,
            scp_uuid?: string | null,
            crd_alias?: string | null,
            crd_cardholdername?: string | null,
            crd_maskedcardnumber: string,
            crd_last4digits: string,
            tycrd_uuid: string,
            brcrd_uuid: string,
            ban_uuid: string,
            crd_expirationdate: Date,
            crd_creditlimit?: number | null,
            crd_active?: boolean,
            crd_allowdelegation?: boolean,
            crd_createdat?: Date,
            crd_updatedat?: Date
        }) {
        this.usr_uuid = usr_uuid;
        this.crd_uuid = (crd_uuid && String(crd_uuid).trim() !== '') ? crd_uuid : uuid();
        this.scp_uuid = scp_uuid && String(scp_uuid).trim() !== '' ? scp_uuid : null;
        this.crd_alias = crd_alias ?? null;
        this.crd_cardholdername = crd_cardholdername ?? null;
        this.crd_maskedcardnumber = crd_maskedcardnumber;
        this.crd_last4digits = crd_last4digits;
        this.tycrd_uuid = tycrd_uuid;
        this.brcrd_uuid = brcrd_uuid;
        this.ban_uuid = ban_uuid;
        this.crd_expirationdate = crd_expirationdate;
        this.crd_creditlimit = crd_creditlimit ?? null;
        this.crd_active = crd_active ?? true;
        this.crd_allowdelegation = crd_allowdelegation ?? false;
        this.crd_createdat = crd_createdat ?? moment().toDate();
        this.crd_updatedat = crd_updatedat ?? moment().toDate();
    }
}