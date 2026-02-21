import { Request, Response } from "express";
import { BankUseCase } from "../../../application/bank/bank-use-case";
import SocketAdapter from "../../services/socketAdapter";
import { paginator } from "../../services/paginator.service";

export class BankController {
    constructor(private bankUseCase: BankUseCase, private socketAdapter: SocketAdapter) {
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
                const banks = await this.bankUseCase.getBanks(usr_uuid);
                return res.status(200).send({
                    success: true,
                    message: 'Bancos retornados.',
                    ...paginator(banks, page.toString(), perPage.toString())
                });
            } else {
                const banks = await this.bankUseCase.getBanks(usr_uuid);
                return res.status(200).send({
                    success: true,
                    message: 'Bancos retornados.',
                    data: banks
                });
            }
        } catch (error: any) {
            console.error('Error en getAllCtrl (controller):', error.message);
            return res.status(400).json({
                success: false,
                message: 'No se pudo recuperar los bancos.',
                error: error.message,
            });
        }
    }

    public async getCtrl(req: Request, res: Response) {
        try {
            const usr_uuid = req.params.usr_uuid;
            const ban_uuid = req.params.ban_uuid;
            if(!ban_uuid || ban_uuid.toLowerCase() === 'null' || ban_uuid.toLowerCase() === 'undefined') {
                return res.status(400).json({
                    success: false,
                    message: 'No se pudo recuperar el banco.',
                    error: 'Debe proporcionar un Id de banco.'
                });
            }
            const bank = await this.bankUseCase.getDetailBank(`${usr_uuid}`, `${ban_uuid}`)
            return res.status(200).send({
                success: true,
                message: 'Banco retornado.',
                data: bank
            });
        } catch (error: any) {
            console.error('Error en getCtrl (controller):', error.message);
            return res.status(400).json({
                success: false,
                message: 'No se pudo recuperar el banco.',
                error: error.message,
            });
        }
    }

    public async insertCtrl({ body }: Request, res: Response) {
        try {
            const usr_uuid = body.usr_uuid;
            const ban_name = body.ban_name;
            if(!ban_name) {
                return res.status(400).json({
                    success: false,
                    message: 'No se pudo insertar el banco.',
                    error: 'Debe proporcionar un Nombre para el banco.'
                })
            };
            const bankByName = await this.bankUseCase.findBankByName(usr_uuid, ban_name);
            if(bankByName) {
                return res.status(400).json({
                    success: false,
                    message: 'No se pudo insertar el banco.',
                    error: `El nombre ${ban_name} de banco ya existe.`
                });
            }
            const bank = await this.bankUseCase.createBank(body)
            return res.status(200).json({
                success: true,
                message: 'Banco insertado.',
                data: bank
            });
        } catch (error: any) {
            console.error('Error en insertCtrl (controller):', error.message);
            return res.status(400).json({
                success: false,
                message: 'No se pudo insertar el banco.',
                error: error.message,
            });
        }
    }

    public async updateCtrl(req: Request, res: Response) {
        try {
            const usr_uuid = req.params.usr_uuid;
            const ban_uuid = req.params.ban_uuid;
            const update = req.body;
            if(!update.ban_name) {
                return res.status(400).json({
                    success: false,
                    message: 'No se pudo actualizar el banco.',
                    error: 'Debe proporcionar un Nombre para el banco.'
                })
            };
            const bankByName = await this.bankUseCase.findBankByName(usr_uuid, update.ban_name, ban_uuid);
            if(bankByName) {
                return res.status(400).json({
                    success: false,
                    message: 'No se pudo actualizar el banco.',
                    error: `El nombre ${update.ban_name} de banco ya existe.`
                });
            }
            const bank = await this.bankUseCase.updateBank(usr_uuid, ban_uuid, update)
            return res.status(200).json({
                success: true,
                message: 'Banco actualizado.',
                data: bank
            });
        } catch (error: any) {
            console.error('Error en updateCtrl (controller):', error.message);
            return res.status(400).json({
                success: false,
                message: 'No se pudo actualizar el banco.',
                error: error.message,
            });
        }
    }

    public async deleteCtrl(req: Request, res: Response) {
        try {
            const usr_uuid = req.params.usr_uuid;
            const ban_uuid = req.params.ban_uuid;
            if(!ban_uuid) {
                return res.status(400).json({
                    success: false,
                    message: 'No se pudo eliminar el banco.',
                    error: 'Debe proporcionar un Id de banco.'
                });
            };
            const bank = await this.bankUseCase.deleteBank(usr_uuid, ban_uuid)
            return res.status(200).json({
                success: true,
                message: 'Banco eliminado.',
                data: bank
            });
        } catch (error: any) {
            console.error('Error en deleteCtrl (controller):', error.message);
            return res.status(400).json({
                success: false,
                message: 'No se pudo eliminar el banco.',
                error: error.message,
            });
        }
    }
}