import { v4 as uuid } from "uuid";
import moment from 'moment';
import { PersonEntity } from "./person.entity";

export class PersonValue implements PersonEntity {
    prs_uuid: string;
    scp_uuid: string;
    usr_uuidlinked?: string | null;
    prs_name: string;
    prs_type: string;
    prs_phone?: string | null;
    prs_email?: string | null;
    prs_taxid?: string | null;
    prs_active: boolean;
    prs_createdat: Date;
    prs_updatedat: Date;

    constructor({
        prs_uuid,
        scp_uuid,
        usr_uuidlinked,
        prs_name,
        prs_type,
        prs_phone,
        prs_email,
        prs_taxid,
        prs_active,
        prs_createdat,
        prs_updatedat
    }: {
        prs_uuid?: string;
        scp_uuid: string;
        usr_uuidlinked?: string | null;
        prs_name: string;
        prs_type?: string;
        prs_phone?: string | null;
        prs_email?: string | null;
        prs_taxid?: string | null;
        prs_active?: boolean;
        prs_createdat?: Date;
        prs_updatedat?: Date;
    }) {
        this.prs_uuid = prs_uuid ?? uuid();
        this.scp_uuid = scp_uuid;
        this.usr_uuidlinked = usr_uuidlinked ?? null;
        this.prs_name = prs_name;
        this.prs_type = prs_type ?? 'OTRO';
        this.prs_phone = prs_phone ?? null;
        this.prs_email = prs_email ?? null;
        this.prs_taxid = prs_taxid ?? null;
        this.prs_active = prs_active ?? true;
        this.prs_createdat = prs_createdat ?? moment().toDate();
        this.prs_updatedat = prs_updatedat ?? moment().toDate();
    }
}
