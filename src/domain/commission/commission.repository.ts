import { SellerCommissionSummaryEntity } from "./commission.entity";

export interface CommissionRepository {
    getSellerCommissions(usr_uuid: string, scp_uuid?: string): Promise<SellerCommissionSummaryEntity>;
}
