import { Request, Response } from "express";
import { TypeCardUseCase } from "../../../application/type-card/type-card-use-case";
import SocketAdapter from "../../services/socketAdapter";
import { paginator } from "../../services/paginator.service";

export class TypeCardController {
    constructor(private typeCardUseCase: TypeCardUseCase, private socketAdapter: SocketAdapter) {
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
                const typeCards = await this.typeCardUseCase.getTypeCards();
                return res.status(200).send({
                    success: true,
                    message: 'Tipos de tarjetas retornados.',
                    ...paginator(typeCards, page.toString(), perPage.toString())
                });
            } else {
                const typeCards = await this.typeCardUseCase.getTypeCards();
                return res.status(200).send({
                    success: true,
                    message: 'Tipos de tarjetas retornados.',
                    data: typeCards
                });
            }
        } catch (error: any) {
            console.error('Error en getAllCtrl (controller):', error.message);
            return res.status(400).json({
                success: false,
                message: 'No se pudo recuperar los tipos de tarjetas.',
                error: error.message,
            });
        }
    }

    public async getCtrl(req: Request, res: Response) {
        try {
            const tycrd_uuid = req.params.tycrd_uuid;
            if(!tycrd_uuid || tycrd_uuid.toLowerCase() === 'null' || tycrd_uuid.toLowerCase() === 'undefined') {
                return res.status(400).json({
                    success: false,
                    message: 'No se pudo recuperar el tipo de tarjeta.',
                    error: 'Debe proporcionar un Id de tipo de tarjeta.'
                });
            }
            const typeCard = await this.typeCardUseCase.getDetailTypeCard(`${tycrd_uuid}`)
            return res.status(200).send({
                success: true,
                message: 'Tipo de tarjeta retornado.',
                data: typeCard
            });
        } catch (error: any) {
            console.error('Error en getCtrl (controller):', error.message);
            return res.status(400).json({
                success: false,
                message: 'No se pudo recuperar el tipo de tarjeta.',
                error: error.message,
            });
        }
    }

    public async insertCtrl({ body }: Request, res: Response) {
        try {
            const tycrd_name = body.tycrd_name;
            if(!tycrd_name) {
                return res.status(400).json({
                    success: false,
                    message: 'No se pudo insertar el tipo de tarjeta.',
                    error: 'Debe proporcionar un Nombre para el tipo de tarjeta.'
                })
            };
            const typeCardByName = await this.typeCardUseCase.findTypeCardByName(tycrd_name);
            if(typeCardByName) {
                return res.status(400).json({
                    success: false,
                    message: 'No se pudo insertar el tipo de tarjeta.',
                    error: `El nombre ${tycrd_name} de tipo de tarjeta ya existe.`
                });
            }
            const typeCard = await this.typeCardUseCase.createTypeCard(body)
            return res.status(200).json({
                success: true,
                message: 'Tipo de tarjeta insertado.',
                data: typeCard
            });
        } catch (error: any) {
            console.error('Error en insertCtrl (controller):', error.message);
            return res.status(400).json({
                success: false,
                message: 'No se pudo insertar el tipo de tarjeta.',
                error: error.message,
            });
        }
    }

    public async updateCtrl(req: Request, res: Response) {
        try {
            const tycrd_uuid = req.params.tycrd_uuid;
            const update = req.body;
            if(!update.tycrd_name) {
                return res.status(400).json({
                    success: false,
                    message: 'No se pudo actualizar el tipo de tarjeta.',
                    error: 'Debe proporcionar un Nombre para el tipo de tarjeta.'
                })
            };
            const typeCardByName = await this.typeCardUseCase.findTypeCardByName(update.tycrd_name, tycrd_uuid);
            if(typeCardByName) {
                return res.status(400).json({
                    success: false,
                    message: 'No se pudo actualizar el tipo de tarjeta.',
                    error: `El nombre ${update.tycrd_name} de tipo de tarjeta ya existe.`
                });
            }
            const typeCard = await this.typeCardUseCase.updateTypeCard(tycrd_uuid, update)
            return res.status(200).json({
                success: true,
                message: 'Tipo de tarjeta actualizado.',
                data: typeCard
            });
        } catch (error: any) {
            console.error('Error en updateCtrl (controller):', error.message);
            return res.status(400).json({
                success: false,
                message: 'No se pudo actualizar el tipo de tarjeta.',
                error: error.message,
            });
        }
    }

    public async deleteCtrl(req: Request, res: Response) {
        try {
            const tycrd_uuid = req.params.tycrd_uuid;
            if(!tycrd_uuid) {
                return res.status(400).json({
                    success: false,
                    message: 'No se pudo eliminar el tipo de tarjeta.',
                    error: 'Debe proporcionar un Id de tipo de tarjeta.'
                });
            };
            const typeCard = await this.typeCardUseCase.deleteTypeCard(tycrd_uuid)
            return res.status(200).json({
                success: true,
                message: 'Tipo de tarjeta eliminado.',
                data: typeCard
            });
        } catch (error: any) {
            console.error('Error en deleteCtrl (controller):', error.message);
            return res.status(400).json({
                success: false,
                message: 'No se pudo eliminar el tipo de tarjeta.',
                error: error.message,
            });
        }
    }
}