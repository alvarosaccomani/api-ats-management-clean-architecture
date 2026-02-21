import { BankRepository } from "../../domain/bank/bank.repository";
import { BankValue } from "../../domain/bank/bank.value";
import { TimezoneConverter } from "../../infrastructure/utils/TimezoneConverter";

export class BankUseCase {
    constructor(
        private readonly bankRepository: BankRepository
    ) {
        this.getBanks = this.getBanks.bind(this);
        this.getDetailBank = this.getDetailBank.bind(this);
        this.createBank = this.createBank.bind(this);
        this.updateBank = this.updateBank.bind(this);
        this.deleteBank = this.deleteBank.bind(this);
        this.findBankByName = this.findBankByName.bind(this);
    }

    public async getBanks(usr_uuid: string) {
        try {
            const banks = await this.bankRepository.getBanks(usr_uuid);
            if(!banks) {
                throw new Error('No hay bancos.');
            }
            return banks.map(bank => ({
                usr_uuid: bank.usr_uuid,
                ban_uuid: bank.ban_uuid,
                ban_name: bank.ban_name,
                ban_description: bank.ban_description,
                ban_createdat: TimezoneConverter.toIsoStringInTimezone(bank.ban_createdat, 'America/Buenos_Aires'),
                ban_updatedat: TimezoneConverter.toIsoStringInTimezone(bank.ban_updatedat, 'America/Buenos_Aires'),
            }));
        } catch (error: any) {
            console.error('Error en getBanks (use case):', error.message);
            throw error;
        }
    }

    public async getDetailBank(usr_uuid: string, ban_uuid: string) {
        try {
            const bank = await this.bankRepository.findBankById(usr_uuid, ban_uuid);
            if(!bank) {
                throw new Error(`No hay banco con el Id: ${ban_uuid}`);
            }
            return {
                usr_uuid: bank.usr_uuid,
                ban_uuid: bank.ban_uuid,
                ban_name: bank.ban_name,
                ban_description: bank.ban_description,
                ban_createdat: TimezoneConverter.toIsoStringInTimezone(bank.ban_createdat, 'America/Buenos_Aires'),
                ban_updatedat: TimezoneConverter.toIsoStringInTimezone(bank.ban_updatedat, 'America/Buenos_Aires'),
            };
        } catch (error: any) {
            console.error('Error en getDetailBank (use case):', error.message);
            throw error;
        }
    }
    
    public async createBank({ usr_uuid, ban_uuid, ban_name, ban_description } : { usr_uuid: string, ban_uuid: string, ban_name: string, ban_description?: string }) {
        try {
            const bankValue = new BankValue({ usr_uuid, ban_uuid, ban_name, ban_description });
            const bankCreated = await this.bankRepository.createBank(bankValue);
            if(!bankCreated) {
                throw new Error(`No se pudo insertar el banco.`);
            }
            return {
                usr_uuid: bankCreated.usr_uuid,
                ban_uuid: bankCreated.ban_uuid,
                ban_name: bankCreated.ban_name,
                ban_description: bankCreated.ban_description,
                ban_createdat: TimezoneConverter.toIsoStringInTimezone(bankCreated.ban_createdat, 'America/Buenos_Aires'),
                ban_updatedat: TimezoneConverter.toIsoStringInTimezone(bankCreated.ban_updatedat, 'America/Buenos_Aires'),
            };
        } catch (error: any) {
            console.error('Error en createBank (use case):', error.message);
            throw error;
        }
    }

    public async updateBank(usr_uuid: string, ban_uuid: string, { ban_name, ban_description } : { ban_name: string, ban_description: string }) {
        try {
            const bankUpdated = await this.bankRepository.updateBank(usr_uuid, ban_uuid, { ban_name, ban_description });
            if(!bankUpdated) {
                throw new Error(`No se pudo actualizar el banco.`);
            }
            return {
                usr_uuid: bankUpdated.usr_uuid,
                ban_uuid: bankUpdated.ban_uuid,
                ban_name: bankUpdated.ban_name,
                ban_description: bankUpdated.ban_description,
                ban_createdat: TimezoneConverter.toIsoStringInTimezone(bankUpdated.ban_createdat, 'America/Buenos_Aires'),
                ban_updatedat: TimezoneConverter.toIsoStringInTimezone(bankUpdated.ban_updatedat, 'America/Buenos_Aires'),
            };
        } catch (error: any) {
            console.error('Error en updateBank (use case):', error.message);
            throw error;
        }
    }

    public async deleteBank(usr_uuid: string, ban_uuid: string) {
        try {
            const bankDeleted = await this.bankRepository.deleteBank(usr_uuid, ban_uuid);
            if(!bankDeleted) {
                throw new Error(`No se pudo eliminar el banco.`);
            }
            return {
                usr_uuid: bankDeleted.usr_uuid,
                ban_uuid: bankDeleted.ban_uuid,
                ban_name: bankDeleted.ban_name,
                ban_description: bankDeleted.ban_description,
                ban_createdat: TimezoneConverter.toIsoStringInTimezone(bankDeleted.ban_createdat, 'America/Buenos_Aires'),
                ban_updatedat: TimezoneConverter.toIsoStringInTimezone(bankDeleted.ban_updatedat, 'America/Buenos_Aires'),
            };
        } catch (error: any) {
            console.error('Error en deleteBank (use case):', error.message);
            throw error;
        }
    }

    public async findBankByName(usr_uuid: string, ban_name: string, excludeUuid?: string) {
        try {
            const bank = await this.bankRepository.findBankByName(usr_uuid, ban_name, excludeUuid)
            if(bank) {
                throw new Error(`Ya existe un banco con el nombre ${ban_name}.`);
            }
            return bank
        } catch (error: any) {
            console.error('Error en findBankByName (use case):', error.message);
            throw error;
        }
    }
}