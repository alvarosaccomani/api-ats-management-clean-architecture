import { v4 as uuid } from "uuid";
import moment from 'moment';
import { ScopeEntity } from "./scope.entity";

export class ScopeValue implements ScopeEntity {
    scp_uuid: string;
    scp_name: string;
    scp_description?: string | null;
    scp_isshared: boolean;
    scp_color?: string | null;
    scp_icon?: string | null;
    usr_uuidowner: string;
    scp_active: boolean;
    scp_createdat: Date;
    scp_updatedat: Date;

    constructor({
        scp_uuid,
        scp_name,
        scp_description,
        scp_isshared,
        scp_color,
        scp_icon,
        usr_uuidowner,
        scp_active,
        scp_createdat,
        scp_updatedat
    }: {
        scp_uuid?: string;
        scp_name: string;
        scp_description?: string | null;
        scp_isshared?: boolean;
        scp_color?: string | null;
        scp_icon?: string | null;
        usr_uuidowner: string;
        scp_active?: boolean;
        scp_createdat?: Date;
        scp_updatedat?: Date;
    }) {
        this.scp_uuid = (scp_uuid && String(scp_uuid).trim() !== '') ? scp_uuid : uuid();
        this.scp_name = scp_name;
        this.scp_description = scp_description ?? null;
        this.scp_isshared = scp_isshared ?? false;
        this.scp_color = scp_color ?? '#1890ff';
        this.scp_icon = scp_icon ?? 'wallet';
        this.usr_uuidowner = usr_uuidowner;
        this.scp_active = scp_active ?? true;
        this.scp_createdat = scp_createdat ?? moment().toDate();
        this.scp_updatedat = scp_updatedat ?? moment().toDate();
    }
}