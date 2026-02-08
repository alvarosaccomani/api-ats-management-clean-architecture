import { BankEntity, BankUpdateData } from "./bank.entity";

export interface BankRepository {
    getBanks(): Promise<BankEntity[] | null>;
    findBankById(ban_uuid: string): Promise<BankEntity | null>;
    createBank(bank: BankEntity): Promise<BankEntity | null>;
    updateBank(ban_uuid: string, bank: BankUpdateData): Promise<BankEntity | null>;
    deleteBank(ban_uuid: string): Promise<BankEntity | null>;
    findBankByName(ban_name: string, excludeUuid?: string | null): Promise<BankEntity | null>;
}