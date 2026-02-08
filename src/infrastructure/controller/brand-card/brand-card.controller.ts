import { Request, Response } from "express";
import { BrandCardUseCase } from "../../../application/brand-card/brand-card-use-case";
import SocketAdapter from "../../services/socketAdapter";
import { paginator } from "../../services/paginator.service";

export class BrandCardController {
    constructor(private brandCardUseCase: BrandCardUseCase, private socketAdapter: SocketAdapter) {
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
                const brandCards = await this.brandCardUseCase.getBrandCards();
                return res.status(200).send({
                    success: true,
                    message: 'Marcas de tarjetas retornadas.',
                    ...paginator(brandCards, page.toString(), perPage.toString())
                });
            } else {
                const brandCards = await this.brandCardUseCase.getBrandCards();
                return res.status(200).send({
                    success: true,
                    message: 'Marcas de tarjetas retornadas.',
                    data: brandCards
                });
            }
        } catch (error: any) {
            console.error('Error en getAllCtrl (controller):', error.message);
            return res.status(400).json({
                success: false,
                message: 'No se pudo recuperar las marcas de tarjetas.',
                error: error.message,
            });
        }
    }

    public async getCtrl(req: Request, res: Response) {
        try {
            const brcrd_uuid = req.params.brcrd_uuid;
            if(!brcrd_uuid || brcrd_uuid.toLowerCase() === 'null' || brcrd_uuid.toLowerCase() === 'undefined') {
                return res.status(400).json({
                    success: false,
                    message: 'No se pudo recuperar la marca de tarjeta.',
                    error: 'Debe proporcionar un Id de marca de tarjeta.'
                });
            }
            const brandCard = await this.brandCardUseCase.getDetailBrandCard(`${brcrd_uuid}`)
            return res.status(200).send({
                success: true,
                message: 'Marca de tarjeta retornada.',
                data: brandCard
            });
        } catch (error: any) {
            console.error('Error en getCtrl (controller):', error.message);
            return res.status(400).json({
                success: false,
                message: 'No se pudo recuperar la marca de tarjeta.',
                error: error.message,
            });
        }
    }

    public async insertCtrl({ body }: Request, res: Response) {
        try {
            const brcrd_name = body.brcrd_name;
            if(!brcrd_name) {
                return res.status(400).json({
                    success: false,
                    message: 'No se pudo insertar la marca de tarjeta.',
                    error: 'Debe proporcionar un Nombre para la marca de tarjeta.'
                })
            };
            const brandCardByName = await this.brandCardUseCase.findBrandCardByName(brcrd_name);
            if(brandCardByName) {
                return res.status(400).json({
                    success: false,
                    message: 'No se pudo insertar la marca de tarjeta.',
                    error: `El nombre ${brcrd_name} de marca de tarjeta ya existe.`
                });
            }
            const brandCard = await this.brandCardUseCase.createBrandCard(body)
            return res.status(200).json({
                success: true,
                message: 'Marca de tarjeta insertada.',
                data: brandCard
            });
        } catch (error: any) {
            console.error('Error en insertCtrl (controller):', error.message);
            return res.status(400).json({
                success: false,
                message: 'No se pudo insertar la marca de tarjeta.',
                error: error.message,
            });
        }
    }

    public async updateCtrl(req: Request, res: Response) {
        try {
            const brcrd_uuid = req.params.brcrd_uuid;
            const update = req.body;
            if(!update.brcrd_name) {
                return res.status(400).json({
                    success: false,
                    message: 'No se pudo actualizar la marca de tarjeta.',
                    error: 'Debe proporcionar un Nombre para la marca de tarjeta.'
                })
            };
            const brandCardByName = await this.brandCardUseCase.findBrandCardByName(update.brcrd_name, brcrd_uuid);
            if(brandCardByName) {
                return res.status(400).json({
                    success: false,
                    message: 'No se pudo actualizar la marca de tarjeta.',
                    error: `El nombre ${update.brcrd_name} de marca de tarjeta ya existe.`
                });
            }
            const brandCard = await this.brandCardUseCase.updateBrandCard(brcrd_uuid, update)
            return res.status(200).json({
                success: true,
                message: 'Marca de tarjeta actualizada.',
                data: brandCard
            });
        } catch (error: any) {
            console.error('Error en updateCtrl (controller):', error.message);
            return res.status(400).json({
                success: false,
                message: 'No se pudo actualizar la marca de tarjeta.',
                error: error.message,
            });
        }
    }

    public async deleteCtrl(req: Request, res: Response) {
        try {
            const brcrd_uuid = req.params.brcrd_uuid;
            if(!brcrd_uuid) {
                return res.status(400).json({
                    success: false,
                    message: 'No se pudo eliminar la marca de tarjeta.',
                    error: 'Debe proporcionar un Id de marca de tarjeta.'
                });
            };
            const brandCard = await this.brandCardUseCase.deleteBrandCard(brcrd_uuid)
            return res.status(200).json({
                success: true,
                message: 'Marca de tarjeta eliminada.',
                data: brandCard
            });
        } catch (error: any) {
            console.error('Error en deleteCtrl (controller):', error.message);
            return res.status(400).json({
                success: false,
                message: 'No se pudo eliminar la marca de tarjeta.',
                error: error.message,
            });
        }
    }
}