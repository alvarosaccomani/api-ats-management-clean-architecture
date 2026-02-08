import { TypeOperationEntity } from "../type-operation/type-operation.entity";
import { VoucherStateEntity } from "../voucher-state/voucher-state.entity";

export interface VoucherEntity {
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
    tyop?: TypeOperationEntity;
    vou_installments: boolean;
    vou_installmentcount: number;
    vou_installmentinterest: number;
    vou_poscode: string;
    vou_reference: string;
    vous_uuid: string;
    vous?: VoucherStateEntity;
    vou_image: string;
    vou_notes: string;
    vou_createdat: Date;
    vou_updatedat: Date;
}

export type VoucherUpdateData = Pick<VoucherEntity, 
    'vou_authorizationnumber' | 
    'vou_transactionnumber' | 
    'vou_datetime' | 
    'vou_amount' | 
    'vou_currency' | 
    'vou_commercename' | 
    'vou_commercecuit' | 
    'vou_commercecategory' | 
    'tyop_uuid' | 
    'vou_installments' | 
    'vou_installmentcount' | 
    'vou_installmentinterest' | 
    'vou_poscode' | 
    'vou_reference' | 
    'vous_uuid' | 
    'vou_image' | 
    'vou_notes'
>;