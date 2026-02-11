import { Request, Response } from "express";
import { PaymentPeriodUseCase } from "../../../application/payment-period/payment-period-use-case";
import SocketAdapter from "../../services/socketAdapter";
import { paginator } from "../../services/paginator.service";

export class PaymentPeriodController {
    constructor(private paymentPeriodUseCase: PaymentPeriodUseCase, private socketAdapter: SocketAdapter) {
        this.getAllCtrl = this.getAllCtrl.bind(this);
        this.getCtrl = this.getCtrl.bind(this);
        this.insertCtrl = this.insertCtrl.bind(this);
        this.updateCtrl = this.updateCtrl.bind(this);
        this.deleteCtrl = this.deleteCtrl.bind(this);
    }

    public async getAllCtrl(req: Request, res: Response) {
        try {
            const usr_uuid = req.params.usr_uuid;
            const crd_uuid = req.params.crd_uuid;
            const per_uuid = req.params.per_uuid;
            const page = (req.params.page ? parseInt(req.params.page) : null);
            const perPage = (req.params.perPage ? parseInt(req.params.perPage) : null);
            if (page && perPage) {
                const paymentsPeriod = await this.paymentPeriodUseCase.getPaymentsPeriod(usr_uuid, crd_uuid, per_uuid);
                return res.status(200).send({
                    success: true,
                    message: 'Pagos de período retornados.',
                    ...paginator(paymentsPeriod, page.toString(), perPage.toString())
                });
            } else {
                const paymentsPeriod = await this.paymentPeriodUseCase.getPaymentsPeriod(usr_uuid, crd_uuid, per_uuid);
                return res.status(200).send({
                    success: true,
                    message: 'Pagos de período retornados.',
                    data: paymentsPeriod
                });
            }
        } catch (error: any) {
            console.error('Error en getAllCtrl (controller):', error.message);
            return res.status(400).json({
                success: false,
                message: 'No se pudo recuperar los pagos de período.',
                error: error.message,
            });
        }
    }

    public async getCtrl(req: Request, res: Response) {
        try {
            const usr_uuid = req.params.usr_uuid;
            const crd_uuid = req.params.crd_uuid;
            const per_uuid = req.params.per_uuid;
            const payp_uuid = req.params.payp_uuid;
            if(!usr_uuid || usr_uuid.toLowerCase() === 'null' || usr_uuid.toLowerCase() === 'undefined') {
                return res.status(400).json({
                    success: false,
                    message: 'No se pudo recuperar el pago de período.',
                    error: 'Debe proporcionar un Id de usuario.'
                });
            }
            if(!crd_uuid || crd_uuid.toLowerCase() === 'null' || crd_uuid.toLowerCase() === 'undefined') {
                return res.status(400).json({
                    success: false,
                    message: 'No se pudo recuperar el pago de período.',
                    error: 'Debe proporcionar un Id de tarjeta.'
                });
            }
            if(!per_uuid || per_uuid.toLowerCase() === 'null' || per_uuid.toLowerCase() === 'undefined') {
                return res.status(400).json({
                    success: false,
                    message: 'No se pudo recuperar el pago de período.',
                    error: 'Debe proporcionar un Id de período.'
                });
            }
            if(!payp_uuid || payp_uuid.toLowerCase() === 'null' || payp_uuid.toLowerCase() === 'undefined') {
                return res.status(400).json({
                    success: false,
                    message: 'No se pudo recuperar el pago de período.',
                    error: 'Debe proporcionar un Id de pago de período.'
                });
            }
            const paymentPeriod = await this.paymentPeriodUseCase.getDetailPaymentPeriod(`${usr_uuid}`, `${crd_uuid}`, `${per_uuid}`, `${payp_uuid}`)
            return res.status(200).send({
                success: true,
                message: 'Pago de período retornado.',
                data: paymentPeriod
            });
        } catch (error: any) {
            console.error('Error en getCtrl (controller):', error.message);
            return res.status(400).json({
                success: false,
                message: 'No se pudo recuperar el pago de período.',
                error: error.message,
            });
        }
    }

    public async insertCtrl({ body }: Request, res: Response) {
        try {
            const usr_uuid = body.usr_uuid;
            const crd_uuid = body.crd_uuid;
            const per_uuid = body.per_uuid;
            const payp_amountpaid = body.payp_amountpaid;
            if(!usr_uuid) {
                return res.status(400).json({
                    success: false,
                    message: 'No se pudo insertar el pago de período.',
                    error: 'Debe proporcionar un Id de usuario.'
                })
            };
            if(!crd_uuid) {
                return res.status(400).json({
                    success: false,
                    message: 'No se pudo insertar el pago de período.',
                    error: 'Debe proporcionar un Id de tarjeta.'
                })
            };
            if(!per_uuid) {
                return res.status(400).json({
                    success: false,
                    message: 'No se pudo insertar el pago de período.',
                    error: 'Debe proporcionar un Id de período.'
                })
            };
            if(!payp_amountpaid) {
                return res.status(400).json({
                    success: false,
                    message: 'No se pudo insertar el pago de período.',
                    error: 'Debe proporcionar un Monto pagado.'
                })
            };
            const paymentPeriod = await this.paymentPeriodUseCase.createPaymentPeriod(body)
            return res.status(200).json({
                success: true,
                message: 'Pago de período insertado.',
                data: paymentPeriod
            });
        } catch (error: any) {
            console.error('Error en insertCtrl (controller):', error.message);
            return res.status(400).json({
                success: false,
                message: 'No se pudo insertar el pago de período.',
                error: error.message,
            });
        }
    }

    public async updateCtrl(req: Request, res: Response) {
        try {
            const usr_uuid = req.params.usr_uuid;
            const crd_uuid = req.params.crd_uuid;
            const per_uuid = req.params.per_uuid;
            const payp_uuid = req.params.payp_uuid;
            const update = req.body;
            const paymentPeriod = await this.paymentPeriodUseCase.updatePaymentPeriod(usr_uuid, crd_uuid, per_uuid, payp_uuid, update)
            return res.status(200).json({
                success: true,
                message: 'Pago de período actualizado.',
                data: paymentPeriod
            });
        } catch (error: any) {
            console.error('Error en updateCtrl (controller):', error.message);
            return res.status(400).json({
                success: false,
                message: 'No se pudo actualizar el pago de período.',
                error: error.message,
            });
        }
    }

    public async deleteCtrl(req: Request, res: Response) {
        try {
            const usr_uuid = req.params.usr_uuid;
            const crd_uuid = req.params.crd_uuid;
            const per_uuid = req.params.per_uuid;
            const payp_uuid = req.params.payp_uuid;
            if(!payp_uuid) {
                return res.status(400).json({
                    success: false,
                    message: 'No se pudo eliminar el pago de período.',
                    error: 'Debe proporcionar un Id de pago de período.'
                });
            };
            const paymentPeriod = await this.paymentPeriodUseCase.deletePaymentPeriod(usr_uuid, crd_uuid, per_uuid, payp_uuid)
            return res.status(200).json({
                success: true,
                message: 'Pago de período eliminado.',
                data: paymentPeriod
            });
        } catch (error: any) {
            console.error('Error en deleteCtrl (controller):', error.message);
            return res.status(400).json({
                success: false,
                message: 'No se pudo eliminar el pago de período.',
                error: error.message,
            });
        }
    }
}