import { CommissionRepository } from "../../domain/commission/commission.repository";
import { SellerCommissionSummaryEntity } from "../../domain/commission/commission.entity";

export class CommissionUseCase {
    constructor(private readonly commissionRepository: CommissionRepository) {}

    public async getSellerCommissions(usr_uuid: string, scp_uuid?: string): Promise<SellerCommissionSummaryEntity> {
        return await this.commissionRepository.getSellerCommissions(usr_uuid, scp_uuid);
    }
}
