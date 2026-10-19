import { TransactionRepository } from "../../domain/transaction/transaction.repository";
import { TransactionValue } from "../../domain/transaction/transaction.value";
import { PersonRepository } from "../../domain/person/person.repository";
import { TimezoneConverter } from "../../infrastructure/utils/TimezoneConverter";

export class TransactionUseCase {
    constructor(
        private readonly transactionRepository: TransactionRepository,
        private readonly personRepository?: PersonRepository
    ) {
        this.getTransactions = this.getTransactions.bind(this);
        this.getDetailTransaction = this.getDetailTransaction.bind(this);
        this.createTransaction = this.createTransaction.bind(this);
        this.updateTransaction = this.updateTransaction.bind(this);
        this.deleteTransaction = this.deleteTransaction.bind(this);
    }

    public async getTransactions(scp_uuid: string, trx_type?: string) {
        try {
            const transactions = await this.transactionRepository.getTransactions(scp_uuid, trx_type);
            if (!transactions) {
                return [];
            }
            return transactions.map(t => ({
                trx_uuid: t.trx_uuid,
                scp_uuid: t.scp_uuid,
                scp: t.scp,
                usr_uuidcreator: t.usr_uuidcreator,
                trx_type: t.trx_type,
                trx_datetime: TimezoneConverter.toIsoStringInTimezone(t.trx_datetime, 'America/Buenos_Aires'),
                trx_amount: t.trx_amount,
                trx_currency: t.trx_currency,
                crd_uuid: t.crd_uuid,
                target_crduuid: t.target_crduuid,
                trx_concept: t.trx_concept,
                prs_uuid: t.prs_uuid,
                prs: t.prs,
                prs_uuidactor: t.prs_uuidactor,
                actor: t.actor,
                trx_commissionrate: t.trx_commissionrate ?? null,
                trx_commissionamount: t.trx_commissionamount ?? null,
                trx_notes: t.trx_notes,
                trx_createdat: TimezoneConverter.toIsoStringInTimezone(t.trx_createdat, 'America/Buenos_Aires'),
                trx_updatedat: TimezoneConverter.toIsoStringInTimezone(t.trx_updatedat, 'America/Buenos_Aires'),
            }));
        } catch (error: any) {
            console.error('Error en getTransactions (use case):', error.message);
            throw error;
        }
    }

    public async getDetailTransaction(trx_uuid: string) {
        try {
            const t = await this.transactionRepository.findTransactionById(trx_uuid);
            if (!t) {
                throw new Error(`No hay transacción con el Id: ${trx_uuid}`);
            }
            return {
                trx_uuid: t.trx_uuid,
                scp_uuid: t.scp_uuid,
                scp: t.scp,
                usr_uuidcreator: t.usr_uuidcreator,
                trx_type: t.trx_type,
                trx_datetime: TimezoneConverter.toIsoStringInTimezone(t.trx_datetime, 'America/Buenos_Aires'),
                trx_amount: t.trx_amount,
                trx_currency: t.trx_currency,
                crd_uuid: t.crd_uuid,
                target_crduuid: t.target_crduuid,
                trx_concept: t.trx_concept,
                prs_uuid: t.prs_uuid,
                prs: t.prs,
                prs_uuidactor: t.prs_uuidactor,
                actor: t.actor,
                trx_commissionrate: t.trx_commissionrate ?? null,
                trx_commissionamount: t.trx_commissionamount ?? null,
                trx_notes: t.trx_notes,
                trx_createdat: TimezoneConverter.toIsoStringInTimezone(t.trx_createdat, 'America/Buenos_Aires'),
                trx_updatedat: TimezoneConverter.toIsoStringInTimezone(t.trx_updatedat, 'America/Buenos_Aires'),
            };
        } catch (error: any) {
            console.error('Error en getDetailTransaction (use case):', error.message);
            throw error;
        }
    }

    public async createTransaction({
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
        trx_notes
    }: {
        trx_uuid?: string;
        scp_uuid: string;
        usr_uuidcreator: string;
        trx_type: string;
        trx_datetime?: Date;
        trx_amount: number;
        trx_currency?: string;
        crd_uuid?: string | null;
        target_crduuid?: string | null;
        trx_concept: string;
        prs_uuid?: string | null;
        prs_uuidactor?: string | null;
        trx_commissionrate?: number | null;
        trx_commissionamount?: number | null;
        trx_notes?: string | null;
    }) {
        try {
            let finalCommissionRate = trx_commissionrate;
            let finalCommissionAmount = trx_commissionamount;

            // Regla de Negocio: Cálculo automático de comisión para ingresos con vendedor asociado
            const sellerUuid = prs_uuidactor || prs_uuid;
            if (trx_type === 'INGRESO' && sellerUuid) {
                if ((finalCommissionRate === undefined || finalCommissionRate === null) && this.personRepository) {
                    const person = await this.personRepository.findPersonById(sellerUuid);
                    if (person && person.prs_commissionrate != null) {
                        finalCommissionRate = person.prs_commissionrate;
                    }
                }

                if (finalCommissionRate != null && (finalCommissionAmount === undefined || finalCommissionAmount === null)) {
                    finalCommissionAmount = Math.round(((trx_amount * finalCommissionRate) / 100) * 100) / 100;
                }
            }

            const transactionValue = new TransactionValue({
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
                trx_commissionrate: finalCommissionRate,
                trx_commissionamount: finalCommissionAmount,
                trx_notes
            });
            const created = await this.transactionRepository.createTransaction(transactionValue);
            if (!created) {
                throw new Error(`No se pudo insertar la transacción.`);
            }
            return {
                trx_uuid: created.trx_uuid,
                scp_uuid: created.scp_uuid,
                usr_uuidcreator: created.usr_uuidcreator,
                trx_type: created.trx_type,
                trx_datetime: TimezoneConverter.toIsoStringInTimezone(created.trx_datetime, 'America/Buenos_Aires'),
                trx_amount: created.trx_amount,
                trx_currency: created.trx_currency,
                crd_uuid: created.crd_uuid,
                target_crduuid: created.target_crduuid,
                trx_concept: created.trx_concept,
                prs_uuid: created.prs_uuid,
                prs_uuidactor: created.prs_uuidactor,
                trx_commissionrate: created.trx_commissionrate ?? null,
                trx_commissionamount: created.trx_commissionamount ?? null,
                trx_notes: created.trx_notes,
                trx_createdat: TimezoneConverter.toIsoStringInTimezone(created.trx_createdat, 'America/Buenos_Aires'),
                trx_updatedat: TimezoneConverter.toIsoStringInTimezone(created.trx_updatedat, 'America/Buenos_Aires'),
            };
        } catch (error: any) {
            console.error('Error en createTransaction (use case):', error.message);
            throw error;
        }
    }

