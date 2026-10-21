import { Op } from "sequelize";
import { FixedExpenseEntity, FixedExpenseUpdateData } from "../../../domain/fixed-expense/fixed-expense.entity";
import { FixedExpenseRepository } from "../../../domain/fixed-expense/fixed-expense.repository";
import { SequelizeFixedExpense } from "../../model/fixed-expense/fixed-expense.model";
import { SequelizePerson } from "../../model/person/person.model";
import { SequelizeCard } from "../../model/card/card.model";
import { SequelizeTransaction } from "../../model/transaction/transaction.model";

export class SequelizeFixedExpenseRepository implements FixedExpenseRepository {
    async getFixedExpenses(scp_uuid: string, periodMonth?: string): Promise<FixedExpenseEntity[]> {
        try {
            const now = new Date();
            let targetPeriod = periodMonth;
            if (!targetPeriod || !/^\d{4}-\d{2}$/.test(targetPeriod)) {
                targetPeriod = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}`;
            }

            const [year, month] = targetPeriod.split('-').map(Number);
            const startOfMonth = new Date(year, month - 1, 1, 0, 0, 0, 0);
            const endOfMonth = new Date(year, month, 0, 23, 59, 59, 999);

            const fixedExpenses = await SequelizeFixedExpense.findAll({
                where: { scp_uuid, fex_active: true },
                include: [
                    { model: SequelizePerson, as: 'supplier', attributes: ['prs_uuid', 'prs_name', 'prs_type'] },
                    { model: SequelizePerson, as: 'actor', attributes: ['prs_uuid', 'prs_name', 'prs_type'] },
                    { model: SequelizeCard, as: 'card', attributes: ['crd_uuid', 'crd_alias', 'crd_last4digits', 'crd_cbualias'] }
                ],
                order: [['fex_dueday', 'ASC']]
            });

            if (!fixedExpenses || fixedExpenses.length === 0) {
                return [];
            }

            const fexUuids = fixedExpenses.map(f => f.fex_uuid);
            const paidTransactions = await SequelizeTransaction.findAll({
                where: {
                    fex_uuid: { [Op.in]: fexUuids },
                    trx_datetime: {
                        [Op.between]: [startOfMonth, endOfMonth]
                    }
                }
            });

            const paidMap = new Map<string, any>();
            paidTransactions.forEach(t => {
                if (t.fex_uuid) {
                    paidMap.set(t.fex_uuid, t.get({ plain: true }));
                }
            });

            return fixedExpenses.map(f => {
                const plain = f.get({ plain: true }) as FixedExpenseEntity;
                const paidTrx = paidMap.get(f.fex_uuid);
                plain.status = paidTrx ? 'PAID' : 'PENDING';
                plain.paid_transaction = paidTrx || null;
                return plain;
            });
        } catch (error: any) {
            console.error('Error en getFixedExpenses (repository):', error.message);
            throw error;
        }
    }

    async getFixedExpenseById(fex_uuid: string): Promise<FixedExpenseEntity | null> {
        try {
            const found = await SequelizeFixedExpense.findOne({
                where: { fex_uuid },
                include: [
                    { model: SequelizePerson, as: 'supplier', attributes: ['prs_uuid', 'prs_name'] },
                    { model: SequelizePerson, as: 'actor', attributes: ['prs_uuid', 'prs_name'] },
                    { model: SequelizeCard, as: 'card', attributes: ['crd_uuid', 'crd_alias', 'crd_last4digits'] }
                ]
            });
            return found ? (found.get({ plain: true }) as FixedExpenseEntity) : null;
        } catch (error: any) {
            console.error('Error en getFixedExpenseById:', error.message);
            throw error;
        }
    }

    async createFixedExpense(fixedExpense: FixedExpenseEntity): Promise<FixedExpenseEntity> {
        try {
            const created = await SequelizeFixedExpense.create(fixedExpense);
            return created.get({ plain: true }) as FixedExpenseEntity;
        } catch (error: any) {
            console.error('Error en createFixedExpense:', error.message);
            throw error;
        }
    }

    async updateFixedExpense(fex_uuid: string, data: FixedExpenseUpdateData): Promise<FixedExpenseEntity | null> {
        try {
            const updatePayload = {
                ...data,
                fex_updatedat: new Date()
            };
            const [affected] = await SequelizeFixedExpense.update(updatePayload, {
                where: { fex_uuid }
            });
            if (affected === 0) return null;
            return await this.getFixedExpenseById(fex_uuid);
        } catch (error: any) {
            console.error('Error en updateFixedExpense:', error.message);
            throw error;
        }
    }

    async deleteFixedExpense(fex_uuid: string): Promise<boolean> {
        try {
            // Soft delete marcando fex_active = false
            const [affected] = await SequelizeFixedExpense.update(
                { fex_active: false, fex_updatedat: new Date() },
                { where: { fex_uuid } }
            );
            return affected > 0;
        } catch (error: any) {
            console.error('Error en deleteFixedExpense:', error.message);
            throw error;
        }
    }
}
