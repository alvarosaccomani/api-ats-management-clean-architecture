import { Express } from "express";
import { SequelizeTreeRepository } from "../../repository/tree/sequelize-tree.repository";
import { TreeUseCase } from "../../../application/tree/tree-use-case";
import { TreeController } from "../../controller/tree/tree.controller";
import SocketAdapter from "../../services/socketAdapter";

function configureTreeRoutes(app: Express, socketAdapter: SocketAdapter) {
    /*
    *   Iniciar repository
    */
    
    const sequelizeTreeRepository = new SequelizeTreeRepository();
    
    /*
    *   Iniciar casos de uso
    */
    
    const treeUseCase = new TreeUseCase(sequelizeTreeRepository);
    
    /*
    *   Iniciar controller
    */
    
    const treeCtrl = new TreeController(treeUseCase, socketAdapter);
    
    /**
     * @swagger
     * /cards-tree/{usr_uuid}:
     *   get:
     *     tags:
     *       - Tree
     *     summary: Obtener estructura en árbol de tarjetas
     *     description: Retorna la jerarquía en árbol (cards-tree) de las tarjetas del usuario con sus relaciones y estados, estructurado para componentes de árbol UI. Permite filtrar por ámbito (scope).
     *     security:
     *       - bearerAuth: []
     *     parameters:
     *       - in: path
     *         name: usr_uuid
     *         required: true
     *         schema:
     *           type: string
     *           format: uuid
     *         description: UUID del usuario
     *       - in: query
     *         name: scp_uuid
     *         required: false
     *         schema:
     *           type: string
     *           format: uuid
     *         description: UUID del ámbito (scope) para filtrar tarjetas
     *     responses:
     *       200:
     *         description: Árbol de tarjetas obtenido exitosamente.
     *         content:
     *           application/json:
     *             schema:
     *               type: object
     *               properties:
     *                 success:
     *                   type: boolean
     *                   example: true
     *                 message:
     *                   type: string
     *                   example: Arbol de tarjetas retornado.
     *                 data:
     *                   type: array
     *                   items:
     *                     $ref: '#/components/schemas/TreeEntity'
     *       400:
     *         description: Error al recuperar el árbol de tarjetas.
     *         content:
     *           application/json:
     *             schema:
     *               $ref: '#/components/schemas/ErrorResponse'
     */
    app.get(`/${process.env.BASE_URL_API}/cards-tree/:usr_uuid`, treeCtrl.getCardsTreeCtrl);
}

export default configureTreeRoutes;
