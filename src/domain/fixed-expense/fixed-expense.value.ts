import { v4 as uuid } from 'uuid';
import { FixedExpenseEntity } from './fixed-expense.entity';

/**
 * Value Object para la creación y validación de una nueva plantilla de Gasto Fijo.
 */
export class FixedExpenseValue implements FixedExpenseEntity {
    fex_uuid: string;
    scp_uuid: string;
    usr_uuid: string;
    fex_name: string;
    fex_category?: string | null;
    fex_dueday: number;
    fex_referenceamount?: number | null;
    fex_currency: string;
    crd_uuid?: string | null;
    prs_uuid?: string | null;
    prs_uuidactor?: string | null;
    fex_isautodebit: boolean;
    fex_autogenerate: boolean;
    fex_active: boolean;
    fex_notes?: string | null;
    fex_createdat: Date;
    fex_updatedat: Date;

    constructor({
        fex_uuid,
        scp_uuid,
        usr_uuid,
        fex_name,
        fex_category,
        fex_dueday,
        fex_referenceamount,
        fex_currency,
        crd_uuid,
        prs_uuid,
        prs_uuidactor,
        fex_isautodebit,
        fex_autogenerate,
        fex_active,
        fex_notes
    }: {
        fex_uuid?: string;
        scp_uuid: string;
        usr_uuid: string;
        fex_name: string;
        fex_category?: string | null;
        fex_dueday?: number;
        fex_referenceamount?: number | null;
        fex_currency?: string;
        crd_uuid?: string | null;
        prs_uuid?: string | null;
        prs_uuidactor?: string | null;
        fex_isautodebit?: boolean;
        fex_autogenerate?: boolean;
        fex_active?: boolean;
        fex_notes?: string | null;
    }) {
        this.fex_uuid = fex_uuid || uuid();
        this.scp_uuid = scp_uuid;
        this.usr_uuid = usr_uuid;
        this.fex_name = fex_name;
        this.fex_category = fex_category || 'SERVICIOS';
        const day = Number(fex_dueday);
        this.fex_dueday = (!isNaN(day) && day >= 1 && day <= 31) ? day : 10;
        this.fex_referenceamount = fex_referenceamount != null ? Number(fex_referenceamount) : 0;
        this.fex_currency = fex_currency || 'ARS';
        this.crd_uuid = crd_uuid || null;
        this.prs_uuid = prs_uuid || null;
        this.prs_uuidactor = prs_uuidactor || null;
        this.fex_isautodebit = !!fex_isautodebit;
        this.fex_autogenerate = !!fex_autogenerate;
        this.fex_active = fex_active !== false;
        this.fex_notes = fex_notes || null;
        this.fex_createdat = new Date();
        this.fex_updatedat = new Date();
    }
}
