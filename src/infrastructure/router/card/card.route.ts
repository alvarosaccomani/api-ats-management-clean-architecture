import { Express } from "express";
import { SequelizeCardRepository } from "../../repository/card/sequelize-card.repository";
import { CardUseCase } from "../../../application/card/card-use-case";
import { CardController } from "../../controller/card/card.controller";
import SocketAdapter from "../../services/socketAdapter";

function configureCardRoutes(app: Express, socketAdapter: SocketAdapter) {
    /*
    *   Iniciar repository
    */
    
    const sequelizeCardRepository = new SequelizeCardRepository();
    
    /*
    *   Iniciar casos de uso
    */
    
    const cardUseCase = new CardUseCase(sequelizeCardRepository);
    
    /*
    *   Iniciar controller
    */
    
    const cardCtrl = new CardController(cardUseCase, socketAdapter);
    
    /**
     * @swagger
     * /cards/{usr_uuid}:
     *   get:
     *     tags:
     *       - Cards
     *     summary: Listar tarjetas de un usuario
     *     description: Retorna la lista paginada o completa de tarjetas de crédito/débito vinculadas al usuario.
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
     *         description: Tarjetas retornadas exitosamente.
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
     *                   example: Tarjetas retornadas.
     *                 data:
     *                   type: array
     *                   items:
     *                     $ref: '#/components/schemas/CardEntity'
     *       400:
     *         description: Error al recuperar tarjetas.
     *         content:
     *           application/json:
     *             schema:
     *               $ref: '#/components/schemas/ErrorResponse'
     */
    app.get(`/${process.env.BASE_URL_API}/cards/:usr_uuid/:filter?/:page?/:perPage?`, cardCtrl.getAllCtrl);

    /**
     * @swagger
     * /card/{usr_uuid}/{crd_uuid}:
     *   get:
     *     tags:
     *       - Cards
     *     summary: Obtener detalle de tarjeta
     *     description: Retorna la información completa de una tarjeta por su UUID y usuario.
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
     *       - in: path
     *         name: crd_uuid
     *         required: true
     *         schema:
     *           type: string
     *           format: uuid
     *         description: UUID de la tarjeta
     *     responses:
     *       200:
     *         description: Tarjeta encontrada con éxito.
     *         content:
     *           application/json:
     *             schema:
     *               type: object
     *               properties:
     *                 success:
     *                   type: boolean
     *                   example: true
     *                 data:
     *                   $ref: '#/components/schemas/CardEntity'
     *       400:
     *         description: Error o tarjeta no encontrada.
     *         content:
     *           application/json:
     *             schema:
     *               $ref: '#/components/schemas/ErrorResponse'
     */
    app.get(`/${process.env.BASE_URL_API}/card/:usr_uuid/:crd_uuid`, cardCtrl.getCtrl);

    /**
     * @swagger
     * /card:
     *   post:
     *     tags:
     *       - Cards
     *     summary: Registrar una nueva tarjeta
     *     description: Vincula una nueva tarjeta con máscara, tipo, marca y banco al usuario.
     *     security:
     *       - bearerAuth: []
     *     requestBody:
     *       required: true
     *       content:
     *         application/json:
     *           schema:
     *             $ref: '#/components/schemas/CardInputDTO'
     *     responses:
     *       200:
     *         description: Tarjeta insertada exitosamente.
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
     *                   example: Tarjeta insertada.
     *                 data:
     *                   $ref: '#/components/schemas/CardEntity'
     *       400:
     *         description: Error al insertar la tarjeta.
     *         content:
     *           application/json:
     *             schema:
     *               $ref: '#/components/schemas/ErrorResponse'
     */
    app.post(`/${process.env.BASE_URL_API}/card`, cardCtrl.insertCtrl);

    /**
     * @swagger
     * /card/{usr_uuid}/{crd_uuid}:
     *   put:
     *     tags:
     *       - Cards
     *     summary: Actualizar tarjeta
     *     description: Modifica los parámetros de configuración de una tarjeta existente.
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
     *       - in: path
     *         name: crd_uuid
     *         required: true
     *         schema:
     *           type: string
     *           format: uuid
     *         description: UUID de la tarjeta
     *     requestBody:
     *       required: true
     *       content:
     *         application/json:
     *           schema:
     *             $ref: '#/components/schemas/CardUpdateDTO'
     *     responses:
     *       200:
     *         description: Tarjeta actualizada con éxito.
     *         content:
     *           application/json:
     *             schema:
     *               type: object
     *               properties:
     *                 success:
     *                   type: boolean
     *                   example: true
     *                 data:
     *                   $ref: '#/components/schemas/CardEntity'
     *       400:
     *         description: Error al actualizar la tarjeta.
     *         content:
     *           application/json:
     *             schema:
     *               $ref: '#/components/schemas/ErrorResponse'
     */
    app.put(`/${process.env.BASE_URL_API}/card/:usr_uuid/:crd_uuid`, cardCtrl.updateCtrl);

    /**
     * @swagger
     * /card/{usr_uuid}/{crd_uuid}:
     *   delete:
     *     tags:
     *       - Cards
     *     summary: Eliminar tarjeta
     *     description: Da de baja una tarjeta del usuario.
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
     *       - in: path
     *         name: crd_uuid
     *         required: true
     *         schema:
     *           type: string
     *           format: uuid
     *         description: UUID de la tarjeta
     *     responses:
     *       200:
     *         description: Tarjeta eliminada.
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
     *                   example: Tarjeta eliminada.
     *       400:
     *         description: Error al eliminar la tarjeta.
     *         content:
     *           application/json:
     *             schema:
     *               $ref: '#/components/schemas/ErrorResponse'
     */
    app.delete(`/${process.env.BASE_URL_API}/card/:usr_uuid/:crd_uuid`, cardCtrl.deleteCtrl);
}

export default configureCardRoutes;