import { Express } from 'express';
import { ScopeUseCase } from '../../../application/scope/scope-use-case';
import { ScopeController } from '../../controller/scope/scope.controller';
import { SequelizeScopeRepository } from '../../repository/scope/sequelize-scope.repository';
import SocketAdapter from "../../services/socketAdapter";

function configureScopeRoutes(app: Express, socketAdapter: SocketAdapter) {
    const scopeRepository = new SequelizeScopeRepository();
    const scopeUseCase = new ScopeUseCase(scopeRepository);
    const scopeCtrl = new ScopeController(scopeUseCase);

    const apiPrefix = process.env.BASE_URL_API ? `/${process.env.BASE_URL_API}` : '/api';

    /**
     * @swagger
     * /scopes/{usr_uuid}:
     *   get:
     *     tags:
     *       - Scopes
     *     summary: Listar ámbitos de un usuario
     *     description: Retorna todos los ámbitos (scopes) a los que tiene acceso el usuario.
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
     *     responses:
     *       200:
     *         description: Lista de ámbitos obtenida exitosamente.
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
     *                     $ref: '#/components/schemas/ScopeEntity'
     *       500:
     *         description: Error interno al obtener los ámbitos.
     *         content:
     *           application/json:
     *             schema:
     *               $ref: '#/components/schemas/ErrorResponse'
     */
    app.get(`${apiPrefix}/scopes/:usr_uuid`, scopeCtrl.getAllCtrl);

    /**
     * @swagger
     * /scope/{scp_uuid}:
     *   get:
     *     tags:
     *       - Scopes
     *     summary: Obtener detalle de un ámbito
     *     description: Retorna la información completa de un ámbito por su UUID.
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
     *     responses:
     *       200:
     *         description: Ámbito encontrado.
     *         content:
     *           application/json:
     *             schema:
     *               type: object
     *               properties:
     *                 success:
     *                   type: boolean
     *                   example: true
     *                 data:
     *                   $ref: '#/components/schemas/ScopeEntity'
     *       500:
     *         description: Error interno al consultar el ámbito.
     *         content:
     *           application/json:
     *             schema:
     *               $ref: '#/components/schemas/ErrorResponse'
     */
    app.get(`${apiPrefix}/scope/:scp_uuid`, scopeCtrl.getDetailCtrl);

    /**
     * @swagger
     * /scope:
     *   post:
     *     tags:
     *       - Scopes
     *     summary: Crear un nuevo ámbito
     *     description: Crea un nuevo ámbito de gestión asignado a un usuario propietario.
     *     security:
     *       - bearerAuth: []
     *     requestBody:
     *       required: true
     *       content:
     *         application/json:
     *           schema:
     *             $ref: '#/components/schemas/ScopeInputDTO'
     *     responses:
     *       201:
     *         description: Ámbito creado exitosamente.
     *         content:
     *           application/json:
     *             schema:
     *               type: object
     *               properties:
     *                 success:
     *                   type: boolean
     *                   example: true
     *                 data:
     *                   $ref: '#/components/schemas/ScopeEntity'
     *       500:
     *         description: Error al crear el ámbito.
     *         content:
     *           application/json:
     *             schema:
     *               $ref: '#/components/schemas/ErrorResponse'
     */
    app.post(`${apiPrefix}/scope`, scopeCtrl.insertCtrl);

    /**
     * @swagger
     * /scope/{scp_uuid}:
     *   put:
     *     tags:
     *       - Scopes
     *     summary: Actualizar un ámbito existente
     *     description: Actualiza los datos de un ámbito especificado por su UUID.
     *     security:
     *       - bearerAuth: []
     *     parameters:
     *       - in: path
     *         name: scp_uuid
     *         required: true
     *         schema:
     *           type: string
     *           format: uuid
     *         description: UUID del ámbito a actualizar
     *     requestBody:
     *       required: true
     *       content:
     *         application/json:
     *           schema:
     *             $ref: '#/components/schemas/ScopeInputDTO'
     *     responses:
     *       200:
     *         description: Ámbito actualizado exitosamente.
     *         content:
     *           application/json:
     *             schema:
     *               type: object
     *               properties:
     *                 success:
     *                   type: boolean
     *                   example: true
     *                 data:
     *                   $ref: '#/components/schemas/ScopeEntity'
     *       500:
     *         description: Error al actualizar el ámbito.
     *         content:
     *           application/json:
     *             schema:
     *               $ref: '#/components/schemas/ErrorResponse'
     */
    app.put(`${apiPrefix}/scope/:scp_uuid`, scopeCtrl.updateCtrl);

    /**
     * @swagger
     * /scope/{scp_uuid}:
     *   delete:
     *     tags:
     *       - Scopes
     *     summary: Eliminar un ámbito
     *     description: Da de baja a un ámbito especificado por su UUID.
     *     security:
     *       - bearerAuth: []
     *     parameters:
     *       - in: path
     *         name: scp_uuid
     *         required: true
     *         schema:
     *           type: string
     *           format: uuid
     *         description: UUID del ámbito a eliminar
     *     responses:
     *       200:
     *         description: Ámbito eliminado exitosamente.
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
     *         description: Error al eliminar el ámbito.
     *         content:
     *           application/json:
     *             schema:
     *               $ref: '#/components/schemas/ErrorResponse'
     */
    app.delete(`${apiPrefix}/scope/:scp_uuid`, scopeCtrl.deleteCtrl);
}

export default configureScopeRoutes;
