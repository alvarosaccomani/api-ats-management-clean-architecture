import { Express } from "express";
import { SequelizeVoucherFeeRepository } from "../../repository/voucher-fee/sequelize-voucher-fee.repository";
import { VoucherFeeUseCase } from "../../../application/voucher-fee/voucher-fee-use-case";
import { VoucherFeeController } from "../../controller/voucher-fee/voucher-fee.controller";
import SocketAdapter from "../../services/socketAdapter";

function configureVoucherFeeRoutes(app: Express, socketAdapter: SocketAdapter) {
    /*
    *   Iniciar repository
    */
    
    const sequelizeVoucherFeeRepository = new SequelizeVoucherFeeRepository();
    
    /*
    *   Iniciar casos de uso
    */
    
    const voucherFeeUseCase = new VoucherFeeUseCase(sequelizeVoucherFeeRepository);
    
    /*
    *   Iniciar controller
    */
    
    const voucherFeeCtrl = new VoucherFeeController(voucherFeeUseCase, socketAdapter);
    
    app.get(`/${process.env.BASE_URL_API}/voucher-fees/:usr_uuid/:crd_uuid/:per_uuid/:vou_uuid/:filter?/:page?/:perPage?`, voucherFeeCtrl.getAllCtrl);
    app.get(`/${process.env.BASE_URL_API}/voucher-fee/:usr_uuid/:crd_uuid/:per_uuid/:vou_uuid/:vouf_uuid`, voucherFeeCtrl.getCtrl);
    app.post(`/${process.env.BASE_URL_API}/voucher-fee`, voucherFeeCtrl.insertCtrl);
    app.put(`/${process.env.BASE_URL_API}/voucher-fee/:usr_uuid/:crd_uuid/:per_uuid/:vou_uuid/:vouf_uuid`, voucherFeeCtrl.updateCtrl);
    app.delete(`/${process.env.BASE_URL_API}/voucher-fee/:usr_uuid/:crd_uuid/:per_uuid/:vou_uuid/:vouf_uuid`, voucherFeeCtrl.deleteCtrl);
}

export default configureVoucherFeeRoutes;