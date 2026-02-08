import { Request, Response } from "express";
import { PeriodUseCase } from "../../../application/period/period-use-case";
import SocketAdapter from "../../services/socketAdapter";
import { paginator } from "../../services/paginator.service";

export class PeriodController {
    constructor(private periodUseCase: PeriodUseCase, private socketAdapter: SocketAdapter) {
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
            const page = (req.params.page ? parseInt(req.params.page) : null);
            const perPage = (req.params.perPage ? parseInt(req.params.perPage) : null);
            if (page && perPage) {
                const periods = await this.periodUseCase.getPeriods(usr_uuid, crd_uuid);
                return res.status(200).send({
                    success: true,
                    message: 'Períodos retornados.',
                    ...paginator(periods, page.toString(), perPage.toString())
                });
            } else {
                const periods = await this.periodUseCase.getPeriods(usr_uuid, crd_uuid);
                return res.status(200).send({
                    success: true,
                    message: 'Períodos retornados.',
                    data: periods
                });
            }
        } catch (error: any) {
            console.error('Error en getAllCtrl (controller):', error.message);
            return res.status(400).json({
                success: false,
                message: 'No se pudo recuperar los períodos.',
                error: error.message,
            });
        }
    }

    public async getCtrl(req: Request, res: Response) {
        try {
            const usr_uuid = req.params.usr_uuid;
            const crd_uuid = req.params.crd_uuid;
            const per_uuid = req.params.per_uuid;
            if(!usr_uuid || usr_uuid.toLowerCase() === 'null' || usr_uuid.toLowerCase() === 'undefined') {
                return res.status(400).json({
                    success: false,
                    message: 'No se pudo recuperar el período.',
                    error: 'Debe proporcionar un Id de usuario.'
                });
            }
            if(!crd_uuid || crd_uuid.toLowerCase() === 'null' || crd_uuid.toLowerCase() === 'undefined') {
                return res.status(400).json({
                    success: false,
                    message: 'No se pudo recuperar el período.',
                    error: 'Debe proporcionar un Id de tarjeta.'
                });
            }
            if(!per_uuid || per_uuid.toLowerCase() === 'null' || per_uuid.toLowerCase() === 'undefined') {
                return res.status(400).json({
                    success: false,
                    message: 'No se pudo recuperar el período.',
                    error: 'Debe proporcionar un Id de período.'
                });
            }
            const period = await this.periodUseCase.getDetailPeriod(`${usr_uuid}`, `${crd_uuid}`, `${per_uuid}`)
            return res.status(200).send({
                success: true,
                message: 'Período retornado.',
                data: period
            });
        } catch (error: any) {
            console.error('Error en getCtrl (controller):', error.message);
            return res.status(400).json({
                success: false,
                message: 'No se pudo recuperar el período.',
                error: error.message,
            });
        }
    }

    public async insertCtrl({ body }: Request, res: Response) {
        try {
            const usr_uuid = body.usr_uuid;
            const crd_uuid = body.crd_uuid;
            const per_periodnumber = body.per_periodnumber;
            if(!usr_uuid) {
                return res.status(400).json({
                    success: false,
                    message: 'No se pudo insertar el período.',
                    error: 'Debe proporcionar un Id de usuario.'
                })
            };
            if(!crd_uuid) {
                return res.status(400).json({
                    success: false,
                    message: 'No se pudo insertar el período.',
                    error: 'Debe proporcionar un Id de tarjeta.'
                })
            };
            if(!per_periodnumber) {
                return res.status(400).json({
                    success: false,
                    message: 'No se pudo insertar el período.',
                    error: 'Debe proporcionar un Número de período.'
                })
            };
            const periodByNumber = await this.periodUseCase.findPeriodByNumber(usr_uuid, crd_uuid, per_periodnumber);
            if(periodByNumber) {
                return res.status(400).json({
                    success: false,
                    message: 'No se pudo insertar el período.',
                    error: `El período ${per_periodnumber} ya existe.`
                });
            }
            const period = await this.periodUseCase.createPeriod(body)
            return res.status(200).json({
                success: true,
                message: 'Período insertado.',
                data: period
            });
        } catch (error: any) {
            console.error('Error en insertCtrl (controller):', error.message);
            return res.status(400).json({
                success: false,
                message: 'No se pudo insertar el período.',
                error: error.message,
            });
        }
    }

    public async updateCtrl(req: Request, res: Response) {
        try {
            const usr_uuid = req.params.usr_uuid;
            const crd_uuid = req.params.crd_uuid;
            const per_uuid = req.params.per_uuid;
            const update = req.body;
            const per_periodnumber = update.per_periodnumber;
            if(!per_periodnumber) {
                return res.status(400).json({
                    success: false,
                    message: 'No se pudo actualizar el período.',
                    error: 'Debe proporcionar un Número de período.'
                })
            };
            const periodByNumber = await this.periodUseCase.findPeriodByNumber(usr_uuid, crd_uuid, per_periodnumber);
            if(periodByNumber) {
                return res.status(400).json({
                    success: false,
                    message: 'No se pudo actualizar el período.',
                    error: `El período ${per_periodnumber} ya existe.`
                });
            }
            const period = await this.periodUseCase.updatePeriod(usr_uuid, crd_uuid, per_uuid, update)
            return res.status(200).json({
                success: true,
                message: 'Período actualizado.',
                data: period
            });
        } catch (error: any) {
            console.error('Error en updateCtrl (controller):', error.message);
            return res.status(400).json({
                success: false,
                message: 'No se pudo actualizar el período.',
                error: error.message,
            });
        }
    }

    public async deleteCtrl(req: Request, res: Response) {
        try {
            const usr_uuid = req.params.usr_uuid;
            const crd_uuid = req.params.crd_uuid;
            const per_uuid = req.params.per_uuid;
            if(!per_uuid) {
                return res.status(400).json({
                    success: false,
                    message: 'No se pudo eliminar el período.',
                    error: 'Debe proporcionar un Id de período.'
                });
            };
            const period = await this.periodUseCase.deletePeriod(usr_uuid, crd_uuid, per_uuid)
            return res.status(200).json({
                success: true,
                message: 'Período eliminado.',
                data: period
            });
        } catch (error: any) {
            console.error('Error en deleteCtrl (controller):', error.message);
            return res.status(400).json({
                success: false,
                message: 'No se pudo eliminar el período.',
                error: error.message,
            });
        }
    }
}