import { Request, Response } from "express";
import { VoucherFeeStatusUseCase } from "../../../application/voucher-fee-status/voucher-fee-status-use-case";
import SocketAdapter from "../../services/socketAdapter";
import { paginator } from "../../services/paginator.service";

export class VoucherFeeStatusController {
    constructor(private voucherFeeStatusUseCase: VoucherFeeStatusUseCase, private socketAdapter: SocketAdapter) {
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
                const voucherFeeStatuses = await this.voucherFeeStatusUseCase.getVoucherFeeStatuses();
                return res.status(200).send({
                    success: true,
                    message: 'Estados de cuota de comprobante retornados.',
                    ...paginator(voucherFeeStatuses, page.toString(), perPage.toString())
                });
            } else {
                const voucherFeeStatuses = await this.voucherFeeStatusUseCase.getVoucherFeeStatuses();
                return res.status(200).send({
                    success: true,
                    message: 'Estados de cuota de comprobante retornados.',
                    data: voucherFeeStatuses
                });
            }
        } catch (error: any) {
            console.error('Error en getAllCtrl (controller):', error.message);
            return res.status(400).json({
                success: false,
                message: 'No se pudo recuperar los estados de cuota de comprobante.',
                error: error.message,
            });
        }
    }

    public async getCtrl(req: Request, res: Response) {
        try {
            const voufs_uuid = req.params.voufs_uuid;
            if(!voufs_uuid || voufs_uuid.toLowerCase() === 'null' || voufs_uuid.toLowerCase() === 'undefined') {
                return res.status(400).json({
                    success: false,
                    message: 'No se pudo recuperar el estado de cuota de comprobante.',
                    error: 'Debe proporcionar un Id de estado de cuota de comprobante.'
                });
            }
            const voucherFeeStatus = await this.voucherFeeStatusUseCase.getDetailVoucherFeeStatus(`${voufs_uuid}`)
            return res.status(200).send({
                success: true,
                message: 'Estado de cuota de comprobante retornado.',
                data: voucherFeeStatus
            });
        } catch (error: any) {
            console.error('Error en getCtrl (controller):', error.message);
            return res.status(400).json({
                success: false,
                message: 'No se pudo recuperar el estado de cuota de comprobante.',
                error: error.message,
            });
        }
    }

    public async insertCtrl({ body }: Request, res: Response) {
        try {
            const voufs_name = body.voufs_name;
            if(!voufs_name) {
                return res.status(400).json({
                    success: false,
                    message: 'No se pudo insertar el estado de cuota de comprobante.',
                    error: 'Debe proporcionar un Nombre para el estado de cuota de comprobante.'
                })
            };
            const voucherFeeStatusByName = await this.voucherFeeStatusUseCase.findVoucherFeeStatusByName(voufs_name);
            if(voucherFeeStatusByName) {
                return res.status(400).json({
                    success: false,
                    message: 'No se pudo insertar el estado de cuota de comprobante.',
                    error: `El nombre ${voufs_name} de estado de cuota de comprobante ya existe.`
                });
            }
            const voucherFeeStatus = await this.voucherFeeStatusUseCase.createVoucherFeeStatus(body)
            return res.status(200).json({
                success: true,
                message: 'Estado de cuota de comprobante insertado.',
                data: voucherFeeStatus
            });
        } catch (error: any) {
            console.error('Error en insertCtrl (controller):', error.message);
            return res.status(400).json({
                success: false,
                message: 'No se pudo insertar el estado de cuota de comprobante.',
                error: error.message,
            });
        }
    }

    public async updateCtrl(req: Request, res: Response) {
        try {
            const voufs_uuid = req.params.voufs_uuid;
            const update = req.body;
            if(!update.voufs_name) {
                return res.status(400).json({
                    success: false,
                    message: 'No se pudo actualizar el estado de cuota de comprobante.',
                    error: 'Debe proporcionar un Nombre para el estado de cuota de comprobante.'
                })
            };
            const voucherFeeStatusByName = await this.voucherFeeStatusUseCase.findVoucherFeeStatusByName(update.voufs_name, voufs_uuid);
            if(voucherFeeStatusByName) {
                return res.status(400).json({
                    success: false,
                    message: 'No se pudo actualizar el estado de cuota de comprobante.',
                    error: `El nombre ${update.voufs_name} de estado de cuota de comprobante ya existe.`
                });
            }
            const voucherFeeStatus = await this.voucherFeeStatusUseCase.updateVoucherFeeStatus(voufs_uuid, update)
            return res.status(200).json({
                success: true,
                message: 'Estado de cuota de comprobante actualizado.',
                data: voucherFeeStatus
            });
        } catch (error: any) {
            console.error('Error en updateCtrl (controller):', error.message);
            return res.status(400).json({
                success: false,
                message: 'No se pudo actualizar el estado de cuota de comprobante.',
                error: error.message,
            });
        }
    }

    public async deleteCtrl(req: Request, res: Response) {
        try {
            const voufs_uuid = req.params.voufs_uuid;
            if(!voufs_uuid) {
                return res.status(400).json({
                    success: false,
                    message: 'No se pudo eliminar el estado de cuota de comprobante.',
                    error: 'Debe proporcionar un Id de estado de cuota de comprobante.'
                });
            };
            const voucherFeeStatus = await this.voucherFeeStatusUseCase.deleteVoucherFeeStatus(voufs_uuid)
            return res.status(200).json({
                success: true,
                message: 'Estado de cuota de comprobante eliminado.',
                data: voucherFeeStatus
            });
        } catch (error: any) {
            console.error('Error en deleteCtrl (controller):', error.message);
            return res.status(400).json({
                success: false,
                message: 'No se pudo eliminar el estado de cuota de comprobante.',
                error: error.message,
            });
        }
    }
}