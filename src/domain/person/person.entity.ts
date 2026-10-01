export interface PersonEntity {
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
}

export type PersonUpdateData = Pick<PersonEntity,
    'scp_uuid' |
    'usr_uuidlinked' |
    'prs_name' |
    'prs_type' |
    'prs_phone' |
    'prs_email' |
    'prs_taxid' |
    'prs_active'
>;
