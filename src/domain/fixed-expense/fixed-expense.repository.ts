import { FixedExpenseEntity, FixedExpenseUpdateData } from "./fixed-expense.entity";

/**
 * Puerto de repositorio para persistencia y consulta de Gastos Fijos.
 */
export interface FixedExpenseRepository {
    getFixedExpenses(scp_uuid: string, periodMonth?: string): Promise<FixedExpenseEntity[]>;
    getFixedExpenseById(fex_uuid: string): Promise<FixedExpenseEntity | null>;
    createFixedExpense(fixedExpense: FixedExpenseEntity): Promise<FixedExpenseEntity>;
    updateFixedExpense(fex_uuid: string, data: FixedExpenseUpdateData): Promise<FixedExpenseEntity | null>;
    deleteFixedExpense(fex_uuid: string): Promise<boolean>;
}
