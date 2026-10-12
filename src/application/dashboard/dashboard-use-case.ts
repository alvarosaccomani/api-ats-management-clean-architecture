import { DashboardRepository } from "../../domain/dashboard/dashboard.repository";
import { DashboardSummaryEntity } from "../../domain/dashboard/dashboard.entity";

export class DashboardUseCase {
  constructor(private readonly dashboardRepository: DashboardRepository) {}

  public async getDashboardSummary(usr_uuid: string, scp_uuid?: string): Promise<DashboardSummaryEntity> {
    return await this.dashboardRepository.getDashboardSummary(usr_uuid, scp_uuid);
  }
}
