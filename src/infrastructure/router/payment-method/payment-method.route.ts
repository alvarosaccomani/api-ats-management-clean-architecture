import { Express } from "express";
import { SequelizePaymentMethodRepository } from "../../repository/payment-method/sequelize-payment-method.repository";
import { PaymentMethodUseCase } from "../../../application/payment-method/payment-method-use-case";
import { PaymentMethodController } from "../../controller/payment-method/payment-method.controller";
import SocketAdapter from "../../services/socketAdapter";

function configurePaymentMethodRoutes(app: Express, socketAdapter: SocketAdapter) {
    /*
    *   Iniciar repository
    */
    
    const sequelizePaymentMethodRepository = new SequelizePaymentMethodRepository();
    
    /*
    *   Iniciar casos de uso
    */
    
    const paymentMethodUseCase = new PaymentMethodUseCase(sequelizePaymentMethodRepository);
    
    /*
    *   Iniciar controller
    */
    
    const paymentMethodCtrl = new PaymentMethodController(paymentMethodUseCase, socketAdapter);
    
    app.get(`/${process.env.BASE_URL_API}/payment-methods/:filter?/:page?/:perPage?`, paymentMethodCtrl.getAllCtrl);
    app.get(`/${process.env.BASE_URL_API}/payment-method/:paym_uuid`, paymentMethodCtrl.getCtrl);
    app.post(`/${process.env.BASE_URL_API}/payment-method`, paymentMethodCtrl.insertCtrl);
    app.put(`/${process.env.BASE_URL_API}/payment-method/:paym_uuid`, paymentMethodCtrl.updateCtrl);
    app.delete(`/${process.env.BASE_URL_API}/payment-method/:paym_uuid`, paymentMethodCtrl.deleteCtrl);
}

export default configurePaymentMethodRoutes;