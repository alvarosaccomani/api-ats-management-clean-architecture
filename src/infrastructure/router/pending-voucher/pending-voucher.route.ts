import { Express } from "express";
import { SequelizePendingVoucherRepository } from "../../repository/pending-voucher/sequelize-pending-voucher.repository";
import { PendingVoucherUseCase } from "../../../application/pending-voucher/pending-voucher-use-case";
import { PendingVoucherController } from "../../controller/pending-voucher/pending-voucher.controller";
import SocketAdapter from "../../services/socketAdapter";

function configurePendingVoucherRoutes(app: Express, socketAdapter: SocketAdapter) {
    /*
    *   Iniciar repository
    */
    
    const sequelizePendingVoucherRepository = new SequelizePendingVoucherRepository();
    
    /*
    *   Iniciar casos de uso
    */
    
    const pendingVoucherUseCase = new PendingVoucherUseCase(sequelizePendingVoucherRepository);
    
    /*
    *   Iniciar controller
    */
    
    const pendingVoucherCtrl = new PendingVoucherController(pendingVoucherUseCase, socketAdapter);
    
    app.get(`/${process.env.BASE_URL_API}/pending-vouchers/:usr_uuid/:filter?/:page?/:perPage?`, pendingVoucherCtrl.getAllCtrl);
    app.get(`/${process.env.BASE_URL_API}/pending-voucher/:usr_uuid/:pevou_uuid`, pendingVoucherCtrl.getCtrl);
    app.post(`/${process.env.BASE_URL_API}/pending-voucher`, pendingVoucherCtrl.insertCtrl);
    app.put(`/${process.env.BASE_URL_API}/pending-voucher/:usr_uuid/:pevou_uuid`, pendingVoucherCtrl.updateCtrl);
    app.delete(`/${process.env.BASE_URL_API}/pending-voucher/:usr_uuid/:pevou_uuid`, pendingVoucherCtrl.deleteCtrl);
}

export default configurePendingVoucherRoutes;
