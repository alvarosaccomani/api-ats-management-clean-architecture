import { v4 as uuid } from "uuid";
import moment from 'moment';
import { TransactionEntity } from "./transaction.entity";

export class TransactionValue implements TransactionEntity {
    trx_uuid: string;
    scp_uuid: string;
    usr_uuidcreator: string;
    trx_type: string;
    trx_datetime: Date;
    trx_amount: number;
    trx_currency: string;
    crd_uuid?: string | null;
    target_crduuid?: string | null;
    trx_concept: string;
    prs_uuid?: string | null;
    trx_commissionrate?: number | null;
    trx_commissionamount?: number | null;
    trx_notes?: string | null;
    trx_createdat: Date;
    trx_updatedat: Date;

    constructor({
        trx_uuid,
        scp_uuid,
        usr_uuidcreator,
        trx_type,
        trx_datetime,
        trx_amount,
        trx_currency,
        crd_uuid,
        target_crduuid,
        trx_concept,
        prs_uuid,
        trx_commissionrate,
        trx_commissionamount,
        trx_notes,
        trx_createdat,
        trx_updatedat
    }: {
        trx_uuid?: string;
        scp_uuid: string;
        usr_uuidcreator: string;
        trx_type: string;
        trx_datetime?: Date;
        trx_amount: number;
        trx_currency?: string;
        crd_uuid?: string | null;
        target_crduuid?: string | null;
        trx_concept: string;
        prs_uuid?: string | null;
        trx_commissionrate?: number | null;
        trx_commissionamount?: number | null;
        trx_notes?: string | null;
        trx_createdat?: Date;
        trx_updatedat?: Date;
    }) {
        this.trx_uuid = (trx_uuid && String(trx_uuid).trim() !== '') ? trx_uuid : uuid();
        this.scp_uuid = scp_uuid;
        this.usr_uuidcreator = usr_uuidcreator;
        this.trx_type = trx_type;
        this.trx_datetime = trx_datetime ?? moment().toDate();
        this.trx_amount = trx_amount;
        this.trx_currency = trx_currency ?? 'ARS';
        this.crd_uuid = crd_uuid && String(crd_uuid).trim() !== '' ? crd_uuid : null;
        this.target_crduuid = target_crduuid && String(target_crduuid).trim() !== '' ? target_crduuid : null;
        this.trx_concept = trx_concept;
        this.prs_uuid = prs_uuid && String(prs_uuid).trim() !== '' ? prs_uuid : null;
        this.trx_commissionrate = trx_commissionrate ?? null;
        this.trx_commissionamount = trx_commissionamount ?? null;
        this.trx_notes = trx_notes ?? null;
        this.trx_createdat = trx_createdat ?? moment().toDate();
        this.trx_updatedat = trx_updatedat ?? moment().toDate();
    }
}
