import { Request, Response } from "express";
import { TreeUseCase } from "../../../application/tree/tree-use-case";
import SocketAdapter from "../../services/socketAdapter";
import { paginator } from "../../services/paginator.service";

export class TreeController {
    constructor(private treeUseCase: TreeUseCase, private socketAdapter: SocketAdapter) {
        this.getCardsTreeCtrl = this.getCardsTreeCtrl.bind(this);
    }

    public async getCardsTreeCtrl(req: Request, res: Response) {
        try {
            const usr_uuid = req.params.usr_uuid;
            const cardsTree = await this.treeUseCase.getCardsTree(usr_uuid);
            return res.status(200).send({
                success: true,
                message: 'Arbol de tarjetas retornado.',
                data: cardsTree
            });
        } catch (error: any) {
            console.error('Error en getAllCtrl (controller):', error.message);
            return res.status(400).json({
                success: false,
                message: 'No se pudo recuperar el arbol de tarjetas.',
                error: error.message,
            });
        }
    }
}