export interface ScopeUserEntity {
    scp_uuid: string;
    usr_uuid: string;
    scpu_role: string;
    scpu_createdat: Date;
    user?: {
        usr_uuid: string;
        usr_name: string;
        usr_surname?: string;
        usr_email?: string;
    } | null;
}

export type ScopeUserUpdateData = Pick<ScopeUserEntity,
    'scpu_role'
>;