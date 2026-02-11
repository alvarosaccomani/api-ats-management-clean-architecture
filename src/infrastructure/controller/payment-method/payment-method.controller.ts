    import { Request, Response } from "express";
import { PaymentMethodUseCase } from "../../../application/payment-method/payment-method-use-case";
import SocketAdapter from "../../services/socketAdapter";
import { paginator } from "../../services/paginator.service";

export class PaymentMethodController {
    constructor(private paymentMethodUseCase: PaymentMethodUseCase, private socketAdapter: SocketAdapter) {
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
                const paymentMethods = await this.paymentMethodUseCase.getPaymentMethods();
                return res.status(200).send({
                    success: true,
                    message: 'Métodos de pago retornados.',
                    ...paginator(paymentMethods, page.toString(), perPage.toString())
                });
            } else {
                const paymentMethods = await this.paymentMethodUseCase.getPaymentMethods();
                return res.status(200).send({
                    success: true,
                    message: 'Métodos de pago retornados.',
                    data: paymentMethods
                });
            }
        } catch (error: any) {
            console.error('Error en getAllCtrl (controller):', error.message);
            return res.status(400).json({
                success: false,
                message: 'No se pudo recuperar los métodos de pago.',
                error: error.message,
            });
        }
    }

    public async getCtrl(req: Request, res: Response) {
        try {
            const paym_uuid = req.params.paym_uuid;
            if(!paym_uuid || paym_uuid.toLowerCase() === 'null' || paym_uuid.toLowerCase() === 'undefined') {
                return res.status(400).json({
                    success: false,
                    message: 'No se pudo recuperar el método de pago.',
                    error: 'Debe proporcionar un Id de método de pago.'
                });
            }
            const paymentMethod = await this.paymentMethodUseCase.getDetailPaymentMethod(`${paym_uuid}`)
            return res.status(200).send({
                success: true,
                message: 'Método de pago retornado.',
                data: paymentMethod
            });
        } catch (error: any) {
            console.error('Error en getCtrl (controller):', error.message);
            return res.status(400).json({
                success: false,
                message: 'No se pudo recuperar el método de pago.',
                error: error.message,
            });
        }
    }

    public async insertCtrl({ body }: Request, res: Response) {
        try {
            const paym_name = body.paym_name;
            if(!paym_name) {
                return res.status(400).json({
                    success: false,
                    message: 'No se pudo insertar el método de pago.',
                    error: 'Debe proporcionar un Nombre para el método de pago.'
                })
            };
            const paymentMethodByName = await this.paymentMethodUseCase.findPaymentMethodByName(paym_name);
            if(paymentMethodByName) {
                return res.status(400).json({
                    success: false,
                    message: 'No se pudo insertar el método de pago.',
                    error: `El nombre ${paym_name} de método de pago ya existe.`
                });
            }
            const paymentMethod = await this.paymentMethodUseCase.createPaymentMethod(body)
            return res.status(200).json({
                success: true,
                message: 'Método de pago insertado.',
                data: paymentMethod
            });
        } catch (error: any) {
            console.error('Error en insertCtrl (controller):', error.message);
            return res.status(400).json({
                success: false,
                message: 'No se pudo insertar el método de pago.',
                error: error.message,
            });
        }
    }

    public async updateCtrl(req: Request, res: Response) {
        try {
            const paym_uuid = req.params.paym_uuid;
            const update = req.body;
            if(!update.paym_name) {
                return res.status(400).json({
                    success: false,
                    message: 'No se pudo actualizar el método de pago.',
                    error: 'Debe proporcionar un Nombre para el método de pago.'
                })
            };
            const paymentMethodByName = await this.paymentMethodUseCase.findPaymentMethodByName(update.paym_name, paym_uuid);
            if(paymentMethodByName) {
                return res.status(400).json({
                    success: false,
                    message: 'No se pudo actualizar el método de pago.',
                    error: `El nombre ${update.paym_name} de método de pago ya existe.`
                });
            }
            const paymentMethod = await this.paymentMethodUseCase.updatePaymentMethod(paym_uuid, update)
            return res.status(200).json({
                success: true,
                message: 'Método de pago actualizado.',
                data: paymentMethod
            });
        } catch (error: any) {
            console.error('Error en updateCtrl (controller):', error.message);
            return res.status(400).json({
                success: false,
                message: 'No se pudo actualizar el método de pago.',
                error: error.message,
            });
        }
    }

    public async deleteCtrl(req: Request, res: Response) {
        try {
            const paym_uuid = req.params.paym_uuid;
            if(!paym_uuid) {
                return res.status(400).json({
                    success: false,
                    message: 'No se pudo eliminar el método de pago.',
                    error: 'Debe proporcionar un Id de método de pago.'
                });
            };
            const paymentMethod = await this.paymentMethodUseCase.deletePaymentMethod(paym_uuid)
            return res.status(200).json({
                success: true,
                message: 'Método de pago eliminado.',
                data: paymentMethod
            });
        } catch (error: any) {
            console.error('Error en deleteCtrl (controller):', error.message);
            return res.status(400).json({
                success: false,
                message: 'No se pudo eliminar el método de pago.',
                error: error.message,
            });
        }
    }
}