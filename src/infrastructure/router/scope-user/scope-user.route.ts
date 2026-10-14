import { Express } from 'express';
import { ScopeUserUseCase } from '../../../application/scope-user/scope-user-use-case';
import { ScopeUserController } from '../../controller/scope-user/scope-user.controller';
import { SequelizeScopeUserRepository } from '../../repository/scope-user/sequelize-scope-user.repository';
import SocketAdapter from "../../services/socketAdapter";

function configureScopeUserRoutes(app: Express, socketAdapter: SocketAdapter) {
    const scopeUserRepository = new SequelizeScopeUserRepository();
    const scopeUserUseCase = new ScopeUserUseCase(scopeUserRepository);
    const scopeUserCtrl = new ScopeUserController(scopeUserUseCase);

    const apiPrefix = process.env.BASE_URL_API ? `/${process.env.BASE_URL_API}` : '/api';

    /**
     * @swagger
     * /scope-users/{scp_uuid}:
     *   get:
     *     tags:
     *       - Scope Users
     *     summary: Listar usuarios asignados a un ámbito
     *     description: Retorna la lista de relaciones entre usuarios y un ámbito específico.
     *     security:
     *       - bearerAuth: []
     *     parameters:
     *       - in: path
     *         name: scp_uuid
     *         required: true
     *         schema:
     *           type: string
     *           format: uuid
     *         description: UUID del ámbito (scope)
     *     responses:
     *       200:
     *         description: Usuarios del ámbito obtenidos exitosamente.
     *         content:
     *           application/json:
     *             schema:
     *               type: object
     *               properties:
     *                 success:
     *                   type: boolean
     *                   example: true
     *                 data:
     *                   type: array
     *                   items:
     *                     $ref: '#/components/schemas/ScopeUserEntity'
     *       500:
     *         description: Error interno al obtener usuarios del ámbito.
     *         content:
     *           application/json:
     *             schema:
     *               $ref: '#/components/schemas/ErrorResponse'
     */
    app.get(`${apiPrefix}/scope-users/:scp_uuid`, scopeUserCtrl.getScopeUsersCtrl);

    /**
     * @swagger
     * /scope-user:
     *   post:
     *     tags:
     *       - Scope Users
     *     summary: Asignar un usuario a un ámbito
     *     description: Vincula un usuario existente a un ámbito con un rol específico.
     *     security:
     *       - bearerAuth: []
     *     requestBody:
     *       required: true
     *       content:
     *         application/json:
     *           schema:
     *             $ref: '#/components/schemas/ScopeUserInputDTO'
     *     responses:
     *       201:
     *         description: Usuario asignado al ámbito exitosamente.
     *         content:
     *           application/json:
     *             schema:
     *               type: object
     *               properties:
     *                 success:
     *                   type: boolean
     *                   example: true
     *                 data:
     *                   $ref: '#/components/schemas/ScopeUserEntity'
     *       500:
     *         description: Error al asignar usuario al ámbito.
     *         content:
     *           application/json:
     *             schema:
     *               $ref: '#/components/schemas/ErrorResponse'
     */
    app.post(`${apiPrefix}/scope-user`, scopeUserCtrl.addScopeUserCtrl);

    /**
     * @swagger
     * /scope-user/{scp_uuid}/{usr_uuid}:
     *   delete:
     *     tags:
     *       - Scope Users
     *     summary: Desvincular usuario de un ámbito
     *     description: Remueve la asignación de un usuario a un ámbito específico.
     *     security:
     *       - bearerAuth: []
     *     parameters:
     *       - in: path
     *         name: scp_uuid
     *         required: true
     *         schema:
     *           type: string
     *           format: uuid
     *         description: UUID del ámbito
     *       - in: path
     *         name: usr_uuid
     *         required: true
     *         schema:
     *           type: string
     *           format: uuid
     *         description: UUID del usuario
     *     responses:
     *       200:
     *         description: Usuario desvinculado exitosamente.
     *         content:
     *           application/json:
     *             schema:
     *               type: object
     *               properties:
     *                 success:
     *                   type: boolean
     *                   example: true
     *                 data:
     *                   type: object
     *       500:
     *         description: Error al desvincular usuario del ámbito.
     *         content:
     *           application/json:
     *             schema:
     *               $ref: '#/components/schemas/ErrorResponse'
     */
    app.delete(`${apiPrefix}/scope-user/:scp_uuid/:usr_uuid`, scopeUserCtrl.removeScopeUserCtrl);
}

export default configureScopeUserRoutes;
