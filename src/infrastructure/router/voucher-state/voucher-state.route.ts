import { Express } from "express";
import { SequelizeVoucherStateRepository } from "../../repository/voucher-state/sequelize-voucher-state.repository";
import { VoucherStateUseCase } from "../../../application/voucher-state/voucher-state-use-case";
import { VoucherStateController } from "../../controller/voucher-state/voucher-state.controller";
import SocketAdapter from "../../services/socketAdapter";

function configureVoucherStateRoutes(app: Express, socketAdapter: SocketAdapter) {
    /*
    *   Iniciar repository
    */
    
    const sequelizeVoucherStateRepository = new SequelizeVoucherStateRepository();
    
    /*
    *   Iniciar casos de uso
    */
    
    const voucherStateUseCase = new VoucherStateUseCase(sequelizeVoucherStateRepository);
    
    /*
    *   Iniciar controller
    */
    
    const voucherStateCtrl = new VoucherStateController(voucherStateUseCase, socketAdapter);
    
    app.get(`/${process.env.BASE_URL_API}/voucher-states/:filter?/:page?/:perPage?`, voucherStateCtrl.getAllCtrl);
    app.get(`/${process.env.BASE_URL_API}/voucher-state/:vous_uuid`, voucherStateCtrl.getCtrl);
    app.post(`/${process.env.BASE_URL_API}/voucher-state`, voucherStateCtrl.insertCtrl);
    app.put(`/${process.env.BASE_URL_API}/voucher-state/:vous_uuid`, voucherStateCtrl.updateCtrl);
    app.delete(`/${process.env.BASE_URL_API}/voucher-state/:vous_uuid`, voucherStateCtrl.deleteCtrl);
}

export default configureVoucherStateRoutes;