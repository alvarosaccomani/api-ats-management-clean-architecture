import { ScopeEntity } from "../scope/scope.entity";
import { PersonEntity } from "../person/person.entity";
import { CardEntity } from "../card/card.entity";
import { TransactionEntity } from "../transaction/transaction.entity";

/**
 * Entidad de dominio que representa un Gasto Fijo o Servicio Recurrente.
 */
export interface FixedExpenseEntity {
    fex_uuid: string;
    scp_uuid: string;
    scp?: ScopeEntity;
    usr_uuid: string;
    fex_name: string;
    fex_category?: string | null;
    fex_dueday: number;
    fex_referenceamount?: number | null;
    fex_currency: string;
    crd_uuid?: string | null;
    crd?: CardEntity;
    prs_uuid?: string | null;
    prs?: PersonEntity;
    prs_uuidactor?: string | null;
    actor?: PersonEntity;
    fex_isautodebit: boolean;
    fex_autogenerate: boolean;
    fex_active: boolean;
    fex_notes?: string | null;
    fex_createdat?: Date;
    fex_updatedat?: Date;

    // Estado calculado para el período mensual consultado
    status?: 'PAID' | 'PENDING';
    paid_transaction?: TransactionEntity | null;
}

export type FixedExpenseUpdateData = Partial<Omit<FixedExpenseEntity, 'fex_uuid' | 'usr_uuid' | 'fex_createdat' | 'fex_updatedat'>>;
