import { UserEntity } from '../user/user.entity';
import { DelegationEntity } from '../delegation/delegation.entity';

export type ExtensionRequestStatus = 'PENDING' | 'APPROVED' | 'REJECTED' | 'EXPIRED';

export interface ExtensionRequestEntity {
    usr_uuid: string;                          // Titular de la tarjeta / Dueño (Vos)
    extreq_uuid: string;                      // Identificador único de la solicitud
    dlg_uuid: string;                         // Delegación asociada
    extreq_requestedamount: number;           // Monto total que intentó pagar (ej: 151000.00)
    extreq_shortfallamount: number;            // Monto faltante que excede el cupo (ej: 101000.00)
    extreq_merchant?: string | null;          // Nombre del comercio / pasarela (ej: 'Mercado Pago', 'ATS Market')
    extreq_status: ExtensionRequestStatus;    // 'PENDING' | 'APPROVED' | 'REJECTED' | 'EXPIRED'
    extreq_createdat: Date;
    extreq_updatedat: Date;
    owner_user?: UserEntity;                  // Relación opcional con el titular
    delegation?: DelegationEntity;            // Relación opcional con la regla de delegación
}

export type ExtensionRequestCreateData = Omit<ExtensionRequestEntity, 
    'extreq_createdat' | 
    'extreq_updatedat' | 
    'extreq_status' |
    'owner_user' | 
    'delegation'
> & {
    extreq_status?: ExtensionRequestStatus;
};

export type ExtensionRequestUpdateData = Partial<Pick<ExtensionRequestEntity,
    'extreq_status' |
    'extreq_shortfallamount' |
    'extreq_requestedamount' |
    'extreq_merchant'
>>;