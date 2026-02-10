import { Request, Response } from "express";
import { VoucherFeeUseCase } from "../../../application/voucher-fee/voucher-fee-use-case";
import SocketAdapter from "../../services/socketAdapter";
import { paginator } from "../../services/paginator.service";

export class VoucherFeeController {
    constructor(private voucherFeeUseCase: VoucherFeeUseCase, private socketAdapter: SocketAdapter) {
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
            const vou_uuid = req.params.vou_uuid;
            const page = (req.params.page ? parseInt(req.params.page) : null);
            const perPage = (req.params.perPage ? parseInt(req.params.perPage) : null);
            if (page && perPage) {
                const voucherFees = await this.voucherFeeUseCase.getVoucherFees(usr_uuid, crd_uuid, per_uuid, vou_uuid);
                return res.status(200).send({
                    success: true,
                    message: 'Cuotas de comprobante retornadas.',
                    ...paginator(voucherFees, page.toString(), perPage.toString())
                });
            } else {
                const voucherFees = await this.voucherFeeUseCase.getVoucherFees(usr_uuid, crd_uuid, per_uuid, vou_uuid);
                return res.status(200).send({
                    success: true,
                    message: 'Cuotas de comprobante retornadas.',
                    data: voucherFees
                });
            }
        } catch (error: any) {
            console.error('Error en getAllCtrl (controller):', error.message);
            return res.status(400).json({
                success: false,
                message: 'No se pudo recuperar las cuotas de comprobante.',
                error: error.message,
            });
        }
    }

    public async getCtrl(req: Request, res: Response) {
        try {
            const usr_uuid = req.params.usr_uuid;
            const crd_uuid = req.params.crd_uuid;
            const per_uuid = req.params.per_uuid;
            const vou_uuid = req.params.vou_uuid;
            const vouf_uuid = req.params.vouf_uuid;
            if(!usr_uuid || usr_uuid.toLowerCase() === 'null' || usr_uuid.toLowerCase() === 'undefined') {
                return res.status(400).json({
                    success: false,
                    message: 'No se pudo recuperar la cuota de comprobante.',
                    error: 'Debe proporcionar un Id de usuario.'
                });
            }
            if(!crd_uuid || crd_uuid.toLowerCase() === 'null' || crd_uuid.toLowerCase() === 'undefined') {
                return res.status(400).json({
                    success: false,
                    message: 'No se pudo recuperar la cuota de comprobante.',
                    error: 'Debe proporcionar un Id de tarjeta.'
                });
            }
            if(!per_uuid || per_uuid.toLowerCase() === 'null' || per_uuid.toLowerCase() === 'undefined') {
                return res.status(400).json({
                    success: false,
                    message: 'No se pudo recuperar la cuota de comprobante.',
                    error: 'Debe proporcionar un Id de período.'
                });
            }
            if(!vou_uuid || vou_uuid.toLowerCase() === 'null' || vou_uuid.toLowerCase() === 'undefined') {
                return res.status(400).json({
                    success: false,
                    message: 'No se pudo recuperar la cuota de comprobante.',
                    error: 'Debe proporcionar un Id de comprobante.'
                });
            }
            if(!vouf_uuid || vouf_uuid.toLowerCase() === 'null' || vouf_uuid.toLowerCase() === 'undefined') {
                return res.status(400).json({
                    success: false,
                    message: 'No se pudo recuperar la cuota de comprobante.',
                    error: 'Debe proporcionar un Id de cuota de comprobante.'
                });
            }
            const voucherFee = await this.voucherFeeUseCase.getDetailVoucherFee(`${usr_uuid}`, `${crd_uuid}`, `${per_uuid}`, `${vou_uuid}`, `${vouf_uuid}`)
            return res.status(200).send({
                success: true,
                message: 'Cuota de comprobante retornada.',
                data: voucherFee
            });
        } catch (error: any) {
            console.error('Error en getCtrl (controller):', error.message);
            return res.status(400).json({
                success: false,
                message: 'No se pudo recuperar la cuota de comprobante.',
                error: error.message,
            });
        }
    }

    public async insertCtrl({ body }: Request, res: Response) {
        try {
            const usr_uuid = body.usr_uuid;
            const crd_uuid = body.crd_uuid;
            const per_uuid = body.per_uuid;
            const vou_uuid = body.vou_uuid;
            const vouf_quotanumber = body.vouf_quotanumber;
            if(!usr_uuid) {
                return res.status(400).json({
                    success: false,
                    message: 'No se pudo insertar la cuota de comprobante.',
                    error: 'Debe proporcionar un Id de usuario.'
                })
            };
            if(!crd_uuid) {
                return res.status(400).json({
                    success: false,
                    message: 'No se pudo insertar la cuota de comprobante.',
                    error: 'Debe proporcionar un Id de tarjeta.'
                })
            };
            if(!per_uuid) {
                return res.status(400).json({
                    success: false,
                    message: 'No se pudo insertar la cuota de comprobante.',
                    error: 'Debe proporcionar un Id de período.'
                })
            };
            if(!vou_uuid) {
                return res.status(400).json({
                    success: false,
                    message: 'No se pudo insertar la cuota de comprobante.',
                    error: 'Debe proporcionar un Id de comprobante.'
                })
            };
            if(!vouf_quotanumber) {
                return res.status(400).json({
                    success: false,
                    message: 'No se pudo insertar la cuota de comprobante.',
                    error: 'Debe proporcionar un Número de cuota.'
                })
            };
            const voucherFee = await this.voucherFeeUseCase.createVoucherFee(body)
            return res.status(200).json({
                success: true,
                message: 'Cuota de comprobante insertada.',
                data: voucherFee
            });
        } catch (error: any) {
            console.error('Error en insertCtrl (controller):', error.message);
            return res.status(400).json({
                success: false,
                message: 'No se pudo insertar la cuota de comprobante.',
                error: error.message,
            });
        }
    }

    public async updateCtrl(req: Request, res: Response) {
        try {
            const usr_uuid = req.params.usr_uuid;
            const crd_uuid = req.params.crd_uuid;
            const per_uuid = req.params.per_uuid;
            const vou_uuid = req.params.vou_uuid;
            const vouf_uuid = req.params.vouf_uuid;
            const update = req.body;
            const voucherFee = await this.voucherFeeUseCase.updateVoucherFee(usr_uuid, crd_uuid, per_uuid, vou_uuid, vouf_uuid, update)
            return res.status(200).json({
                success: true,
                message: 'Cuota de comprobante actualizada.',
                data: voucherFee
            });
        } catch (error: any) {
            console.error('Error en updateCtrl (controller):', error.message);
            return res.status(400).json({
                success: false,
                message: 'No se pudo actualizar la cuota de comprobante.',
                error: error.message,
            });
        }
    }

    public async deleteCtrl(req: Request, res: Response) {
        try {
            const usr_uuid = req.params.usr_uuid;
            const crd_uuid = req.params.crd_uuid;
            const per_uuid = req.params.per_uuid;
            const vou_uuid = req.params.vou_uuid;
            const vouf_uuid = req.params.vouf_uuid;
            if(!vouf_uuid) {
                return res.status(400).json({
                    success: false,
                    message: 'No se pudo eliminar la cuota de comprobante.',
                    error: 'Debe proporcionar un Id de cuota de comprobante.'
                });
            };
            const voucherFee = await this.voucherFeeUseCase.deleteVoucherFee(usr_uuid, crd_uuid, per_uuid, vou_uuid, vouf_uuid)
            return res.status(200).json({
                success: true,
                message: 'Cuota de comprobante eliminada.',
                data: voucherFee
            });
        } catch (error: any) {
            console.error('Error en deleteCtrl (controller):', error.message);
            return res.status(400).json({
                success: false,
                message: 'No se pudo eliminar la cuota de comprobante.',
                error: error.message,
            });
        }
    }
}