export interface StatusPeriodEntity {
    sper_uuid: string;
    sper_name: string;
    sper_description: string;
    sper_createdat: Date;
    sper_updatedat: Date;
}

export type StatusPeriodUpdateData = Pick<StatusPeriodEntity, 'sper_name' | 'sper_description'>;