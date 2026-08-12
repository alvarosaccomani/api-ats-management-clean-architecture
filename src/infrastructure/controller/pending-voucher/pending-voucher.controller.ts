import { Request, Response } from "express";
import { PendingVoucherUseCase } from "../../../application/pending-voucher/pending-voucher-use-case";
import SocketAdapter from "../../services/socketAdapter";
import { paginator } from "../../services/paginator.service";

export class PendingVoucherController {
    constructor(private pendingVoucherUseCase: PendingVoucherUseCase, private socketAdapter: SocketAdapter) {
        this.getAllCtrl = this.getAllCtrl.bind(this);
        this.getCtrl = this.getCtrl.bind(this);
        this.insertCtrl = this.insertCtrl.bind(this);
        this.updateCtrl = this.updateCtrl.bind(this);
        this.deleteCtrl = this.deleteCtrl.bind(this);
    }

    public async getAllCtrl(req: Request, res: Response) {
        try {
            const usr_uuid = req.params.usr_uuid;
            const page = (req.params.page ? parseInt(req.params.page) : null);
            const perPage = (req.params.perPage ? parseInt(req.params.perPage) : null);
            if (page && perPage) {
                const pendingVouchers = await this.pendingVoucherUseCase.getPendingVouchers(usr_uuid);
                return res.status(200).send({
                    success: true,
                    message: 'Comprobantes pendientes retornados.',
                    ...paginator(pendingVouchers, page.toString(), perPage.toString())
                });
            } else {
                const pendingVouchers = await this.pendingVoucherUseCase.getPendingVouchers(usr_uuid);
                return res.status(200).send({
                    success: true,
                    message: 'Comprobantes pendientes retornados.',
                    data: pendingVouchers
                });
            }
        } catch (error: any) {
            console.error('Error en getAllCtrl (controller):', error.message);
            return res.status(400).json({
                success: false,
                message: 'No se pudo recuperar los comprobantes pendientes.',
                error: error.message,
            });
        }
    }

    public async getCtrl(req: Request, res: Response) {
        try {
            const usr_uuid = req.params.usr_uuid;
            const pevou_uuid = req.params.pevou_uuid;
            if(!pevou_uuid || pevou_uuid.toLowerCase() === 'null' || pevou_uuid.toLowerCase() === 'undefined') {
                return res.status(400).json({
                    success: false,
                    message: 'No se pudo recuperar el comprobante pendiente.',
                    error: 'Debe proporcionar un Id de comprobante pendiente.'
                });
            }
            const pendingVoucher = await this.pendingVoucherUseCase.getDetailPendingVoucher(`${usr_uuid}`, `${pevou_uuid}`)
            return res.status(200).send({
                success: true,
                message: 'Comprobante pendiente retornado.',
                data: pendingVoucher
            });
        } catch (error: any) {
            console.error('Error en getCtrl (controller):', error.message);
            return res.status(400).json({
                success: false,
                message: 'No se pudo recuperar el comprobante pendiente.',
                error: error.message,
            });
        }
    }

    public async insertCtrl({ body }: Request, res: Response) {
        try {
            const usr_uuid = body.usr_uuid;
            const pevou_image = body.pevou_image;
            if(!pevou_image) {
                return res.status(400).json({
                    success: false,
                    message: 'No se pudo insertar el comprobante pendiente.',
                    error: 'Debe proporcionar una Imagen para el comprobante pendiente.'
                })
            };
            const pendingVoucherByName = await this.pendingVoucherUseCase.findPendingVoucherByName(usr_uuid, pevou_image);
            if(pendingVoucherByName) {
                return res.status(400).json({
                    success: false,
                    message: 'No se pudo insertar el comprobante pendiente.',
                    error: `El nombre ${pevou_image} de comprobante pendiente ya existe.`
                });
            }
            const pendingVoucher = await this.pendingVoucherUseCase.createPendingVoucher(body)
            return res.status(200).json({
                success: true,
                message: 'Comprobante pendiente insertado.',
                data: pendingVoucher
            });
        } catch (error: any) {
            console.error('Error en insertCtrl (controller):', error.message);
            return res.status(400).json({
                success: false,
                message: 'No se pudo insertar el comprobante pendiente.',
                error: error.message,
            });
        }
    }

    public async updateCtrl(req: Request, res: Response) {
        try {
            const usr_uuid = req.params.usr_uuid;
            const pevou_uuid = req.params.pevou_uuid;
            const update = req.body;
            if(!update.pevou_image) {
                return res.status(400).json({
                    success: false,
                    message: 'No se pudo actualizar el comprobante pendiente.',
                    error: 'Debe proporcionar una Imagen para el comprobante pendiente.'
                })
            };
            const pendingVoucherByName = await this.pendingVoucherUseCase.findPendingVoucherByName(usr_uuid, update.pevou_image);
            if(pendingVoucherByName) {
                return res.status(400).json({
                    success: false,
                    message: 'No se pudo actualizar el comprobante pendiente.',
                    error: `El nombre ${update.pevou_image} de comprobante pendiente ya existe.`
                });
            }
            const pendingVoucher = await this.pendingVoucherUseCase.updatePendingVoucher(usr_uuid, pevou_uuid, update)
            return res.status(200).json({
                success: true,
                message: 'Comprobante pendiente actualizado.',
                data: pendingVoucher
            });
        } catch (error: any) {
            console.error('Error en updateCtrl (controller):', error.message);
            return res.status(400).json({
                success: false,
                message: 'No se pudo actualizar el comprobante pendiente.',
                error: error.message,
            });
        }
    }

    public async deleteCtrl(req: Request, res: Response) {
        try {
            const usr_uuid = req.params.usr_uuid;
            const pevou_uuid = req.params.pevou_uuid;
            if(!pevou_uuid) {
                return res.status(400).json({
                    success: false,
                    message: 'No se pudo eliminar el comprobante pendiente.',
                    error: 'Debe proporcionar un Id de comprobante pendiente.'
                });
            };
            const pendingVoucher = await this.pendingVoucherUseCase.deletePendingVoucher(usr_uuid, pevou_uuid)
            return res.status(200).json({
                success: true,
                message: 'Comprobante pendiente eliminado.',
                data: pendingVoucher
            });
        } catch (error: any) {
            console.error('Error en deleteCtrl (controller):', error.message);
            return res.status(400).json({
                success: false,
                message: 'No se pudo eliminar el comprobante pendiente.',
                error: error.message,
            });
        }
    }
}