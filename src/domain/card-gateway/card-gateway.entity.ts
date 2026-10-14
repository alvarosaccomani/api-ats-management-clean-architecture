import { CardEntity } from '../card/card.entity';
import { UserEntity } from '../user/user.entity';

export interface CardGatewayEntity {
    usr_uuid: string;
    crd_uuid: string;
    crdgtw_uuid: string;
    crdgtw_gateway: string;                  // 'MERCADOPAGO', 'STRIPE', 'DECIDIR', 'MODO', etc.
    crdgtw_apptarget: string;                // 'ALL', 'ATSMARKET', 'ATSCOMMUNITY', 'GUVA', etc.
    crdgtw_customerid?: string | null;       // ID de cliente en la pasarela (ej: cus_12345)
    crdgtw_paymenttoken: string;             // Token o Card Token devuelto por la pasarela
    crdgtw_isdefault: boolean;               // Si es la pasarela preferida por defecto
    crdgtw_active: boolean;                  // Si el token/vinculación está activo
    crdgtw_createdat: Date;
    crdgtw_updatedat: Date;
    card?: CardEntity;                       // Relación opcional con la tarjeta base
    user?: UserEntity;                       // Relación opcional con el usuario titular
}

export type CardGatewayCreateData = Omit<CardGatewayEntity, 
    'crdgtw_createdat' | 
    'crdgtw_updatedat' | 
    'card' | 
    'user'
>;

export type CardGatewayUpdateData = Partial<Pick<CardGatewayEntity,
    'crdgtw_gateway' |
    'crdgtw_apptarget' |
    'crdgtw_customerid' |
    'crdgtw_paymenttoken' |
    'crdgtw_isdefault' |
    'crdgtw_active'
>>;