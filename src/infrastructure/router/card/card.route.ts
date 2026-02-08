import { Express } from "express";
import { SequelizeCardRepository } from "../../repository/card/sequelize-card.repository";
import { CardUseCase } from "../../../application/card/card-use-case";
import { CardController } from "../../controller/card/card.controller";
import SocketAdapter from "../../services/socketAdapter";

function configureCardRoutes(app: Express, socketAdapter: SocketAdapter) {
    /*
    *   Iniciar repository
    */
    
    const sequelizeCardRepository = new SequelizeCardRepository();
    
    /*
    *   Iniciar casos de uso
    */
    
    const cardUseCase = new CardUseCase(sequelizeCardRepository);
    
    /*
    *   Iniciar controller
    */
    
    const cardCtrl = new CardController(cardUseCase, socketAdapter);
    
    app.get(`/${process.env.BASE_URL_API}/cards/:usr_uuid/:filter?/:page?/:perPage?`, cardCtrl.getAllCtrl);
    app.get(`/${process.env.BASE_URL_API}/card/:usr_uuid/:crd_uuid`, cardCtrl.getCtrl);
    app.post(`/${process.env.BASE_URL_API}/card`, cardCtrl.insertCtrl);
    app.put(`/${process.env.BASE_URL_API}/card/:usr_uuid/:crd_uuid`, cardCtrl.updateCtrl);
    app.delete(`/${process.env.BASE_URL_API}/card/:usr_uuid/:crd_uuid`, cardCtrl.deleteCtrl);
}

export default configureCardRoutes;