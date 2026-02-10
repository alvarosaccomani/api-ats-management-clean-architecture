import { Express } from "express";
import { SequelizeVoucherFeeStatusRepository } from "../../repository/voucher-fee-status/sequelize-voucher-fee-status.repository";
import { VoucherFeeStatusUseCase } from "../../../application/voucher-fee-status/voucher-fee-status-use-case";
import { VoucherFeeStatusController } from "../../controller/voucher-fee-status/voucher-fee-status.controller";
import SocketAdapter from "../../services/socketAdapter";

function configureVoucherFeeStatusRoutes(app: Express, socketAdapter: SocketAdapter) {
    /*
    *   Iniciar repository
    */
    
    const sequelizeVoucherFeeStatusRepository = new SequelizeVoucherFeeStatusRepository();
    
    /*
    *   Iniciar casos de uso
    */
    
    const voucherFeeStatusUseCase = new VoucherFeeStatusUseCase(sequelizeVoucherFeeStatusRepository);
    
    /*
    *   Iniciar controller
    */
    
    const voucherFeeStatusCtrl = new VoucherFeeStatusController(voucherFeeStatusUseCase, socketAdapter);
    
    app.get(`/${process.env.BASE_URL_API}/voucher-fee-statuses/:filter?/:page?/:perPage?`, voucherFeeStatusCtrl.getAllCtrl);
    app.get(`/${process.env.BASE_URL_API}/voucher-fee-status/:voufs_uuid`, voucherFeeStatusCtrl.getCtrl);
    app.post(`/${process.env.BASE_URL_API}/voucher-fee-status`, voucherFeeStatusCtrl.insertCtrl);
    app.put(`/${process.env.BASE_URL_API}/voucher-fee-status/:voufs_uuid`, voucherFeeStatusCtrl.updateCtrl);
    app.delete(`/${process.env.BASE_URL_API}/voucher-fee-status/:voufs_uuid`, voucherFeeStatusCtrl.deleteCtrl);
}

export default configureVoucherFeeStatusRoutes;