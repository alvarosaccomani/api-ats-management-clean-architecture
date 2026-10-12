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
  app.get(`${apiPrefix}/dashboard/summary/:usr_uuid`, dashboardController.getSummary);
}

export default configureDashboardRoutes;
