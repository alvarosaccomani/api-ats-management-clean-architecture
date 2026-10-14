import { TypeCardEntity } from '../type-card/type-card.entity';
import { BrandCardEntity } from '../brand-card/brand-card.entity';
import { BankEntity } from '../bank/bank.entity';
import { PeriodEntity } from '../period/period.entity';
import { CardGatewayEntity } from '../card-gateway/card-gateway.entity'; // Nueva entidad opcional para las pasarelas vinculadas
import { ScopeEntity } from '../scope/scope.entity';

export interface CardEntity {
    usr_uuid: string;
    crd_uuid: string;
    scp_uuid?: string | null;
    scp?: ScopeEntity;
    crd_alias?: string | null;
    crd_cardholdername?: string | null;
    crd_maskedcardnumber: string;
    crd_last4digits: string;
    tycrd_uuid: string;
    tycrd?: TypeCardEntity;
    brcrd_uuid: string;
    brcrd?: BrandCardEntity;
    ban_uuid: string;
    ban?: BankEntity;
    crd_expirationdate: Date;
    crd_creditlimit: number | null;
    crd_active: boolean;
    crd_allowdelegation?: boolean;
    crd_createdat: Date;
    crd_updatedat: Date;
    periods?: PeriodEntity[];
    gateways?: CardGatewayEntity[];
}

export type CardUpdateData = Pick<CardEntity, 
    'scp_uuid' |
    'crd_alias' | 
    'crd_cardholdername' | 
    'crd_maskedcardnumber' | 
    'crd_last4digits' | 
    'tycrd_uuid' | 
    'brcrd_uuid' | 
    'ban_uuid' | 
    'crd_expirationdate' | 
    'crd_creditlimit' | 
    'crd_active' | 
    'crd_allowdelegation'
>;