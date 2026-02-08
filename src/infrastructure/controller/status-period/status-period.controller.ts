import { Request, Response } from "express";
import { StatusPeriodUseCase } from "../../../application/status-period/status-period-use-case";
import SocketAdapter from "../../services/socketAdapter";
import { paginator } from "../../services/paginator.service";

export class StatusPeriodController {
    constructor(private statusPeriodUseCase: StatusPeriodUseCase, private socketAdapter: SocketAdapter) {
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
                const statusPeriods = await this.statusPeriodUseCase.getStatusPeriods();
                return res.status(200).send({
                    success: true,
                    message: 'Estados de período retornados.',
                    ...paginator(statusPeriods, page.toString(), perPage.toString())
                });
            } else {
                const statusPeriods = await this.statusPeriodUseCase.getStatusPeriods();
                return res.status(200).send({
                    success: true,
                    message: 'Estados de período retornados.',
                    data: statusPeriods
                });
            }
        } catch (error: any) {
            console.error('Error en getAllCtrl (controller):', error.message);
            return res.status(400).json({
                success: false,
                message: 'No se pudo recuperar los estados de período.',
                error: error.message,
            });
        }
    }

    public async getCtrl(req: Request, res: Response) {
        try {
            const sper_uuid = req.params.sper_uuid;
            if(!sper_uuid || sper_uuid.toLowerCase() === 'null' || sper_uuid.toLowerCase() === 'undefined') {
                return res.status(400).json({
                    success: false,
                    message: 'No se pudo recuperar el estado de período.',
                    error: 'Debe proporcionar un Id de estado de período.'
                });
            }
            const statusPeriod = await this.statusPeriodUseCase.getDetailStatusPeriod(`${sper_uuid}`)
            return res.status(200).send({
                success: true,
                message: 'Estado de período retornado.',
                data: statusPeriod
            });
        } catch (error: any) {
            console.error('Error en getCtrl (controller):', error.message);
            return res.status(400).json({
                success: false,
                message: 'No se pudo recuperar el estado de período.',
                error: error.message,
            });
        }
    }

    public async insertCtrl({ body }: Request, res: Response) {
        try {
            const sper_name = body.sper_name;
            if(!sper_name) {
                return res.status(400).json({
                    success: false,
                    message: 'No se pudo insertar el estado de período.',
                    error: 'Debe proporcionar un Nombre para el estado de período.'
                })
            };
            const statusPeriodByName = await this.statusPeriodUseCase.findStatusPeriodByName(sper_name);
            if(statusPeriodByName) {
                return res.status(400).json({
                    success: false,
                    message: 'No se pudo insertar el estado de período.',
                    error: `El nombre ${sper_name} de estado de período ya existe.`
                });
            }
            const statusPeriod = await this.statusPeriodUseCase.createStatusPeriod(body)
            return res.status(200).json({
                success: true,
                message: 'Estado de período insertado.',
                data: statusPeriod
            });
        } catch (error: any) {
            console.error('Error en insertCtrl (controller):', error.message);
            return res.status(400).json({
                success: false,
                message: 'No se pudo insertar el estado de período.',
                error: error.message,
            });
        }
    }

    public async updateCtrl(req: Request, res: Response) {
        try {
            const sper_uuid = req.params.sper_uuid;
            const update = req.body;
            if(!update.sper_name) {
                return res.status(400).json({
                    success: false,
                    message: 'No se pudo actualizar el estado de período.',
                    error: 'Debe proporcionar un Nombre para el estado de período.'
                })
            };
            const statusPeriodByName = await this.statusPeriodUseCase.findStatusPeriodByName(update.sper_name, sper_uuid);
            if(statusPeriodByName) {
                return res.status(400).json({
                    success: false,
                    message: 'No se pudo actualizar el estado de período.',
                    error: `El nombre ${update.sper_name} de estado de período ya existe.`
                });
            }
            const statusPeriod = await this.statusPeriodUseCase.updateStatusPeriod(sper_uuid, update)
            return res.status(200).json({
                success: true,
                message: 'Estado de período actualizado.',
                data: statusPeriod
            });
        } catch (error: any) {
            console.error('Error en updateCtrl (controller):', error.message);
            return res.status(400).json({
                success: false,
                message: 'No se pudo actualizar el estado de período.',
                error: error.message,
            });
        }
    }

    public async deleteCtrl(req: Request, res: Response) {
        try {
            const sper_uuid = req.params.sper_uuid;
            if(!sper_uuid) {
                return res.status(400).json({
                    success: false,
                    message: 'No se pudo eliminar el estado de período.',
                    error: 'Debe proporcionar un Id de estado de período.'
                });
            };
            const statusPeriod = await this.statusPeriodUseCase.deleteStatusPeriod(sper_uuid)
            return res.status(200).json({
                success: true,
                message: 'Estado de período eliminado.',
                data: statusPeriod
            });
        } catch (error: any) {
            console.error('Error en deleteCtrl (controller):', error.message);
            return res.status(400).json({
                success: false,
                message: 'No se pudo eliminar el estado de período.',
                error: error.message,
            });
        }
    }
}