import { Express } from "express";
import { SequelizeBankRepository } from "../../repository/bank/sequelize-bank.repository";
import { BankUseCase } from "../../../application/bank/bank-use-case";
import { BankController } from "../../controller/bank/bank.controller";
import SocketAdapter from "../../services/socketAdapter";

function configureBankRoutes(app: Express, socketAdapter: SocketAdapter) {
    /*
    *   Iniciar repository
    */
    
    const sequelizeBankRepository = new SequelizeBankRepository();
    
    /*
    *   Iniciar casos de uso
    */
    
    const bankUseCase = new BankUseCase(sequelizeBankRepository);
    
    /*
    *   Iniciar controller
    */
    
    const bankCtrl = new BankController(bankUseCase, socketAdapter);
    
    app.get(`/${process.env.BASE_URL_API}/banks/:usr_uuid/:filter?/:page?/:perPage?`, bankCtrl.getAllCtrl);
    app.get(`/${process.env.BASE_URL_API}/bank/:usr_uuid/:ban_uuid`, bankCtrl.getCtrl);
    app.post(`/${process.env.BASE_URL_API}/bank`, bankCtrl.insertCtrl);
    app.put(`/${process.env.BASE_URL_API}/bank/:usr_uuid/:ban_uuid`, bankCtrl.updateCtrl);
    app.delete(`/${process.env.BASE_URL_API}/bank/:usr_uuid/:ban_uuid`, bankCtrl.deleteCtrl);
}

export default configureBankRoutes;