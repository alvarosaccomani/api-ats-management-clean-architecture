export interface ScopeEntity {
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
}

export type ScopeUpdateData = Pick<ScopeEntity, 
    'scp_name' | 
    'scp_description' | 
    'scp_isshared' | 
    'scp_color' | 
    'scp_icon' | 
    'scp_active'
>;