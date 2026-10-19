import { Op } from 'sequelize';
import { CommissionRepository } from "../../../domain/commission/commission.repository";
import { SellerCommissionSummaryEntity } from "../../../domain/commission/commission.entity";
import { SequelizePerson } from "../../model/person/person.model";
import { SequelizeTransaction } from "../../model/transaction/transaction.model";
import { SequelizeScope } from "../../model/scope/scope.model";
import { TransactionEntity } from "../../../domain/transaction/transaction.entity";

export class SequelizeCommissionRepository implements CommissionRepository {
    async getSellerCommissions(usr_uuid: string, scp_uuid?: string): Promise<SellerCommissionSummaryEntity> {
        try {
            const personWhere: any = {
                usr_uuidlinked: usr_uuid,
                prs_active: true
            };
            if (scp_uuid && scp_uuid !== 'ALL') {
                personWhere.scp_uuid = scp_uuid;
            }

            const linkedPersons = await SequelizePerson.findAll({ where: personWhere });
            const personUuids = linkedPersons.map(p => p.prs_uuid);

            if (personUuids.length === 0) {
                return {
                    usr_uuid,
                    total_sales: 0,
                    total_commission: 0,
                    sales_count: 0,
                    sales: []
                };
            }

            const transactions = await SequelizeTransaction.findAll({
                where: {
                    [Op.or]: [
                        { prs_uuidactor: personUuids },
                        { prs_uuidactor: null, prs_uuid: personUuids }
                    ],
                    trx_type: 'INGRESO'
                },
                include: [
                    { model: SequelizeScope, as: 'scp' },
                    { model: SequelizePerson, as: 'prs' },
                    { model: SequelizePerson, as: 'actor' }
                ],
                order: [['trx_datetime', 'DESC']]
            });

            const sales = transactions.map(t => t.get({ plain: true }) as TransactionEntity);

            let total_sales = 0;
            let total_commission = 0;

            sales.forEach(s => {
                total_sales += Number(s.trx_amount) || 0;
                total_commission += Number(s.trx_commissionamount) || 0;
            });

            return {
                usr_uuid,
                total_sales: Math.round(total_sales * 100) / 100,
                total_commission: Math.round(total_commission * 100) / 100,
                sales_count: sales.length,
                sales
            };
        } catch (error: any) {
            console.error('Error en getSellerCommissions:', error.message);
            throw error;
        }
    }
}
