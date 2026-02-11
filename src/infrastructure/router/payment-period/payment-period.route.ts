import { Express } from "express";
import { SequelizePaymentPeriodRepository } from "../../repository/payment-period/sequelize-payment-period.repository";
import { PaymentPeriodUseCase } from "../../../application/payment-period/payment-period-use-case";
import { PaymentPeriodController } from "../../controller/payment-period/payment-period.controller";
import SocketAdapter from "../../services/socketAdapter";

function configurePaymentPeriodRoutes(app: Express, socketAdapter: SocketAdapter) {
    /*
    *   Iniciar repository
    */
    
    const sequelizePaymentPeriodRepository = new SequelizePaymentPeriodRepository();
    
    /*
    *   Iniciar casos de uso
    */
    
    const paymentPeriodUseCase = new PaymentPeriodUseCase(sequelizePaymentPeriodRepository);
    
    /*
    *   Iniciar controller
    */
    
    const paymentPeriodCtrl = new PaymentPeriodController(paymentPeriodUseCase, socketAdapter);
    
    app.get(`/${process.env.BASE_URL_API}/payment-periods/:usr_uuid/:crd_uuid/:per_uuid/:filter?/:page?/:perPage?`, paymentPeriodCtrl.getAllCtrl);
    app.get(`/${process.env.BASE_URL_API}/payment-period/:usr_uuid/:crd_uuid/:per_uuid/:payp_uuid`, paymentPeriodCtrl.getCtrl);
    app.post(`/${process.env.BASE_URL_API}/payment-period`, paymentPeriodCtrl.insertCtrl);
    app.put(`/${process.env.BASE_URL_API}/payment-period/:usr_uuid/:crd_uuid/:per_uuid/:payp_uuid`, paymentPeriodCtrl.updateCtrl);
    app.delete(`/${process.env.BASE_URL_API}/payment-period/:usr_uuid/:crd_uuid/:per_uuid/:payp_uuid`, paymentPeriodCtrl.deleteCtrl);
}

export default configurePaymentPeriodRoutes;