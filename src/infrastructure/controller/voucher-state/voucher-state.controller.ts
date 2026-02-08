import { Request, Response } from "express";
import { VoucherStateUseCase } from "../../../application/voucher-state/voucher-state-use-case";
import SocketAdapter from "../../services/socketAdapter";
import { paginator } from "../../services/paginator.service";

export class VoucherStateController {
    constructor(private voucherStateUseCase: VoucherStateUseCase, private socketAdapter: SocketAdapter) {
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
                const voucherStates = await this.voucherStateUseCase.getVoucherStates();
                return res.status(200).send({
                    success: true,
                    message: 'Estados de comprobante retornados.',
                    ...paginator(voucherStates, page.toString(), perPage.toString())
                });
            } else {
                const voucherStates = await this.voucherStateUseCase.getVoucherStates();
                return res.status(200).send({
                    success: true,
                    message: 'Estados de comprobante retornados.',
                    data: voucherStates
                });
            }
        } catch (error: any) {
            console.error('Error en getAllCtrl (controller):', error.message);
            return res.status(400).json({
                success: false,
                message: 'No se pudo recuperar los estados de comprobante.',
                error: error.message,
            });
        }
    }

    public async getCtrl(req: Request, res: Response) {
        try {
            const vous_uuid = req.params.vous_uuid;
            if(!vous_uuid || vous_uuid.toLowerCase() === 'null' || vous_uuid.toLowerCase() === 'undefined') {
                return res.status(400).json({
                    success: false,
                    message: 'No se pudo recuperar el estado de comprobante.',
                    error: 'Debe proporcionar un Id de estado de comprobante.'
                });
            }
            const voucherState = await this.voucherStateUseCase.getDetailVoucherState(`${vous_uuid}`)
            return res.status(200).send({
                success: true,
                message: 'Estado de comprobante retornado.',
                data: voucherState
            });
        } catch (error: any) {
            console.error('Error en getCtrl (controller):', error.message);
            return res.status(400).json({
                success: false,
                message: 'No se pudo recuperar el estado de comprobante.',
                error: error.message,
            });
        }
    }

    public async insertCtrl({ body }: Request, res: Response) {
        try {
            const vous_name = body.vous_name;
            if(!vous_name) {
                return res.status(400).json({
                    success: false,
                    message: 'No se pudo insertar el estado de comprobante.',
                    error: 'Debe proporcionar un Nombre para el estado de comprobante.'
                })
            };
            const voucherStateByName = await this.voucherStateUseCase.findVoucherStateByName(vous_name);
            if(voucherStateByName) {
                return res.status(400).json({
                    success: false,
                    message: 'No se pudo insertar el estado de comprobante.',
                    error: `El nombre ${vous_name} de estado de comprobante ya existe.`
                });
            }
            const voucherState = await this.voucherStateUseCase.createVoucherState(body)
            return res.status(200).json({
                success: true,
                message: 'Estado de comprobante insertado.',
                data: voucherState
            });
        } catch (error: any) {
            console.error('Error en insertCtrl (controller):', error.message);
            return res.status(400).json({
                success: false,
                message: 'No se pudo insertar el estado de comprobante.',
                error: error.message,
            });
        }
    }

    public async updateCtrl(req: Request, res: Response) {
        try {
            const vous_uuid = req.params.vous_uuid;
            const update = req.body;
            if(!update.vous_name) {
                return res.status(400).json({
                    success: false,
                    message: 'No se pudo actualizar el estado de comprobante.',
                    error: 'Debe proporcionar un Nombre para el estado de comprobante.'
                })
            };
            const voucherStateByName = await this.voucherStateUseCase.findVoucherStateByName(update.vous_name, vous_uuid);
            if(voucherStateByName) {
                return res.status(400).json({
                    success: false,
                    message: 'No se pudo actualizar el estado de comprobante.',
                    error: `El nombre ${update.vous_name} de estado de comprobante ya existe.`
                });
            }
            const voucherState = await this.voucherStateUseCase.updateVoucherState(vous_uuid, update)
            return res.status(200).json({
                success: true,
                message: 'Estado de comprobante actualizado.',
                data: voucherState
            });
        } catch (error: any) {
            console.error('Error en updateCtrl (controller):', error.message);
            return res.status(400).json({
                success: false,
                message: 'No se pudo actualizar el estado de comprobante.',
                error: error.message,
            });
        }
    }

    public async deleteCtrl(req: Request, res: Response) {
        try {
            const vous_uuid = req.params.vous_uuid;
            if(!vous_uuid) {
                return res.status(400).json({
                    success: false,
                    message: 'No se pudo eliminar el estado de comprobante.',
                    error: 'Debe proporcionar un Id de estado de comprobante.'
                });
            };
            const voucherState = await this.voucherStateUseCase.deleteVoucherState(vous_uuid)
            return res.status(200).json({
                success: true,
                message: 'Estado de comprobante eliminado.',
                data: voucherState
            });
        } catch (error: any) {
            console.error('Error en deleteCtrl (controller):', error.message);
            return res.status(400).json({
                success: false,
                message: 'No se pudo eliminar el estado de comprobante.',
                error: error.message,
            });
        }
    }
}