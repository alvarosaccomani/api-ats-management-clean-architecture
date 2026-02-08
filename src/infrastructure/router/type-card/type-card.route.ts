import { Express } from "express";
import { SequelizeTypeCardRepository } from "../../repository/type-card/sequelize-type-card.repository";
import { TypeCardUseCase } from "../../../application/type-card/type-card-use-case";
import { TypeCardController } from "../../controller/type-card/type-card.controller";
import SocketAdapter from "../../services/socketAdapter";

function configureTypeCardRoutes(app: Express, socketAdapter: SocketAdapter) {
    /*
    *   Iniciar repository
    */
    
    const sequelizeTypeCardRepository = new SequelizeTypeCardRepository();
    
    /*
    *   Iniciar casos de uso
    */
    
    const typeCardUseCase = new TypeCardUseCase(sequelizeTypeCardRepository);
    
    /*
    *   Iniciar controller
    */
    
    const typeCardCtrl = new TypeCardController(typeCardUseCase, socketAdapter);
    
    app.get(`/${process.env.BASE_URL_API}/type-cards/:filter?/:page?/:perPage?`, typeCardCtrl.getAllCtrl);
    app.get(`/${process.env.BASE_URL_API}/type-card/:tycrd_uuid`, typeCardCtrl.getCtrl);
    app.post(`/${process.env.BASE_URL_API}/type-card`, typeCardCtrl.insertCtrl);
    app.put(`/${process.env.BASE_URL_API}/type-card/:tycrd_uuid`, typeCardCtrl.updateCtrl);
    app.delete(`/${process.env.BASE_URL_API}/type-card/:tycrd_uuid`, typeCardCtrl.deleteCtrl);
}

export default configureTypeCardRoutes;