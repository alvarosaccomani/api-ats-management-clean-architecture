import { Express } from "express";
import { SequelizePeriodRepository } from "../../repository/period/sequelize-period.repository";
import { PeriodUseCase } from "../../../application/period/period-use-case";
import { PeriodController } from "../../controller/period/period.controller";
import SocketAdapter from "../../services/socketAdapter";

function configurePeriodRoutes(app: Express, socketAdapter: SocketAdapter) {
    /*
    *   Iniciar repository
    */
    
    const sequelizePeriodRepository = new SequelizePeriodRepository();
    
    /*
    *   Iniciar casos de uso
    */
    
    const periodUseCase = new PeriodUseCase(sequelizePeriodRepository);
    
    /*
    *   Iniciar controller
    */
    
    const periodCtrl = new PeriodController(periodUseCase, socketAdapter);
    
    app.get(`/${process.env.BASE_URL_API}/periods/:usr_uuid/:crd_uuid/:filter?/:page?/:perPage?`, periodCtrl.getAllCtrl);
    app.get(`/${process.env.BASE_URL_API}/period/:usr_uuid/:crd_uuid/:per_uuid`, periodCtrl.getCtrl);
    app.post(`/${process.env.BASE_URL_API}/period`, periodCtrl.insertCtrl);
    app.put(`/${process.env.BASE_URL_API}/period/:usr_uuid/:crd_uuid/:per_uuid`, periodCtrl.updateCtrl);
    app.delete(`/${process.env.BASE_URL_API}/period/:usr_uuid/:crd_uuid/:per_uuid`, periodCtrl.deleteCtrl);
}

export default configurePeriodRoutes;