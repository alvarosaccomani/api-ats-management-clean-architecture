import { Request, Response } from "express";
import { CardUseCase } from "../../../application/card/card-use-case";
import SocketAdapter from "../../services/socketAdapter";
import { paginator } from "../../services/paginator.service";

export class CardController {
    constructor(private cardUseCase: CardUseCase, private socketAdapter: SocketAdapter) {
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
                const cards = await this.cardUseCase.getCards(usr_uuid);
                return res.status(200).send({
                    success: true,
                    message: 'Tarjetas retornadas.',
                    ...paginator(cards, page.toString(), perPage.toString())
                });
            } else {
                const cards = await this.cardUseCase.getCards(usr_uuid);
                return res.status(200).send({
                    success: true,
                    message: 'Tarjetas retornadas.',
                    data: cards
                });
            }
        } catch (error: any) {
            console.error('Error en getAllCtrl (controller):', error.message);
            return res.status(400).json({
                success: false,
                message: 'No se pudo recuperar las tarjetas.',
                error: error.message,
            });
        }
    }

    public async getCtrl(req: Request, res: Response) {
        try {
            const usr_uuid = req.params.usr_uuid;
            const crd_uuid = req.params.crd_uuid;
            if(!usr_uuid || usr_uuid.toLowerCase() === 'null' || usr_uuid.toLowerCase() === 'undefined') {
                return res.status(400).json({
                    success: false,
                    message: 'No se pudo recuperar la tarjeta.',
                    error: 'Debe proporcionar un Id de usuario.'
                });
            }
            if(!crd_uuid || crd_uuid.toLowerCase() === 'null' || crd_uuid.toLowerCase() === 'undefined') {
                return res.status(400).json({
                    success: false,
                    message: 'No se pudo recuperar la tarjeta.',
                    error: 'Debe proporcionar un Id de tarjeta.'
                });
            }
            const card = await this.cardUseCase.getDetailCard(`${usr_uuid}`, `${crd_uuid}`)
            return res.status(200).send({
                success: true,
                message: 'Tarjeta retornada.',
                data: card
            });
        } catch (error: any) {
            console.error('Error en getCtrl (controller):', error.message);
            return res.status(400).json({
                success: false,
                message: 'No se pudo recuperar la tarjeta.',
                error: error.message,
            });
        }
    }

    public async insertCtrl({ body }: Request, res: Response) {
        try {
            const usr_uuid = body.usr_uuid;
            const crd_maskedcardnumber = body.crd_maskedcardnumber;
            if(!usr_uuid) {
                return res.status(400).json({
                    success: false,
                    message: 'No se pudo insertar la tarjeta.',
                    error: 'Debe proporcionar un Id de usuario.'
                })
            };
            if(!crd_maskedcardnumber) {
                return res.status(400).json({
                    success: false,
                    message: 'No se pudo insertar la tarjeta.',
                    error: 'Debe proporcionar un Número de tarjeta enmascarado.'
                })
            };
            const cardByMaskedNumber = await this.cardUseCase.findCardByMaskedNumber(usr_uuid, crd_maskedcardnumber);
            if(cardByMaskedNumber) {
                return res.status(400).json({
                    success: false,
                    message: 'No se pudo insertar la tarjeta.',
                    error: `El número de tarjeta enmascarado ${crd_maskedcardnumber} ya existe.`
                });
            }
            const card = await this.cardUseCase.createCard(body)
            return res.status(200).json({
                success: true,
                message: 'Tarjeta insertada.',
                data: card
            });
        } catch (error: any) {
            console.error('Error en insertCtrl (controller):', error.message);
            return res.status(400).json({
                success: false,
                message: 'No se pudo insertar la tarjeta.',
                error: error.message,
            });
        }
    }

    public async updateCtrl(req: Request, res: Response) {
        try {
            const usr_uuid = req.params.usr_uuid;
            const crd_uuid = req.params.crd_uuid;
            const update = req.body;
            const crd_maskedcardnumber = update.crd_maskedcardnumber;
            if(!crd_maskedcardnumber) {
                return res.status(400).json({
                    success: false,
                    message: 'No se pudo actualizar la tarjeta.',
                    error: 'Debe proporcionar un Número de tarjeta enmascarado.'
                })
            };
            const cardByMaskedNumber = await this.cardUseCase.findCardByMaskedNumber(usr_uuid, crd_maskedcardnumber, crd_uuid);
            if(cardByMaskedNumber) {
                return res.status(400).json({
                    success: false,
                    message: 'No se pudo actualizar la tarjeta.',
                    error: `El número de tarjeta enmascarado ${crd_maskedcardnumber} ya existe.`
                });
            }
            const card = await this.cardUseCase.updateCard(usr_uuid, crd_uuid, update)
            return res.status(200).json({
                success: true,
                message: 'Tarjeta actualizada.',
                data: card
            });
        } catch (error: any) {
            console.error('Error en updateCtrl (controller):', error.message);
            return res.status(400).json({
                success: false,
                message: 'No se pudo actualizar la tarjeta.',
                error: error.message,
            });
        }
    }

    public async deleteCtrl(req: Request, res: Response) {
        try {
            const usr_uuid = req.params.usr_uuid;
            const crd_uuid = req.params.crd_uuid;
            if(!crd_uuid) {
                return res.status(400).json({
                    success: false,
                    message: 'No se pudo eliminar la tarjeta.',
                    error: 'Debe proporcionar un Id de tarjeta.'
                });
            };
            const card = await this.cardUseCase.deleteCard(usr_uuid, crd_uuid)
            return res.status(200).json({
                success: true,
                message: 'Tarjeta eliminada.',
                data: card
            });
        } catch (error: any) {
            console.error('Error en deleteCtrl (controller):', error.message);
            return res.status(400).json({
                success: false,
                message: 'No se pudo eliminar la tarjeta.',
                error: error.message,
            });
        }
    }
}