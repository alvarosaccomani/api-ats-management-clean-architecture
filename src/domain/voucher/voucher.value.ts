import { v4 as uuid } from "uuid";
import moment from 'moment';
import { VoucherEntity } from "./voucher.entity";

export class VoucherValue implements VoucherEntity {
    usr_uuid: string;
    crd_uuid: string;
    per_uuid: string;
    vou_uuid: string;
    vou_authorizationnumber: string;
    vou_transactionnumber: string;
    vou_datetime: Date;
    vou_amount: number;
    vou_currency: string;
    vou_commercename: string;
    vou_commercecuit: string;
    vou_commercecategory: string;
    tyop_uuid: string;
    vou_installments: boolean;
    vou_installmentcount: number;
    vou_installmentinterest: number;
    vou_poscode: string;
    vou_reference: string;
    vous_uuid: string;
    vou_image: string;
    vou_notes: string;
    vou_createdat: Date;
    vou_updatedat: Date;
    
    constructor({
            usr_uuid,
            crd_uuid,
            per_uuid,
            vou_uuid,
            vou_authorizationnumber,
            vou_transactionnumber,
            vou_datetime,
            vou_amount,
            vou_currency,
            vou_commercename,
            vou_commercecuit,
            vou_commercecategory,
            tyop_uuid,
            vou_installments,
            vou_installmentcount,
            vou_installmentinterest,
            vou_poscode,
            vou_reference,
            vous_uuid,
            vou_image,
            vou_notes,
            vou_createdat,
            vou_updatedat
        }:{ 
            usr_uuid: string,
            crd_uuid: string,
            per_uuid: string,
            vou_uuid?: string,
            vou_authorizationnumber: string,
            vou_transactionnumber: string,
            vou_datetime?: Date,
            vou_amount: number,
            vou_currency?: string,
            vou_commercename: string,
            vou_commercecuit?: string,
            vou_commercecategory?: string,
            tyop_uuid: string,
            vou_installments?: boolean,
            vou_installmentcount?: number,
            vou_installmentinterest?: number,
            vou_poscode?: string,
            vou_reference?: string,
            vous_uuid: string,
            vou_image?: string,
            vou_notes?: string,
            vou_createdat?: Date,
            vou_updatedat?: Date
        }) {
        this.usr_uuid = usr_uuid;
        this.crd_uuid = crd_uuid;
        this.per_uuid = per_uuid;
        this.vou_uuid = vou_uuid ?? uuid();
        this.vou_authorizationnumber = vou_authorizationnumber;
        this.vou_transactionnumber = vou_transactionnumber;
        this.vou_datetime = vou_datetime ?? moment().toDate();
        this.vou_amount = vou_amount;
        this.vou_currency = vou_currency ?? 'ARS';
        this.vou_commercename = vou_commercename;
        this.vou_commercecuit = vou_commercecuit ?? '';
        this.vou_commercecategory = vou_commercecategory ?? '';
        this.tyop_uuid = tyop_uuid;
        this.vou_installments = vou_installments ?? false;
        this.vou_installmentcount = vou_installmentcount ?? 1;
        this.vou_installmentinterest = vou_installmentinterest ?? 0;
        this.vou_poscode = vou_poscode ?? '';
        this.vou_reference = vou_reference ?? '';
        this.vous_uuid = vous_uuid;
        this.vou_image = vou_image ?? '';
        this.vou_notes = vou_notes ?? '';
        this.vou_createdat = vou_createdat ?? moment().toDate();
        this.vou_updatedat = vou_updatedat ?? moment().toDate();
    }
}