import { StatusPeriodEntity, StatusPeriodUpdateData } from "./status-period.entity";

export interface StatusPeriodRepository {
    getStatusPeriods(): Promise<StatusPeriodEntity[] | null>;
    findStatusPeriodById(sper_uuid: string): Promise<StatusPeriodEntity | null>;
    createStatusPeriod(statusPeriod: StatusPeriodEntity): Promise<StatusPeriodEntity | null>;
    updateStatusPeriod(sper_uuid: string, statusPeriod: StatusPeriodUpdateData): Promise<StatusPeriodEntity | null>;
    deleteStatusPeriod(sper_uuid: string): Promise<StatusPeriodEntity | null>;
    findStatusPeriodByName(sper_name: string, excludeUuid?: string | null): Promise<StatusPeriodEntity | null>;
}