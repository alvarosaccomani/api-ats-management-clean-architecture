import { DashboardSummaryEntity } from "./dashboard.entity";

export interface DashboardRepository {
  getDashboardSummary(usr_uuid: string, scp_uuid?: string): Promise<DashboardSummaryEntity>;
}
