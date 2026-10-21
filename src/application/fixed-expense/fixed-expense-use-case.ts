import { v4 as uuid } from 'uuid';
import { FixedExpenseRepository } from "../../domain/fixed-expense/fixed-expense.repository";
import { FixedExpenseValue } from "../../domain/fixed-expense/fixed-expense.value";
import { FixedExpenseEntity, FixedExpenseUpdateData } from "../../domain/fixed-expense/fixed-expense.entity";
import { SequelizeTransaction } from "../../infrastructure/model/transaction/transaction.model";

export class FixedExpenseUseCase {
    constructor(
        private readonly fixedExpenseRepository: FixedExpenseRepository
    ) {
        this.getFixedExpenses = this.getFixedExpenses.bind(this);
        this.getFixedExpenseById = this.getFixedExpenseById.bind(this);
        this.createFixedExpense = this.createFixedExpense.bind(this);
        this.updateFixedExpense = this.updateFixedExpense.bind(this);
        this.deleteFixedExpense = this.deleteFixedExpense.bind(this);
        this.payFixedExpense = this.payFixedExpense.bind(this);
    }

    public async getFixedExpenses(scp_uuid: string, periodMonth?: string): Promise<FixedExpenseEntity[]> {
        return await this.fixedExpenseRepository.getFixedExpenses(scp_uuid, periodMonth);
    }

    public async getFixedExpenseById(fex_uuid: string): Promise<FixedExpenseEntity | null> {
        return await this.fixedExpenseRepository.getFixedExpenseById(fex_uuid);
    }

    public async createFixedExpense(data: any): Promise<FixedExpenseEntity> {
        if (!data.scp_uuid || typeof data.scp_uuid !== 'string' || !data.scp_uuid.trim()) {
            throw new Error('El ámbito contable (scp_uuid) es obligatorio para registrar un gasto fijo.');
        }
        if (!data.usr_uuid || typeof data.usr_uuid !== 'string' || !data.usr_uuid.trim()) {
            throw new Error('El usuario creador (usr_uuid) es obligatorio.');
        }
        if (!data.fex_name || typeof data.fex_name !== 'string' || !data.fex_name.trim()) {
            throw new Error('El nombre del gasto o servicio es obligatorio.');
        }
        const fixedExpenseValue = new FixedExpenseValue(data);
        return await this.fixedExpenseRepository.createFixedExpense(fixedExpenseValue);
    }

    public async updateFixedExpense(fex_uuid: string, data: FixedExpenseUpdateData): Promise<FixedExpenseEntity | null> {
        return await this.fixedExpenseRepository.updateFixedExpense(fex_uuid, data);
    }

    public async deleteFixedExpense(fex_uuid: string): Promise<boolean> {
        return await this.fixedExpenseRepository.deleteFixedExpense(fex_uuid);
    }

    /**
     * Registra el pago mensual de un gasto fijo, creando la transacción contable de tipo EGRESO
     * y actualizando el monto de referencia del servicio.
     */
    public async payFixedExpense(
        fex_uuid: string,
        paymentData: {
            trx_amount: number;
            trx_datetime?: Date | string;
            crd_uuid?: string | null;
            prs_uuidactor?: string | null;
            trx_notes?: string | null;
            usr_uuidcreator: string;
        }
    ) {
        const fixedExpense = await this.fixedExpenseRepository.getFixedExpenseById(fex_uuid);
        if (!fixedExpense) {
            throw new Error(`Gasto fijo con ID ${fex_uuid} no encontrado.`);
        }

        const trxDatetime = paymentData.trx_datetime ? new Date(paymentData.trx_datetime) : new Date();
        const amountNum = Number(paymentData.trx_amount);
        if (isNaN(amountNum) || amountNum <= 0) {
            throw new Error('El importe a pagar debe ser un número mayor a cero.');
        }

        // Crear la transacción real de egreso en la base de datos
        const createdTransaction = await SequelizeTransaction.create({
            trx_uuid: uuid(),
            scp_uuid: fixedExpense.scp_uuid,
            usr_uuidcreator: paymentData.usr_uuidcreator,
            trx_type: 'EGRESO',
            trx_datetime: trxDatetime,
            trx_amount: amountNum,
            trx_currency: fixedExpense.fex_currency || 'ARS',
            crd_uuid: paymentData.crd_uuid !== undefined ? paymentData.crd_uuid : fixedExpense.crd_uuid,
            target_crduuid: null,
            trx_concept: fixedExpense.fex_name,
            prs_uuid: fixedExpense.prs_uuid,
            prs_uuidactor: paymentData.prs_uuidactor !== undefined ? paymentData.prs_uuidactor : fixedExpense.prs_uuidactor,
            fex_uuid: fixedExpense.fex_uuid,
            trx_notes: paymentData.trx_notes || fixedExpense.fex_notes || null,
            trx_commissionrate: null,
            trx_commissionamount: null,
            trx_createdat: new Date(),
            trx_updatedat: new Date()
        });

        // Actualizar el monto de referencia en la plantilla para el mes siguiente
        await this.fixedExpenseRepository.updateFixedExpense(fex_uuid, {
            fex_referenceamount: amountNum
        });

        return {
            success: true,
            message: 'Pago de gasto fijo registrado correctamente.',
            transaction: createdTransaction.get({ plain: true })
        };
    }
}
