import { Express } from "express";
import { SequelizeTreeRepository } from "../../repository/tree/sequelize-tree.repository";
import { TreeUseCase } from "../../../application/tree/tree-use-case";
import { TreeController } from "../../controller/tree/tree.controller";
import SocketAdapter from "../../services/socketAdapter";

function configureTreeRoutes(app: Express, socketAdapter: SocketAdapter) {
    /*
    *   Iniciar repository
    */
    
    const sequelizeTreeRepository = new SequelizeTreeRepository();
    
    /*
    *   Iniciar casos de uso
    */
    
    const treeUseCase = new TreeUseCase(sequelizeTreeRepository);
    
    /*
    *   Iniciar controller
    */
    
    const treeCtrl = new TreeController(treeUseCase, socketAdapter);
    
    app.get(`/${process.env.BASE_URL_API}/cards-tree/:usr_uuid`, treeCtrl.getCardsTreeCtrl);
}

export default configureTreeRoutes;
