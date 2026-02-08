import { Express } from "express";
import { SequelizeBrandCardRepository } from "../../repository/brand-card/sequelize-brand-card.repository";
import { BrandCardUseCase } from "../../../application/brand-card/brand-card-use-case";
import { BrandCardController } from "../../controller/brand-card/brand-card.controller";
import SocketAdapter from "../../services/socketAdapter";

function configureBrandCardRoutes(app: Express, socketAdapter: SocketAdapter) {
    /*
    *   Iniciar repository
    */
    
    const sequelizeBrandCardRepository = new SequelizeBrandCardRepository();
    
    /*
    *   Iniciar casos de uso
    */
    
    const brandCardUseCase = new BrandCardUseCase(sequelizeBrandCardRepository);
    
    /*
    *   Iniciar controller
    */
    
    const brandCardCtrl = new BrandCardController(brandCardUseCase, socketAdapter);
    
    app.get(`/${process.env.BASE_URL_API}/brand-cards/:filter?/:page?/:perPage?`, brandCardCtrl.getAllCtrl);
    app.get(`/${process.env.BASE_URL_API}/brand-card/:brcrd_uuid`, brandCardCtrl.getCtrl);
    app.post(`/${process.env.BASE_URL_API}/brand-card`, brandCardCtrl.insertCtrl);
    app.put(`/${process.env.BASE_URL_API}/brand-card/:brcrd_uuid`, brandCardCtrl.updateCtrl);
    app.delete(`/${process.env.BASE_URL_API}/brand-card/:brcrd_uuid`, brandCardCtrl.deleteCtrl);
}

export default configureBrandCardRoutes;