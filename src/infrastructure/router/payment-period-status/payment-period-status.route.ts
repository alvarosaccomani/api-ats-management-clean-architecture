import { Express } from "express";
import { SequelizePaymentPeriodStatusRepository } from "../../repository/payment-period-status/sequelize-payment-period-status.repository";
import { PaymentPeriodStatusUseCase } from "../../../application/payment-period-status/payment-period-status-use-case";
import { PaymentPeriodStatusController } from "../../controller/payment-period-status/payment-period-status.controller";
import SocketAdapter from "../../services/socketAdapter";

function configurePaymentPeriodStatusRoutes(app: Express, socketAdapter: SocketAdapter) {
    /*
    *   Iniciar repository
    */
    
    const sequelizePaymentPeriodStatusRepository = new SequelizePaymentPeriodStatusRepository();
    
    /*
    *   Iniciar casos de uso
    */
    
    const paymentPeriodStatusUseCase = new PaymentPeriodStatusUseCase(sequelizePaymentPeriodStatusRepository);
    
    /*
    *   Iniciar controller
    */
    
    const paymentPeriodStatusCtrl = new PaymentPeriodStatusController(paymentPeriodStatusUseCase, socketAdapter);
    
    app.get(`/${process.env.BASE_URL_API}/payment-period-statuses/:filter?/:page?/:perPage?`, paymentPeriodStatusCtrl.getAllCtrl);
    app.get(`/${process.env.BASE_URL_API}/payment-period-status/:payps_uuid`, paymentPeriodStatusCtrl.getCtrl);
    app.post(`/${process.env.BASE_URL_API}/payment-period-status`, paymentPeriodStatusCtrl.insertCtrl);
    app.put(`/${process.env.BASE_URL_API}/payment-period-status/:payps_uuid`, paymentPeriodStatusCtrl.updateCtrl);
    app.delete(`/${process.env.BASE_URL_API}/payment-period-status/:payps_uuid`, paymentPeriodStatusCtrl.deleteCtrl);
}

export default configurePaymentPeriodStatusRoutes;