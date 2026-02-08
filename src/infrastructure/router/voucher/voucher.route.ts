import { Express } from "express";
import { SequelizeVoucherRepository } from "../../repository/voucher/sequelize-voucher.repository";
import { VoucherUseCase } from "../../../application/voucher/voucher-use-case";
import { VoucherController } from "../../controller/voucher/voucher.controller";
import SocketAdapter from "../../services/socketAdapter";

function configureVoucherRoutes(app: Express, socketAdapter: SocketAdapter) {
    /*
    *   Iniciar repository
    */
    
    const sequelizeVoucherRepository = new SequelizeVoucherRepository();
    
    /*
    *   Iniciar casos de uso
    */
    
    const voucherUseCase = new VoucherUseCase(sequelizeVoucherRepository);
    
    /*
    *   Iniciar controller
    */
    
    const voucherCtrl = new VoucherController(voucherUseCase, socketAdapter);
    
    app.get(`/${process.env.BASE_URL_API}/vouchers/:usr_uuid/:crd_uuid/:per_uuid/:filter?/:page?/:perPage?`, voucherCtrl.getAllCtrl);
    app.get(`/${process.env.BASE_URL_API}/voucher/:usr_uuid/:crd_uuid/:per_uuid/:vou_uuid`, voucherCtrl.getCtrl);
    app.post(`/${process.env.BASE_URL_API}/voucher`, voucherCtrl.insertCtrl);
    app.put(`/${process.env.BASE_URL_API}/voucher/:usr_uuid/:crd_uuid/:per_uuid/:vou_uuid`, voucherCtrl.updateCtrl);
    app.delete(`/${process.env.BASE_URL_API}/voucher/:usr_uuid/:crd_uuid/:per_uuid/:vou_uuid`, voucherCtrl.deleteCtrl);
}

export default configureVoucherRoutes;