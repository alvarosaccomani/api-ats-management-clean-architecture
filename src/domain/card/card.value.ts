import { v4 as uuid } from "uuid";
import moment from 'moment';
import { CardEntity } from "./card.entity";

export class CardValue implements CardEntity {
    usr_uuid: string;
    crd_uuid: string;
    scp_uuid?: string | null;
    crd_alias?: string | null;
    crd_cardholdername?: string | null;
    crd_maskedcardnumber?: string | null;
    crd_last4digits?: string | null;
    tycrd_uuid: string;
    brcrd_uuid?: string | null;
    ban_uuid?: string | null;
    crd_expirationdate?: Date | null;
    crd_creditlimit: number | null;
    crd_cbucvu?: string | null;
    crd_cbualias?: string | null;
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
            crd_cbucvu,
            crd_cbualias,
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
            crd_maskedcardnumber?: string | null,
            crd_last4digits?: string | null,
            tycrd_uuid: string,
            brcrd_uuid?: string | null,
            ban_uuid?: string | null,
            crd_expirationdate?: Date | null,
            crd_creditlimit?: number | null,
            crd_cbucvu?: string | null,
            crd_cbualias?: string | null,
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
        this.crd_maskedcardnumber = crd_maskedcardnumber ?? null;
        this.crd_last4digits = crd_last4digits ?? null;
        this.tycrd_uuid = tycrd_uuid;
        this.brcrd_uuid = brcrd_uuid && String(brcrd_uuid).trim() !== '' ? brcrd_uuid : null;
        this.ban_uuid = ban_uuid && String(ban_uuid).trim() !== '' ? ban_uuid : null;
        this.crd_expirationdate = crd_expirationdate ?? null;
        this.crd_creditlimit = crd_creditlimit ?? null;
        this.crd_cbucvu = crd_cbucvu ?? null;
        this.crd_cbualias = crd_cbualias ?? null;
        this.crd_active = crd_active ?? true;
        this.crd_allowdelegation = crd_allowdelegation ?? false;
        this.crd_createdat = crd_createdat ?? moment().toDate();
        this.crd_updatedat = crd_updatedat ?? moment().toDate();
    }
}