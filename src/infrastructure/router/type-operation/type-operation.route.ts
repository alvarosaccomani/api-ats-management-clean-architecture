import { Express } from "express";
import { SequelizeTypeOperationRepository } from "../../repository/type-operation/sequelize-type-operation.repository";
import { TypeOperationUseCase } from "../../../application/type-operation/type-operation-use-case";
import { TypeOperationController } from "../../controller/type-operation/type-operation.controller";
import SocketAdapter from "../../services/socketAdapter";

function configureTypeOperationRoutes(app: Express, socketAdapter: SocketAdapter) {
    /*
    *   Iniciar repository
    */
    
    const sequelizeTypeOperationRepository = new SequelizeTypeOperationRepository();
    
    /*
    *   Iniciar casos de uso
    */
    
    const typeOperationUseCase = new TypeOperationUseCase(sequelizeTypeOperationRepository);
    
    /*
    *   Iniciar controller
    */
    
    const typeOperationCtrl = new TypeOperationController(typeOperationUseCase, socketAdapter);
    
    app.get(`/${process.env.BASE_URL_API}/type-operations/:filter?/:page?/:perPage?`, typeOperationCtrl.getAllCtrl);
    app.get(`/${process.env.BASE_URL_API}/type-operation/:tyop_uuid`, typeOperationCtrl.getCtrl);
    app.post(`/${process.env.BASE_URL_API}/type-operation`, typeOperationCtrl.insertCtrl);
    app.put(`/${process.env.BASE_URL_API}/type-operation/:tyop_uuid`, typeOperationCtrl.updateCtrl);
    app.delete(`/${process.env.BASE_URL_API}/type-operation/:tyop_uuid`, typeOperationCtrl.deleteCtrl);
}

export default configureTypeOperationRoutes;