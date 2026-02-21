import { Sequelize } from 'sequelize';
import { BankEntity, BankUpdateData } from "../../../domain/bank/bank.entity";
import { BankRepository } from "../../../domain/bank/bank.repository";
import { SequelizeBank } from "../../model/bank/bank.model";
import { Op } from "sequelize";

export class SequelizeBankRepository implements BankRepository {
    async getBanks(usr_uuid: string): Promise<BankEntity[] | null> {
        try {
            const banks = await SequelizeBank.findAll({
                where: {
                    usr_uuid: usr_uuid ?? null
                },
                order: [
                    [Sequelize.col('ban_name'), 'ASC']
                ]
            });
            if(!banks) {
                throw new Error(`No hay bancos`)
            };
            return banks;
        } catch (error: any) {
            console.error('Error en getBanks:', error.message);
            throw error;
        }
    }

    async findBankById(usr_uuid: string, ban_uuid: string): Promise<BankEntity | null> {
        try {
            const bank = await SequelizeBank.findOne({ 
                where: { 
                    usr_uuid: usr_uuid ?? null,
                    ban_uuid: ban_uuid ?? null
                } 
            });
            if(!bank) {
                throw new Error(`No hay banco con el Id: ${ban_uuid}`);
            };
            return bank.dataValues;
        } catch (error: any) {
            console.error('Error en findBankById:', error.message);
            throw error;
        }
    }

    async createBank(bank: BankEntity): Promise<BankEntity | null> {
        try {
            let { usr_uuid, ban_uuid, ban_name, ban_description, ban_createdat, ban_updatedat } = bank
            const result = await SequelizeBank.create({ usr_uuid, ban_uuid, ban_name, ban_description, ban_createdat, ban_updatedat });
            if(!result) {
                throw new Error(`No se ha agregado el banco`);
            }
            let newBank = result.dataValues as SequelizeBank
            return newBank;
        } catch (error: any) {
            console.error('Error en createBank:', error.message);
            throw error;
        }
    }

    async updateBank(usr_uuid: string, ban_uuid: string, bank: BankUpdateData): Promise<BankEntity | null> {
        try {
            const [updatedCount, [updatedBank]] = await SequelizeBank.update(
                {
                    ban_name: bank.ban_name,
                    ban_description: bank.ban_description
                },
                {
                    where: { ban_uuid },
                    returning: true,
                }
            );
            if (updatedCount === 0) {
                throw new Error(`No se ha actualizado el banco`);
            }
            return updatedBank.get({ plain: true }) as BankEntity;
        } catch (error: any) {
            console.error('Error en updateBank:', error.message);
            throw error;
        }
    }

    async deleteBank(usr_uuid: string, ban_uuid: string): Promise<BankEntity | null> {
        try {
            const bank = await this.findBankById(usr_uuid, ban_uuid);
            const result = await SequelizeBank.destroy({ where: { usr_uuid, ban_uuid } });
            if(!result) {
                throw new Error(`No se ha eliminado el banco`);
            };
            return bank;
        } catch (error: any) {
            console.error('Error en deleteBank:', error.message);
            throw error;
        }
    }

    async findBankByName(usr_uuid: string, ban_name: string, excludeUuid?: string | null): Promise<BankEntity | null> {
        try {
            const whereCondition: any = { usr_uuid: usr_uuid ?? null, ban_name: ban_name ?? null };
            if (excludeUuid) {
                whereCondition.ban_uuid = { [Op.ne]: excludeUuid };
            }
            const bank = await SequelizeBank.findOne({ 
                where: whereCondition
            });
            return bank;
        } catch (error: any) {
            console.error('Error en findBankByName:', error.message);
            throw error;
        }
    }
}