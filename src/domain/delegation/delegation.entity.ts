import { UserEntity } from '../user/user.entity';
import { CardGatewayEntity } from '../card-gateway/card-gateway.entity';

export type DelegationType = 'TIME_WINDOW_HOURS' | 'DATE_RANGE' | 'PERPETUAL';
export type DelegationStatus = 'ACTIVE' | 'EXPIRED' | 'EXHAUSTED' | 'REVOKED';

export interface DelegationEntity {
    usr_uuid: string;                        // Dueño de la tarjeta (Vos)
    dlg_uuid: string;                        // Identificador único de la delegación
    crdgtw_uuid: string;                     // FK hacia el token/pasarela específica
    usr_uuid_grantedto: string;              // Usuario autorizado (Hijo / Empleado)
    dlg_type: DelegationType;                // Tipo de restricción temporal
    dlg_hourswindow?: number | null;         // Horas de validez (ej: 24)
    dlg_validfrom?: Date | null;             // Inicio de vigencia
    dlg_validto?: Date | null;               // Fin de vigencia
    dlg_maxamount: number;                   // Límite asignado (ej: 150000.00)
    dlg_currentspent: number;                // Acumulado gastado
    dlg_allowextension: boolean;             // Si permite pedir ampliación en tiempo real
    dlg_status: DelegationStatus;            // Estado de la delegación
    dlg_createdat: Date;
    dlg_updatedat: Date;
    owner_user?: UserEntity;                 // Relación opcional con el titular
    granted_user?: UserEntity;               // Relación opcional con el usuario delegado
    card_gateway?: CardGatewayEntity;        // Relación opcional con el vínculo tarjeta-pasarela
}

export type DelegationCreateData = Omit<DelegationEntity, 
    'dlg_createdat' | 
    'dlg_updatedat' | 
    'dlg_currentspent' |
    'owner_user' | 
    'granted_user' | 
    'card_gateway'
> & {
    dlg_currentspent?: number;
};

export type DelegationUpdateData = Partial<Pick<DelegationEntity,
    'dlg_type' |
    'dlg_hourswindow' |
    'dlg_validfrom' |
    'dlg_validto' |
    'dlg_maxamount' |
    'dlg_currentspent' |
    'dlg_allowextension' |
    'dlg_status'
>>;