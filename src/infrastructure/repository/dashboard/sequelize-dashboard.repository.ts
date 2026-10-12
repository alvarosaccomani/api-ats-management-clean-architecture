import { DashboardRepository } from '../../../domain/dashboard/dashboard.repository';
import { DashboardSummaryEntity, ScopeBalanceSummary } from '../../../domain/dashboard/dashboard.entity';
import { SequelizeTransaction } from '../../model/transaction/transaction.model';
import { SequelizeScope } from '../../model/scope/scope.model';
import { SequelizeScopeUser } from '../../model/scope-user/scope-user.model';
import { SequelizePerson } from '../../model/person/person.model';

export class SequelizeDashboardRepository implements DashboardRepository {
  async getDashboardSummary(usr_uuid: string, scp_uuid?: string): Promise<DashboardSummaryEntity> {
    try {
      // 1. Get user scopes (owned + shared scope-user)
      const ownedScopes = await SequelizeScope.findAll({
        where: { usr_uuidowner: usr_uuid, scp_active: true }
      });

      const scopeUserLinks = await SequelizeScopeUser.findAll({
        where: { usr_uuid: usr_uuid },
        include: [{ model: SequelizeScope, as: 'scope' }]
      });

      const userScopes: any[] = [
        ...ownedScopes.map(s => s.get({ plain: true })),
        ...scopeUserLinks.map((su: any) => su.scope ? su.scope.get({ plain: true }) : null).filter(Boolean)
      ];

      // Filter deduplicated scope UUIDs
      const userScopeUuids = Array.from(new Set(userScopes.map(s => s.scp_uuid)));

      // Target scope UUIDs to filter transactions
      let targetScopeUuids = userScopeUuids;
      if (scp_uuid && scp_uuid !== 'ALL') {
        targetScopeUuids = userScopeUuids.filter(id => id === scp_uuid);
      }

      if (targetScopeUuids.length === 0) {
        return {
          usr_uuid,
          scp_uuid: scp_uuid || 'ALL',
          total_income: 0,
          total_expense: 0,
          net_balance: 0,
          transaction_count: 0,
          recent_transactions: [],
          scopes_summary: []
        };
      }

      // 2. Fetch all transactions in target scopes
      const transactions = await SequelizeTransaction.findAll({
        where: {
          scp_uuid: targetScopeUuids
        },
        include: [
          { model: SequelizeScope, as: 'scp' },
          { model: SequelizePerson, as: 'prs' }
        ],
        order: [['trx_datetime', 'DESC']]
      });

      const plainTransactions = transactions.map(t => t.get({ plain: true }));

      // 3. Compute overall totals
      let total_income = 0;
      let total_expense = 0;

      plainTransactions.forEach((t: any) => {
        if (t.trx_type === 'INGRESO') {
          total_income += Number(t.trx_amount) || 0;
        } else if (t.trx_type === 'EGRESO') {
          total_expense += Number(t.trx_amount) || 0;
        }
      });

      const net_balance = total_income - total_expense;

      // 4. Compute per-scope summary
      const scopeSummaryMap = new Map<string, ScopeBalanceSummary>();
      userScopes.forEach(s => {
        scopeSummaryMap.set(s.scp_uuid, {
          scp_uuid: s.scp_uuid,
          scp_name: s.scp_name,
          scp_color: s.scp_color || '#108ee9',
          total_income: 0,
          total_expense: 0,
          balance: 0
        });
      });

      plainTransactions.forEach((t: any) => {
        const scpSummary = scopeSummaryMap.get(t.scp_uuid);
        if (scpSummary) {
          if (t.trx_type === 'INGRESO') {
            scpSummary.total_income += Number(t.trx_amount) || 0;
          } else if (t.trx_type === 'EGRESO') {
            scpSummary.total_expense += Number(t.trx_amount) || 0;
          }
          scpSummary.balance = scpSummary.total_income - scpSummary.total_expense;
        }
      });

      const scopes_summary = Array.from(scopeSummaryMap.values());

      // 5. Recent transactions (top 5)
      const recent_transactions = plainTransactions.slice(0, 5);

      return {
        usr_uuid,
        scp_uuid: scp_uuid || 'ALL',
        total_income,
        total_expense,
        net_balance,
        transaction_count: plainTransactions.length,
        recent_transactions,
        scopes_summary
      };
    } catch (error: any) {
      console.error('Error en getDashboardSummary:', error.message);
      throw error;
    }
  }
}
