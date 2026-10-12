import { Express } from 'express';
import SocketAdapter from '../../services/socketAdapter';
import { SequelizeCommissionRepository } from '../../repository/commission/sequelize-commission.repository';
import { CommissionUseCase } from '../../../application/commission/commission-use-case';
import { CommissionController } from '../../controller/commission/commission.controller';

function configureCommissionRoutes(app: Express, socketAdapter: SocketAdapter): void {
    const commissionRepository = new SequelizeCommissionRepository();
    const commissionUseCase = new CommissionUseCase(commissionRepository);
    const commissionController = new CommissionController(commissionUseCase);

    const apiPrefix = process.env.BASE_URL_API ? `/${process.env.BASE_URL_API}` : '/api';
    app.get(`${apiPrefix}/commissions/seller/:usr_uuid`, commissionController.getSellerCommissions);
}

export default configureCommissionRoutes;
