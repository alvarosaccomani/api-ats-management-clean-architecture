import { PeriodEntity, PeriodUpdateData } from "./period.entity";

export interface PeriodRepository {
    getPeriods(usr_uuid: string, crd_uuid: string): Promise<PeriodEntity[] | null>;
    findPeriodById(usr_uuid: string, crd_uuid: string, per_uuid: string): Promise<PeriodEntity | null>;
    createPeriod(period: PeriodEntity): Promise<PeriodEntity | null>;
    updatePeriod(usr_uuid: string, crd_uuid: string, per_uuid: string, period: PeriodUpdateData): Promise<PeriodEntity | null>;
    deletePeriod(usr_uuid: string, crd_uuid: string, per_uuid: string): Promise<PeriodEntity | null>;
    findPeriodByNumber(usr_uuid: string, crd_uuid: string, per_periodnumber: number): Promise<PeriodEntity | null>;
}