import { Express } from "express";
import { SequelizeAuthRepository } from "../../repository/auth/sequelize-auth.repository";
import { SequelizeRepository } from "../../repository/user/sequelize-user.repository";
import { AuthUseCase } from "../../../application/auth/auth-use-case";
import { UserUseCase } from "../../../application/user/user-use-case";
import { AuthController } from "../../controller/auth/auth.controller";
import SocketAdapter from "../../services/socketAdapter";

function configureAuthRoutes(app: Express, socketAdapter: SocketAdapter) {
    const sequelizeAuthRepository = new SequelizeAuthRepository();
    const sequelizeUserRepository = new SequelizeRepository();
    
    const authUseCase = new AuthUseCase(sequelizeAuthRepository);
    const userUseCase = new UserUseCase(sequelizeUserRepository);
    
    const authCtrl = new AuthController(authUseCase, userUseCase);
    
    app.post(`/${process.env.BASE_URL_API}/login`, authCtrl.loginCtrl);
    app.post(`/${process.env.BASE_URL_API}/register`, authCtrl.saveCtrl);
    app.post(`/${process.env.BASE_URL_API}/confirm-account`, authCtrl.confirmCtrl);
    app.post(`/${process.env.BASE_URL_API}/forgot-password`, authCtrl.forgotCtrl);
    app.post(`/${process.env.BASE_URL_API}/reset-password`, authCtrl.resetCtrl);
    app.post(`/${process.env.BASE_URL_API}/auth/sso/verify`, authCtrl.verifySSOTokenCtrl);
    app.get(`/${process.env.BASE_URL_API}/auth/sso/config`, authCtrl.getAppConfigCtrl);
    app.post(`/${process.env.BASE_URL_API}/auth/sso/log-auth`, authCtrl.logAuthCtrl);
}

export default configureAuthRoutes;
