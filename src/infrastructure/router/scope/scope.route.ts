import { Express } from 'express';
import { ScopeUseCase } from '../../../application/scope/scope-use-case';
import { ScopeController } from '../../controller/scope/scope.controller';
import { SequelizeScopeRepository } from '../../repository/scope/sequelize-scope.repository';
import SocketAdapter from "../../services/socketAdapter";

function configureScopeRoutes(app: Express, socketAdapter: SocketAdapter) {
    const scopeRepository = new SequelizeScopeRepository();
    const scopeUseCase = new ScopeUseCase(scopeRepository);
    const scopeCtrl = new ScopeController(scopeUseCase);

    const apiPrefix = process.env.BASE_URL_API ? `/${process.env.BASE_URL_API}` : '/api';

    app.get(`${apiPrefix}/scopes/:usr_uuid`, scopeCtrl.getAllCtrl);
    app.get(`${apiPrefix}/scope/:scp_uuid`, scopeCtrl.getDetailCtrl);
    app.post(`${apiPrefix}/scope`, scopeCtrl.insertCtrl);
    app.put(`${apiPrefix}/scope/:scp_uuid`, scopeCtrl.updateCtrl);
    app.delete(`${apiPrefix}/scope/:scp_uuid`, scopeCtrl.deleteCtrl);
}

export default configureScopeRoutes;
