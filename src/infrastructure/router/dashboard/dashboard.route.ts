import { Express } from 'express';
import SocketAdapter from '../../services/socketAdapter';
import { SequelizeDashboardRepository } from '../../repository/dashboard/sequelize-dashboard.repository';
import { DashboardUseCase } from '../../../application/dashboard/dashboard-use-case';
import { DashboardController } from '../../controller/dashboard/dashboard.controller';

function configureDashboardRoutes(app: Express, socketAdapter: SocketAdapter): void {
  const sequelizeDashboardRepository = new SequelizeDashboardRepository();
  const dashboardUseCase = new DashboardUseCase(sequelizeDashboardRepository);
  const dashboardController = new DashboardController(dashboardUseCase);

  const apiPrefix = process.env.BASE_URL_API ? `/${process.env.BASE_URL_API}` : '/api';
  /**
   * @swagger
   * /dashboard/summary/{usr_uuid}:
   *   get:
   *     tags:
   *       - Dashboard
   *     summary: Obtener resumen métrico del dashboard
   *     description: Retorna las métricas consolidadas del usuario (ingresos totales, egresos, balance neto, cantidad de transacciones, transacciones recientes y resumen por ámbito/scope). Permite filtrar opcionalmente por un ámbito mediante query param.
   *     security:
   *       - bearerAuth: []
   *     parameters:
   *       - in: path
   *         name: usr_uuid
   *         required: true
   *         schema:
   *           type: string
   *           format: uuid
   *         description: UUID del usuario
   *       - in: query
   *         name: scp_uuid
   *         required: false
   *         schema:
   *           type: string
   *           format: uuid
   *         description: UUID del ámbito (scope) para filtrar métricas
   *     responses:
   *       200:
   *         description: Resumen del dashboard obtenido exitosamente.
   *         content:
   *           application/json:
   *             schema:
   *               type: object
   *               properties:
   *                 success:
   *                   type: boolean
   *                   example: true
   *                 data:
   *                   $ref: '#/components/schemas/DashboardSummaryEntity'
   *       500:
   *         description: Error al obtener el resumen del dashboard.
   *         content:
   *           application/json:
   *             schema:
   *               $ref: '#/components/schemas/ErrorResponse'
   */
  app.get(`${apiPrefix}/dashboard/summary/:usr_uuid`, dashboardController.getSummary);
}

export default configureDashboardRoutes;
