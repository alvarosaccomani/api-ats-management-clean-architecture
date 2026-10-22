import { TransactionEntity, TransactionUpdateData } from "./transaction.entity";

export interface TransactionRepository {
    getTransactions(usr_uuid: string, scp_uuid?: string, trx_type?: string): Promise<TransactionEntity[] | null>;
    findTransactionById(trx_uuid: string): Promise<TransactionEntity | null>;
    createTransaction(transaction: TransactionEntity): Promise<TransactionEntity | null>;
    createBulkTransactions(transactions: TransactionEntity[]): Promise<TransactionEntity[]>;
    updateTransaction(trx_uuid: string, transaction: TransactionUpdateData): Promise<TransactionEntity | null>;
    deleteTransaction(trx_uuid: string): Promise<TransactionEntity | null>;
}
