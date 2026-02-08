import { Express } from "express";
import { SequelizeStatusPeriodRepository } from "../../repository/status-period/sequelize-status-period.repository";
import { StatusPeriodUseCase } from "../../../application/status-period/status-period-use-case";
import { StatusPeriodController } from "../../controller/status-period/status-period.controller";
import SocketAdapter from "../../services/socketAdapter";

function configureStatusPeriodRoutes(app: Express, socketAdapter: SocketAdapter) {
    /*
    *   Iniciar repository
    */
    
    const sequelizeStatusPeriodRepository = new SequelizeStatusPeriodRepository();
    
    /*
    *   Iniciar casos de uso
    */
    
    const statusPeriodUseCase = new StatusPeriodUseCase(sequelizeStatusPeriodRepository);
    
    /*
    *   Iniciar controller
    */
    
    const statusPeriodCtrl = new StatusPeriodController(statusPeriodUseCase, socketAdapter);
    
    app.get(`/${process.env.BASE_URL_API}/status-periods/:filter?/:page?/:perPage?`, statusPeriodCtrl.getAllCtrl);
    app.get(`/${process.env.BASE_URL_API}/status-period/:sper_uuid`, statusPeriodCtrl.getCtrl);
    app.post(`/${process.env.BASE_URL_API}/status-period`, statusPeriodCtrl.insertCtrl);
    app.put(`/${process.env.BASE_URL_API}/status-period/:sper_uuid`, statusPeriodCtrl.updateCtrl);
    app.delete(`/${process.env.BASE_URL_API}/status-period/:sper_uuid`, statusPeriodCtrl.deleteCtrl);
}

export default configureStatusPeriodRoutes;