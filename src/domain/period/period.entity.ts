import { StatusPeriodEntity } from "../status-period/status-period.entity";

export interface PeriodEntity {
    usr_uuid: string;
    crd_uuid: string;
    per_uuid: string;
    per_periodnumber: number;
    per_startdate: Date;
    per_enddate: Date;
    per_duedate: Date;
    sper_uuid: string;
    sper?: StatusPeriodEntity;
    per_previousbalance: number;
    per_interest: number;
    per_createdat: Date;
    per_updatedat: Date;
}

export type PeriodUpdateData = Pick<PeriodEntity, 
    'per_periodnumber' | 
    'per_startdate' | 
    'per_enddate' | 
    'per_duedate' | 
    'sper_uuid' | 
    'per_previousbalance' | 
    'per_interest'
>;