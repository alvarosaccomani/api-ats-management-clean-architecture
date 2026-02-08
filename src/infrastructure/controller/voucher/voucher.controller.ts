import { Request, Response } from "express";
import { VoucherUseCase } from "../../../application/voucher/voucher-use-case";
import SocketAdapter from "../../services/socketAdapter";
import { paginator } from "../../services/paginator.service";

export class VoucherController {
    constructor(private voucherUseCase: VoucherUseCase, private socketAdapter: SocketAdapter) {
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
                const vouchers = await this.voucherUseCase.getVouchers(usr_uuid, crd_uuid, per_uuid);
                return res.status(200).send({
                    success: true,
                    message: 'Comprobantes retornados.',
                    ...paginator(vouchers, page.toString(), perPage.toString())
                });
            } else {
                const vouchers = await this.voucherUseCase.getVouchers(usr_uuid, crd_uuid, per_uuid);
                return res.status(200).send({
                    success: true,
                    message: 'Comprobantes retornados.',
                    data: vouchers
                });
            }
        } catch (error: any) {
            console.error('Error en getAllCtrl (controller):', error.message);
            return res.status(400).json({
                success: false,
                message: 'No se pudo recuperar los comprobantes.',
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
            if(!usr_uuid || usr_uuid.toLowerCase() === 'null' || usr_uuid.toLowerCase() === 'undefined') {
                return res.status(400).json({
                    success: false,
                    message: 'No se pudo recuperar el comprobante.',
                    error: 'Debe proporcionar un Id de usuario.'
                });
            }
            if(!crd_uuid || crd_uuid.toLowerCase() === 'null' || crd_uuid.toLowerCase() === 'undefined') {
                return res.status(400).json({
                    success: false,
                    message: 'No se pudo recuperar el comprobante.',
                    error: 'Debe proporcionar un Id de tarjeta.'
                });
            }
            if(!per_uuid || per_uuid.toLowerCase() === 'null' || per_uuid.toLowerCase() === 'undefined') {
                return res.status(400).json({
                    success: false,
                    message: 'No se pudo recuperar el comprobante.',
                    error: 'Debe proporcionar un Id de período.'
                });
            }
            if(!vou_uuid || vou_uuid.toLowerCase() === 'null' || vou_uuid.toLowerCase() === 'undefined') {
                return res.status(400).json({
                    success: false,
                    message: 'No se pudo recuperar el comprobante.',
                    error: 'Debe proporcionar un Id de comprobante.'
                });
            }
            const voucher = await this.voucherUseCase.getDetailVoucher(`${usr_uuid}`, `${crd_uuid}`, `${per_uuid}`, `${vou_uuid}`)
            return res.status(200).send({
                success: true,
                message: 'Comprobante retornado.',
                data: voucher
            });
        } catch (error: any) {
            console.error('Error en getCtrl (controller):', error.message);
            return res.status(400).json({
                success: false,
                message: 'No se pudo recuperar el comprobante.',
                error: error.message,
            });
        }
    }

    public async insertCtrl({ body }: Request, res: Response) {
        try {
            const usr_uuid = body.usr_uuid;
            const crd_uuid = body.crd_uuid;
            const per_uuid = body.per_uuid;
            const vou_transactionnumber = body.vou_transactionnumber;
            if(!usr_uuid) {
                return res.status(400).json({
                    success: false,
                    message: 'No se pudo insertar el comprobante.',
                    error: 'Debe proporcionar un Id de usuario.'
                })
            };
            if(!crd_uuid) {
                return res.status(400).json({
                    success: false,
                    message: 'No se pudo insertar el comprobante.',
                    error: 'Debe proporcionar un Id de tarjeta.'
                })
            };
            if(!per_uuid) {
                return res.status(400).json({
                    success: false,
                    message: 'No se pudo insertar el comprobante.',
                    error: 'Debe proporcionar un Id de período.'
                })
            };
            if(!vou_transactionnumber) {
                return res.status(400).json({
                    success: false,
                    message: 'No se pudo insertar el comprobante.',
                    error: 'Debe proporcionar un Número de transacción.'
                })
            };
            const voucherByTransactionNumber = await this.voucherUseCase.findVoucherByTransactionNumber(vou_transactionnumber);
            if(voucherByTransactionNumber) {
                return res.status(400).json({
                    success: false,
                    message: 'No se pudo insertar el comprobante.',
                    error: `El número de transacción ${vou_transactionnumber} ya existe.`
                });
            }
            const voucher = await this.voucherUseCase.createVoucher(body)
            return res.status(200).json({
                success: true,
                message: 'Comprobante insertado.',
                data: voucher
            });
        } catch (error: any) {
            console.error('Error en insertCtrl (controller):', error.message);
            return res.status(400).json({
                success: false,
                message: 'No se pudo insertar el comprobante.',
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
            const update = req.body;
            const vou_transactionnumber = update.vou_transactionnumber;
            if(!vou_transactionnumber) {
                return res.status(400).json({
                    success: false,
                    message: 'No se pudo actualizar el comprobante.',
                    error: 'Debe proporcionar un Número de transacción.'
                })
            };
            const voucherByTransactionNumber = await this.voucherUseCase.findVoucherByTransactionNumber(vou_transactionnumber);
            if(voucherByTransactionNumber) {
                return res.status(400).json({
                    success: false,
                    message: 'No se pudo actualizar el comprobante.',
                    error: `El número de transacción ${vou_transactionnumber} ya existe.`
                });
            }
            const voucher = await this.voucherUseCase.updateVoucher(usr_uuid, crd_uuid, per_uuid, vou_uuid, update)
            return res.status(200).json({
                success: true,
                message: 'Comprobante actualizado.',
                data: voucher
            });
        } catch (error: any) {
            console.error('Error en updateCtrl (controller):', error.message);
            return res.status(400).json({
                success: false,
                message: 'No se pudo actualizar el comprobante.',
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
            if(!vou_uuid) {
                return res.status(400).json({
                    success: false,
                    message: 'No se pudo eliminar el comprobante.',
                    error: 'Debe proporcionar un Id de comprobante.'
                });
            };
            const voucher = await this.voucherUseCase.deleteVoucher(usr_uuid, crd_uuid, per_uuid, vou_uuid)
            return res.status(200).json({
                success: true,
                message: 'Comprobante eliminado.',
                data: voucher
            });
        } catch (error: any) {
            console.error('Error en deleteCtrl (controller):', error.message);
            return res.status(400).json({
                success: false,
                message: 'No se pudo eliminar el comprobante.',
                error: error.message,
            });
        }
    }
}