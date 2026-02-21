import { BankEntity, BankUpdateData } from "./bank.entity";

export interface BankRepository {
    getBanks(usr_uuid: string): Promise<BankEntity[] | null>;
    findBankById(usr_uuid: string, ban_uuid: string): Promise<BankEntity | null>;
    createBank(bank: BankEntity): Promise<BankEntity | null>;
    updateBank(usr_uuid: string, ban_uuid: string, bank: BankUpdateData): Promise<BankEntity | null>;
    deleteBank(usr_uuid: string, ban_uuid: string): Promise<BankEntity | null>;
    findBankByName(usr_uuid: string, ban_name: string, excludeUuid?: string | null): Promise<BankEntity | null>;
}