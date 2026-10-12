import { TransactionEntity } from "../transaction/transaction.entity";

export interface SellerCommissionSummaryEntity {
    usr_uuid: string;
    total_sales: number;
    total_commission: number;
    sales_count: number;
    sales: TransactionEntity[];
}
