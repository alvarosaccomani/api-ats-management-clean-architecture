import { PersonEntity } from "../person/person.entity";
import { ScopeEntity } from "../scope/scope.entity";

export interface TransactionEntity {
    trx_uuid: string;
    scp_uuid: string;
    scp?: ScopeEntity;
    usr_uuidcreator: string;
    trx_type: string;
    trx_datetime: Date;
    trx_amount: number;
    trx_currency: string;
    crd_uuid?: string | null;
    target_crduuid?: string | null;
    trx_concept: string;
    prs_uuid?: string | null;
    prs?: PersonEntity;
    trx_notes?: string | null;
    trx_createdat: Date;
    trx_updatedat: Date;
}

export type TransactionUpdateData = Pick<TransactionEntity,
    'scp_uuid' |
    'trx_type' |
    'trx_datetime' |
    'trx_amount' |
    'trx_currency' |
    'crd_uuid' |
    'target_crduuid' |
    'trx_concept' |
    'prs_uuid' |
    'trx_notes'
>;
