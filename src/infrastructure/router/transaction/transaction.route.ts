import { Express } from 'express';
import { TransactionUseCase } from '../../../application/transaction/transaction-use-case';
import { TransactionController } from '../../controller/transaction/transaction.controller';
import { SequelizeTransactionRepository } from '../../repository/transaction/sequelize-transaction.repository';
import SocketAdapter from "../../services/socketAdapter";

function configureTransactionRoutes(app: Express, socketAdapter: SocketAdapter) {
    const transactionRepository = new SequelizeTransactionRepository();
    const transactionUseCase = new TransactionUseCase(transactionRepository);
    const transactionCtrl = new TransactionController(transactionUseCase);

    const apiPrefix = process.env.BASE_URL_API ? `/${process.env.BASE_URL_API}` : '/api';

    app.get(`${apiPrefix}/transactions/:scp_uuid`, transactionCtrl.getAllCtrl);
    app.get(`${apiPrefix}/transaction/:trx_uuid`, transactionCtrl.getDetailCtrl);
    app.post(`${apiPrefix}/transaction`, transactionCtrl.insertCtrl);
    app.put(`${apiPrefix}/transaction/:trx_uuid`, transactionCtrl.updateCtrl);
    app.delete(`${apiPrefix}/transaction/:trx_uuid`, transactionCtrl.deleteCtrl);
}

export default configureTransactionRoutes;
