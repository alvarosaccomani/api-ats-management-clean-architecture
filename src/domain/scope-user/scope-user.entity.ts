export interface ScopeUserEntity {
    scp_uuid: string;
    usr_uuid: string;
    scpu_role: string;
    scpu_createdat: Date;
}

export type ScopeUserUpdateData = Pick<ScopeUserEntity,
    'scpu_role'
>;