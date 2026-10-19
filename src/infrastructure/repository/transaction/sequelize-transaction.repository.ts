import { Sequelize } from 'sequelize';
import { sequelize } from '../../db/sequelize';
import { TransactionEntity, TransactionUpdateData } from "../../../domain/transaction/transaction.entity";
import { TransactionRepository } from "../../../domain/transaction/transaction.repository";
import { SequelizeTransaction } from "../../model/transaction/transaction.model";
import { SequelizePerson } from '../../model/person/person.model';
import { SequelizeScope } from '../../model/scope/scope.model';

export class SequelizeTransactionRepository implements TransactionRepository {
    async getTransactions(scp_uuid: string, trx_type?: string): Promise<TransactionEntity[] | null> {
        try {
            const whereCondition: any = {};
            if (scp_uuid && scp_uuid !== 'ALL') {
                whereCondition.scp_uuid = scp_uuid;
            }
            if (trx_type) {
                whereCondition.trx_type = trx_type;
            }

            const transactions = await SequelizeTransaction.findAll({
                where: whereCondition,
                include: [
                    {
                        model: SequelizeScope,
                        as: 'scp'
                    },
                    {
                        model: SequelizePerson,
                        as: 'prs'
                    },
                    {
                        model: SequelizePerson,
                        as: 'actor'
                    }
                ],
                order: [
                    [Sequelize.col('trx_datetime'), 'DESC']
                ]
            });
            if (!transactions) {
                return [];
            }
            return transactions.map(t => t.get({ plain: true }) as TransactionEntity);
        } catch (error: any) {
            console.error('Error en getTransactions:', error.message);
            throw error;
        }
    }

    async findTransactionById(trx_uuid: string): Promise<TransactionEntity | null> {
        try {
            const transaction = await SequelizeTransaction.findOne({ 
                where: { trx_uuid },
                include: [
                    {
                        model: SequelizeScope,
                        as: 'scp'
                    },
                    {
                        model: SequelizePerson,
                        as: 'prs'
                    },
                    {
                        model: SequelizePerson,
                        as: 'actor'
                    }
                ]
            });
            if (!transaction) {
                return null;
            }
            return transaction.get({ plain: true }) as TransactionEntity;
        } catch (error: any) {
            console.error('Error en findTransactionById:', error.message);
            throw error;
        }
    }

    async createTransaction(transaction: TransactionEntity): Promise<TransactionEntity | null> {
        try {
            const { 
                trx_uuid, 
                scp_uuid, 
                usr_uuidcreator, 
                trx_type, 
                trx_datetime, 
                trx_amount, 
                trx_currency, 
                crd_uuid, 
                target_crduuid, 
                trx_concept, 
                prs_uuid, 
                prs_uuidactor,
                trx_commissionrate,
                trx_commissionamount,
                trx_notes, 
                trx_createdat, 
                trx_updatedat 
            } = transaction;

            const result = await SequelizeTransaction.create({
                trx_uuid,
                scp_uuid,
                usr_uuidcreator,
                trx_type,
                trx_datetime,
                trx_amount,
                trx_currency: trx_currency ?? 'ARS',
                crd_uuid,
                target_crduuid,
                trx_concept,
                prs_uuid,
                prs_uuidactor,
                trx_commissionrate: trx_commissionrate ?? null,
                trx_commissionamount: trx_commissionamount ?? null,
                trx_notes,
                trx_createdat,
                trx_updatedat
            });

            if (!result) {
                throw new Error(`No se ha agregado la transacción`);
            }
            return result.get({ plain: true }) as TransactionEntity;
        } catch (error: any) {
            console.error('Error en createTransaction:', error.message);
            throw error;
        }
    }

    async createBulkTransactions(transactions: TransactionEntity[]): Promise<TransactionEntity[]> {
        const t = await sequelize.transaction();
        try {
            const records = transactions.map(trx => ({
                trx_uuid: trx.trx_uuid,
                scp_uuid: trx.scp_uuid,
                usr_uuidcreator: trx.usr_uuidcreator,
                trx_type: trx.trx_type,
                trx_datetime: trx.trx_datetime,
                trx_amount: trx.trx_amount,
                trx_currency: trx.trx_currency ?? 'ARS',
                crd_uuid: trx.crd_uuid,
                target_crduuid: trx.target_crduuid,
                trx_concept: trx.trx_concept,
                prs_uuid: trx.prs_uuid,
                prs_uuidactor: trx.prs_uuidactor,
                trx_commissionrate: trx.trx_commissionrate ?? null,
                trx_commissionamount: trx.trx_commissionamount ?? null,
                trx_notes: trx.trx_notes,
                trx_createdat: trx.trx_createdat,
                trx_updatedat: trx.trx_updatedat
            }));

            const created = await SequelizeTransaction.bulkCreate(records, {
                transaction: t,
                validate: true
            });

            await t.commit();
            return created.map(c => c.get({ plain: true }) as TransactionEntity);
        } catch (error: any) {
            await t.rollback();
            console.error('Error en createBulkTransactions:', error.message);
            throw error;
        }
    }

    async updateTransaction(trx_uuid: string, transaction: TransactionUpdateData): Promise<TransactionEntity | null> {
        try {
            const [updatedCount, [updatedTransaction]] = await SequelizeTransaction.update(
                {
                    scp_uuid: transaction.scp_uuid,
                    trx_type: transaction.trx_type,
                    trx_datetime: transaction.trx_datetime,
                    trx_amount: transaction.trx_amount,
                    trx_currency: transaction.trx_currency,
                    crd_uuid: transaction.crd_uuid,
                    target_crduuid: transaction.target_crduuid,
                    trx_concept: transaction.trx_concept,
                    prs_uuid: transaction.prs_uuid,
                    prs_uuidactor: transaction.prs_uuidactor,
                    trx_commissionrate: transaction.trx_commissionrate ?? null,
                    trx_commissionamount: transaction.trx_commissionamount ?? null,
                    trx_notes: transaction.trx_notes
                },
                {
                    where: { trx_uuid },
                    returning: true,
                }
            );
            if (updatedCount === 0) {
                throw new Error(`No se ha actualizado la transacción`);
            }
            return updatedTransaction.get({ plain: true }) as TransactionEntity;
        } catch (error: any) {
            console.error('Error en updateTransaction:', error.message);
            throw error;
        }
    }

    async deleteTransaction(trx_uuid: string): Promise<TransactionEntity | null> {
        try {
            const transaction = await this.findTransactionById(trx_uuid);
            const result = await SequelizeTransaction.destroy({ where: { trx_uuid } });
            if (!result) {
                throw new Error(`No se ha eliminado la transacción`);
            }
            return transaction;
        } catch (error: any) {
            console.error('Error en deleteTransaction:', error.message);
            throw error;
        }
    }
}