    public async updateTransaction(trx_uuid: string, {
        scp_uuid,
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
        trx_notes
    }: {
        scp_uuid: string;
        trx_type: string;
        trx_datetime: Date;
        trx_amount: number;
        trx_currency: string;
        crd_uuid?: string | null;
        target_crduuid?: string | null;
        trx_concept: string;
        prs_uuid?: string | null;
        prs_uuidactor?: string | null;
        trx_commissionrate?: number | null;
        trx_commissionamount?: number | null;
        trx_notes?: string | null;
    }) {
        try {
            let finalCommissionRate = trx_commissionrate;
            let finalCommissionAmount = trx_commissionamount;

            // Regla de Negocio: Cálculo automático de comisión para ingresos con vendedor asociado
            const sellerUuid = prs_uuidactor || prs_uuid;
            if (trx_type === 'INGRESO' && sellerUuid) {
                if ((finalCommissionRate === undefined || finalCommissionRate === null) && this.personRepository) {
                    const person = await this.personRepository.findPersonById(sellerUuid);
                    if (person && person.prs_commissionrate != null) {
                        finalCommissionRate = person.prs_commissionrate;
                    }
                }

                if (finalCommissionRate != null && (finalCommissionAmount === undefined || finalCommissionAmount === null)) {
                    finalCommissionAmount = Math.round(((trx_amount * finalCommissionRate) / 100) * 100) / 100;
                }
            }

            const updated = await this.transactionRepository.updateTransaction(trx_uuid, {
                scp_uuid,
                trx_type,
                trx_datetime,
                trx_amount,
                trx_currency,
                crd_uuid,
                target_crduuid,
                trx_concept,
                prs_uuid,
                prs_uuidactor,
                trx_commissionrate: finalCommissionRate,
                trx_commissionamount: finalCommissionAmount,
                trx_notes
            });
            if (!updated) {
                throw new Error(`No se pudo actualizar la transacción.`);
            }
            return {
                trx_uuid: updated.trx_uuid,
                scp_uuid: updated.scp_uuid,
                usr_uuidcreator: updated.usr_uuidcreator,
                trx_type: updated.trx_type,
                trx_datetime: TimezoneConverter.toIsoStringInTimezone(updated.trx_datetime, 'America/Buenos_Aires'),
                trx_amount: updated.trx_amount,
                trx_currency: updated.trx_currency,
                crd_uuid: updated.crd_uuid,
                target_crduuid: updated.target_crduuid,
                trx_concept: updated.trx_concept,
                prs_uuid: updated.prs_uuid,
                prs_uuidactor: updated.prs_uuidactor,
                trx_commissionrate: updated.trx_commissionrate ?? null,
                trx_commissionamount: updated.trx_commissionamount ?? null,
                trx_notes: updated.trx_notes,
                trx_createdat: TimezoneConverter.toIsoStringInTimezone(updated.trx_createdat, 'America/Buenos_Aires'),
                trx_updatedat: TimezoneConverter.toIsoStringInTimezone(updated.trx_updatedat, 'America/Buenos_Aires'),
            };
        } catch (error: any) {
            console.error('Error en updateTransaction (use case):', error.message);
            throw error;
        }
    }

    public async deleteTransaction(trx_uuid: string) {
        try {
            const deleted = await this.transactionRepository.deleteTransaction(trx_uuid);
            if (!deleted) {
                throw new Error(`No se pudo eliminar la transacción.`);
            }
            return {
                trx_uuid: deleted.trx_uuid,
                scp_uuid: deleted.scp_uuid,
                usr_uuidcreator: deleted.usr_uuidcreator,
                trx_type: deleted.trx_type,
                trx_datetime: TimezoneConverter.toIsoStringInTimezone(deleted.trx_datetime, 'America/Buenos_Aires'),
                trx_amount: deleted.trx_amount,
                trx_currency: deleted.trx_currency,
                crd_uuid: deleted.crd_uuid,
                target_crduuid: deleted.target_crduuid,
                trx_concept: deleted.trx_concept,
                prs_uuid: deleted.prs_uuid,
                prs_uuidactor: deleted.prs_uuidactor,
                trx_notes: deleted.trx_notes,
                trx_createdat: TimezoneConverter.toIsoStringInTimezone(deleted.trx_createdat, 'America/Buenos_Aires'),
                trx_updatedat: TimezoneConverter.toIsoStringInTimezone(deleted.trx_updatedat, 'America/Buenos_Aires'),
            };
        } catch (error: any) {
            console.error('Error en deleteTransaction (use case):', error.message);
            throw error;
        }
    }
}
