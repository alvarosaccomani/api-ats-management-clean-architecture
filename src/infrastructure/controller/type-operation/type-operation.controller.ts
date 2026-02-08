import { Request, Response } from "express";
import { TypeOperationUseCase } from "../../../application/type-operation/type-operation-use-case";
import SocketAdapter from "../../services/socketAdapter";
import { paginator } from "../../services/paginator.service";

export class TypeOperationController {
    constructor(private typeOperationUseCase: TypeOperationUseCase, private socketAdapter: SocketAdapter) {
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
                const typeOperations = await this.typeOperationUseCase.getTypeOperations();
                return res.status(200).send({
                    success: true,
                    message: 'Tipos de operaciones retornados.',
                    ...paginator(typeOperations, page.toString(), perPage.toString())
                });
            } else {
                const typeOperations = await this.typeOperationUseCase.getTypeOperations();
                return res.status(200).send({
                    success: true,
                    message: 'Tipos de operaciones retornados.',
                    data: typeOperations
                });
            }
        } catch (error: any) {
            console.error('Error en getAllCtrl (controller):', error.message);
            return res.status(400).json({
                success: false,
                message: 'No se pudo recuperar los tipos de operaciones.',
                error: error.message,
            });
        }
    }

    public async getCtrl(req: Request, res: Response) {
        try {
            const tyop_uuid = req.params.tyop_uuid;
            if(!tyop_uuid || tyop_uuid.toLowerCase() === 'null' || tyop_uuid.toLowerCase() === 'undefined') {
                return res.status(400).json({
                    success: false,
                    message: 'No se pudo recuperar el tipo de operación.',
                    error: 'Debe proporcionar un Id de tipo de operación.'
                });
            }
            const typeOperation = await this.typeOperationUseCase.getDetailTypeOperation(`${tyop_uuid}`)
            return res.status(200).send({
                success: true,
                message: 'Tipo de operación retornado.',
                data: typeOperation
            });
        } catch (error: any) {
            console.error('Error en getCtrl (controller):', error.message);
            return res.status(400).json({
                success: false,
                message: 'No se pudo recuperar el tipo de operación.',
                error: error.message,
            });
        }
    }

    public async insertCtrl({ body }: Request, res: Response) {
        try {
            const tyop_name = body.tyop_name;
            if(!tyop_name) {
                return res.status(400).json({
                    success: false,
                    message: 'No se pudo insertar el tipo de operación.',
                    error: 'Debe proporcionar un Nombre para el tipo de operación.'
                })
            };
            const typeOperationByName = await this.typeOperationUseCase.findTypeOperationByName(tyop_name);
            if(typeOperationByName) {
                return res.status(400).json({
                    success: false,
                    message: 'No se pudo insertar el tipo de operación.',
                    error: `El nombre ${tyop_name} de tipo de operación ya existe.`
                });
            }
            const typeOperation = await this.typeOperationUseCase.createTypeOperation(body)
            return res.status(200).json({
                success: true,
                message: 'Tipo de operación insertado.',
                data: typeOperation
            });
        } catch (error: any) {
            console.error('Error en insertCtrl (controller):', error.message);
            return res.status(400).json({
                success: false,
                message: 'No se pudo insertar el tipo de operación.',
                error: error.message,
            });
        }
    }

    public async updateCtrl(req: Request, res: Response) {
        try {
            const tyop_uuid = req.params.tyop_uuid;
            const update = req.body;
            if(!update.tyop_name) {
                return res.status(400).json({
                    success: false,
                    message: 'No se pudo actualizar el tipo de operación.',
                    error: 'Debe proporcionar un Nombre para el tipo de operación.'
                })
            };
            const typeOperationByName = await this.typeOperationUseCase.findTypeOperationByName(update.tyop_name, tyop_uuid);
            if(typeOperationByName) {
                return res.status(400).json({
                    success: false,
                    message: 'No se pudo actualizar el tipo de operación.',
                    error: `El nombre ${update.tyop_name} de tipo de operación ya existe.`
                });
            }
            const typeOperation = await this.typeOperationUseCase.updateTypeOperation(tyop_uuid, update)
            return res.status(200).json({
                success: true,
                message: 'Tipo de operación actualizado.',
                data: typeOperation
            });
        } catch (error: any) {
            console.error('Error en updateCtrl (controller):', error.message);
            return res.status(400).json({
                success: false,
                message: 'No se pudo actualizar el tipo de operación.',
                error: error.message,
            });
        }
    }

    public async deleteCtrl(req: Request, res: Response) {
        try {
            const tyop_uuid = req.params.tyop_uuid;
            if(!tyop_uuid) {
                return res.status(400).json({
                    success: false,
                    message: 'No se pudo eliminar el tipo de operación.',
                    error: 'Debe proporcionar un Id de tipo de operación.'
                });
            };
            const typeOperation = await this.typeOperationUseCase.deleteTypeOperation(tyop_uuid)
            return res.status(200).json({
                success: true,
                message: 'Tipo de operación eliminado.',
                data: typeOperation
            });
        } catch (error: any) {
            console.error('Error en deleteCtrl (controller):', error.message);
            return res.status(400).json({
                success: false,
                message: 'No se pudo eliminar el tipo de operación.',
                error: error.message,
            });
        }
    }
}