import { Request, Response } from "express";
import { PaymentPeriodStatusUseCase } from "../../../application/payment-period-status/payment-period-status-use-case";
import SocketAdapter from "../../services/socketAdapter";
import { paginator } from "../../services/paginator.service";

export class PaymentPeriodStatusController {
    constructor(private paymentPeriodStatusUseCase: PaymentPeriodStatusUseCase, private socketAdapter: SocketAdapter) {
        this.getAllCtrl = this.getAllCtrl.bind(this);
        this.getCtrl = this.getCtrl.bind(this);
        this.insertCtrl = this.insertCtrl.bind(this);
        this.updateCtrl = this.updateCtrl.bind(this);
        this.deleteCtrl = this.deleteCtrl.bind(this);
    }

    public async getAllCtrl(req: Request, res: Response) {
        try {
            const page = (req.params.page ? parseInt(req.params.page) : null);
            const perPage = (req.params.perPage ? parseInt(req.params.perPage) : null);
            if (page && perPage) {
                const paymentPeriodStatuses = await this.paymentPeriodStatusUseCase.getPaymentPeriodStatuses();
                return res.status(200).send({
                    success: true,
                    message: 'Estados de pago de período retornados.',
                    ...paginator(paymentPeriodStatuses, page.toString(), perPage.toString())
                });
            } else {
                const paymentPeriodStatuses = await this.paymentPeriodStatusUseCase.getPaymentPeriodStatuses();
                return res.status(200).send({
                    success: true,
                    message: 'Estados de pago de período retornados.',
                    data: paymentPeriodStatuses
                });
            }
        } catch (error: any) {
            console.error('Error en getAllCtrl (controller):', error.message);
            return res.status(400).json({
                success: false,
                message: 'No se pudo recuperar los estados de pago de período.',
                error: error.message,
            });
        }
    }

    public async getCtrl(req: Request, res: Response) {
        try {
            const payps_uuid = req.params.payps_uuid;
            if(!payps_uuid || payps_uuid.toLowerCase() === 'null' || payps_uuid.toLowerCase() === 'undefined') {
                return res.status(400).json({
                    success: false,
                    message: 'No se pudo recuperar el estado de pago de período.',
                    error: 'Debe proporcionar un Id de estado de pago de período.'
                });
            }
            const paymentPeriodStatus = await this.paymentPeriodStatusUseCase.getDetailPaymentPeriodStatus(`${payps_uuid}`)
            return res.status(200).send({
                success: true,
                message: 'Estado de pago de período retornado.',
                data: paymentPeriodStatus
            });
        } catch (error: any) {
            console.error('Error en getCtrl (controller):', error.message);
            return res.status(400).json({
                success: false,
                message: 'No se pudo recuperar el estado de pago de período.',
                error: error.message,
            });
        }
    }

    public async insertCtrl({ body }: Request, res: Response) {
        try {
            const payps_name = body.payps_name;
            if(!payps_name) {
                return res.status(400).json({
                    success: false,
                    message: 'No se pudo insertar el estado de pago de período.',
                    error: 'Debe proporcionar un Nombre para el estado de pago de período.'
                })
            };
            const paymentPeriodStatusByName = await this.paymentPeriodStatusUseCase.findPaymentPeriodStatusByName(payps_name);
            if(paymentPeriodStatusByName) {
                return res.status(400).json({
                    success: false,
                    message: 'No se pudo insertar el estado de pago de período.',
                    error: `El nombre ${payps_name} de estado de pago de período ya existe.`
                });
            }
            const paymentPeriodStatus = await this.paymentPeriodStatusUseCase.createPaymentPeriodStatus(body)
            return res.status(200).json({
                success: true,
                message: 'Estado de pago de período insertado.',
                data: paymentPeriodStatus
            });
        } catch (error: any) {
            console.error('Error en insertCtrl (controller):', error.message);
            return res.status(400).json({
                success: false,
                message: 'No se pudo insertar el estado de pago de período.',
                error: error.message,
            });
        }
    }

    public async updateCtrl(req: Request, res: Response) {
        try {
            const payps_uuid = req.params.payps_uuid;
            const update = req.body;
            if(!update.payps_name) {
                return res.status(400).json({
                    success: false,
                    message: 'No se pudo actualizar el estado de pago de período.',
                    error: 'Debe proporcionar un Nombre para el estado de pago de período.'
                })
            };
            const paymentPeriodStatusByName = await this.paymentPeriodStatusUseCase.findPaymentPeriodStatusByName(update.payps_name, payps_uuid);
            if(paymentPeriodStatusByName) {
                return res.status(400).json({
                    success: false,
                    message: 'No se pudo actualizar el estado de pago de período.',
                    error: `El nombre ${update.payps_name} de estado de pago de período ya existe.`
                });
            }
            const paymentPeriodStatus = await this.paymentPeriodStatusUseCase.updatePaymentPeriodStatus(payps_uuid, update)
            return res.status(200).json({
                success: true,
                message: 'Estado de pago de período actualizado.',
                data: paymentPeriodStatus
            });
        } catch (error: any) {
            console.error('Error en updateCtrl (controller):', error.message);
            return res.status(400).json({
                success: false,
                message: 'No se pudo actualizar el estado de pago de período.',
                error: error.message,
            });
        }
    }

    public async deleteCtrl(req: Request, res: Response) {
        try {
            const payps_uuid = req.params.payps_uuid;
            if(!payps_uuid) {
                return res.status(400).json({
                    success: false,
                    message: 'No se pudo eliminar el estado de pago de período.',
                    error: 'Debe proporcionar un Id de estado de pago de período.'
                });
            };
            const paymentPeriodStatus = await this.paymentPeriodStatusUseCase.deletePaymentPeriodStatus(payps_uuid)
            return res.status(200).json({
                success: true,
                message: 'Estado de pago de período eliminado.',
                data: paymentPeriodStatus
            });
        } catch (error: any) {
            console.error('Error en deleteCtrl (controller):', error.message);
            return res.status(400).json({
                success: false,
                message: 'No se pudo eliminar el estado de pago de período.',
                error: error.message,
            });
        }
    }
}