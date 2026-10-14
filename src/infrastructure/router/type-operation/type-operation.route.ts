import { Express } from "express";
import { SequelizeTypeOperationRepository } from "../../repository/type-operation/sequelize-type-operation.repository";
import { TypeOperationUseCase } from "../../../application/type-operation/type-operation-use-case";
import { TypeOperationController } from "../../controller/type-operation/type-operation.controller";
import SocketAdapter from "../../services/socketAdapter";

function configureTypeOperationRoutes(app: Express, socketAdapter: SocketAdapter) {
    /*
    *   Iniciar repository
    */
    
    const sequelizeTypeOperationRepository = new SequelizeTypeOperationRepository();
    
    /*
    *   Iniciar casos de uso
    */
    
    const typeOperationUseCase = new TypeOperationUseCase(sequelizeTypeOperationRepository);
    
    /*
    *   Iniciar controller
    */
    
    const typeOperationCtrl = new TypeOperationController(typeOperationUseCase, socketAdapter);
    
    /**
     * @swagger
     * /type-operations:
     *   get:
     *     tags:
     *       - Type Operations
     *     summary: Listar tipos de operación
     *     description: Retorna la lista de tipos de operación disponibles (compra, débito automático, extracción, etc.).
     *     security:
     *       - bearerAuth: []
     *     responses:
     *       200:
     *         description: Tipos de operaciones obtenidos exitosamente.
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
     *                   example: Tipos de operaciones retornados.
     *                 data:
     *                   type: array
     *                   items:
     *                     $ref: '#/components/schemas/TypeOperationEntity'
     *       400:
     *         description: Error al recuperar los tipos de operaciones.
     *         content:
     *           application/json:
     *             schema:
     *               $ref: '#/components/schemas/ErrorResponse'
     */
    app.get(`/${process.env.BASE_URL_API}/type-operations/:filter?/:page?/:perPage?`, typeOperationCtrl.getAllCtrl);

    /**
     * @swagger
     * /type-operation/{tyop_uuid}:
     *   get:
     *     tags:
     *       - Type Operations
     *     summary: Obtener detalle de tipo de operación
     *     description: Retorna la información de un tipo de operación por su UUID.
     *     security:
     *       - bearerAuth: []
     *     parameters:
     *       - in: path
     *         name: tyop_uuid
     *         required: true
     *         schema:
     *           type: string
     *           format: uuid
     *         description: UUID del tipo de operación
     *     responses:
     *       200:
     *         description: Detalle del tipo de operación obtenido exitosamente.
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
     *                   example: Tipo de operación retornado.
     *                 data:
     *                   $ref: '#/components/schemas/TypeOperationEntity'
     *       400:
     *         description: Error al recuperar el tipo de operación.
     *         content:
     *           application/json:
     *             schema:
     *               $ref: '#/components/schemas/ErrorResponse'
     */
    app.get(`/${process.env.BASE_URL_API}/type-operation/:tyop_uuid`, typeOperationCtrl.getCtrl);

    /**
     * @swagger
     * /type-operation:
     *   post:
     *     tags:
     *       - Type Operations
     *     summary: Crear tipo de operación
     *     description: Registra un nuevo tipo de operación en el catálogo.
     *     security:
     *       - bearerAuth: []
     *     requestBody:
     *       required: true
     *       content:
     *         application/json:
     *           schema:
     *             $ref: '#/components/schemas/TypeOperationInputDTO'
     *     responses:
     *       200:
     *         description: Tipo de operación insertado exitosamente.
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
     *                   example: Tipo de operación insertado.
     *                 data:
     *                   $ref: '#/components/schemas/TypeOperationEntity'
     *       400:
     *         description: Datos inválidos o el nombre ya existe.
     *         content:
     *           application/json:
     *             schema:
     *               $ref: '#/components/schemas/ErrorResponse'
     */
    app.post(`/${process.env.BASE_URL_API}/type-operation`, typeOperationCtrl.insertCtrl);

    /**
     * @swagger
     * /type-operation/{tyop_uuid}:
     *   put:
     *     tags:
     *       - Type Operations
     *     summary: Actualizar tipo de operación
     *     description: Modifica el nombre o descripción de un tipo de operación.
     *     security:
     *       - bearerAuth: []
     *     parameters:
     *       - in: path
     *         name: tyop_uuid
     *         required: true
     *         schema:
     *           type: string
     *           format: uuid
     *         description: UUID del tipo de operación
     *     requestBody:
     *       required: true
     *       content:
     *         application/json:
     *           schema:
     *             $ref: '#/components/schemas/TypeOperationInputDTO'
     *     responses:
     *       200:
     *         description: Tipo de operación actualizado exitosamente.
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
     *                   example: Tipo de operación actualizado.
     *                 data:
     *                   $ref: '#/components/schemas/TypeOperationEntity'
     *       400:
     *         description: Error al actualizar el tipo de operación.
     *         content:
     *           application/json:
     *             schema:
     *               $ref: '#/components/schemas/ErrorResponse'
     */
    app.put(`/${process.env.BASE_URL_API}/type-operation/:tyop_uuid`, typeOperationCtrl.updateCtrl);

    /**
     * @swagger
     * /type-operation/{tyop_uuid}:
     *   delete:
     *     tags:
     *       - Type Operations
     *     summary: Eliminar tipo de operación
     *     description: Elimina un tipo de operación del catálogo por su UUID.
     *     security:
     *       - bearerAuth: []
     *     parameters:
     *       - in: path
     *         name: tyop_uuid
     *         required: true
     *         schema:
     *           type: string
     *           format: uuid
     *         description: UUID del tipo de operación
     *     responses:
     *       200:
     *         description: Tipo de operación eliminado exitosamente.
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
     *                   example: Tipo de operación eliminado.
     *                 data:
     *                   $ref: '#/components/schemas/TypeOperationEntity'
     *       400:
     *         description: Error al eliminar el tipo de operación.
     *         content:
     *           application/json:
     *             schema:
     *               $ref: '#/components/schemas/ErrorResponse'
     */
    app.delete(`/${process.env.BASE_URL_API}/type-operation/:tyop_uuid`, typeOperationCtrl.deleteCtrl);
}

export default configureTypeOperationRoutes;