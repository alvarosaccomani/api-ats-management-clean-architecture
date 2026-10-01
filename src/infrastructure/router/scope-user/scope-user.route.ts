import { Express } from 'express';
import { ScopeUserUseCase } from '../../../application/scope-user/scope-user-use-case';
import { ScopeUserController } from '../../controller/scope-user/scope-user.controller';
import { SequelizeScopeUserRepository } from '../../repository/scope-user/sequelize-scope-user.repository';
import SocketAdapter from "../../services/socketAdapter";

function configureScopeUserRoutes(app: Express, socketAdapter: SocketAdapter) {
    const scopeUserRepository = new SequelizeScopeUserRepository();
    const scopeUserUseCase = new ScopeUserUseCase(scopeUserRepository);
    const scopeUserCtrl = new ScopeUserController(scopeUserUseCase);

    const apiPrefix = process.env.BASE_URL_API ? `/${process.env.BASE_URL_API}` : '/api';

    app.get(`${apiPrefix}/scope-users/:scp_uuid`, scopeUserCtrl.getScopeUsersCtrl);
    app.post(`${apiPrefix}/scope-user`, scopeUserCtrl.addScopeUserCtrl);
    app.delete(`${apiPrefix}/scope-user/:scp_uuid/:usr_uuid`, scopeUserCtrl.removeScopeUserCtrl);
}

export default configureScopeUserRoutes;
