import { Express } from "express";
import { SequelizeBrandCardRepository } from "../../repository/brand-card/sequelize-brand-card.repository";
import { BrandCardUseCase } from "../../../application/brand-card/brand-card-use-case";
import { BrandCardController } from "../../controller/brand-card/brand-card.controller";
import SocketAdapter from "../../services/socketAdapter";

function configureBrandCardRoutes(app: Express, socketAdapter: SocketAdapter) {
    /*
    *   Iniciar repository
    */
    
    const sequelizeBrandCardRepository = new SequelizeBrandCardRepository();
    
    /*
    *   Iniciar casos de uso
    */
    
    const brandCardUseCase = new BrandCardUseCase(sequelizeBrandCardRepository);
    
    /*
    *   Iniciar controller
    */
    
    const brandCardCtrl = new BrandCardController(brandCardUseCase, socketAdapter);
    
    /**
     * @swagger
     * /brand-cards:
     *   get:
     *     tags:
     *       - Brand Cards
     *     summary: Listar marcas de tarjetas
     *     description: Retorna la lista de marcas de tarjetas (Visa, Mastercard, etc.).
     *     security:
     *       - bearerAuth: []
     *     responses:
     *       200:
     *         description: Marcas de tarjetas retornadas con éxito.
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
     *                     $ref: '#/components/schemas/BrandCardEntity'
     *       400:
     *         description: Error al recuperar las marcas de tarjetas.
     *         content:
     *           application/json:
     *             schema:
     *               $ref: '#/components/schemas/ErrorResponse'
     */
    app.get(`/${process.env.BASE_URL_API}/brand-cards/:filter?/:page?/:perPage?`, brandCardCtrl.getAllCtrl);

    /**
     * @swagger
     * /brand-card/{brcrd_uuid}:
     *   get:
     *     tags:
     *       - Brand Cards
     *     summary: Obtener detalle de marca de tarjeta
     *     description: Retorna la información de una marca de tarjeta por su UUID.
     *     security:
     *       - bearerAuth: []
     *     parameters:
     *       - in: path
     *         name: brcrd_uuid
     *         required: true
     *         schema:
     *           type: string
     *           format: uuid
     *         description: UUID de la marca de tarjeta
     *     responses:
     *       200:
     *         description: Marca de tarjeta retornada.
     *         content:
     *           application/json:
     *             schema:
     *               type: object
     *               properties:
     *                 success:
     *                   type: boolean
     *                   example: true
     *                 data:
     *                   $ref: '#/components/schemas/BrandCardEntity'
     *       400:
     *         description: Error o marca no encontrada.
     *         content:
     *           application/json:
     *             schema:
     *               $ref: '#/components/schemas/ErrorResponse'
     */
    app.get(`/${process.env.BASE_URL_API}/brand-card/:brcrd_uuid`, brandCardCtrl.getCtrl);

    /**
     * @swagger
     * /brand-card:
     *   post:
     *     tags:
     *       - Brand Cards
     *     summary: Crear marca de tarjeta
     *     description: Registra una nueva marca de tarjeta en el sistema.
     *     security:
     *       - bearerAuth: []
     *     requestBody:
     *       required: true
     *       content:
     *         application/json:
     *           schema:
     *             $ref: '#/components/schemas/BrandCardInputDTO'
     *     responses:
     *       200:
     *         description: Marca de tarjeta insertada con éxito.
     *         content:
     *           application/json:
     *             schema:
     *               type: object
     *               properties:
     *                 success:
     *                   type: boolean
     *                   example: true
     *                 data:
     *                   $ref: '#/components/schemas/BrandCardEntity'
     *       400:
     *         description: Error al insertar la marca de tarjeta.
     *         content:
     *           application/json:
     *             schema:
     *               $ref: '#/components/schemas/ErrorResponse'
     */
    app.post(`/${process.env.BASE_URL_API}/brand-card`, brandCardCtrl.insertCtrl);

    /**
     * @swagger
     * /brand-card/{brcrd_uuid}:
     *   put:
     *     tags:
     *       - Brand Cards
     *     summary: Actualizar marca de tarjeta
     *     description: Modifica los datos de una marca de tarjeta existente.
     *     security:
     *       - bearerAuth: []
     *     parameters:
     *       - in: path
     *         name: brcrd_uuid
     *         required: true
     *         schema:
     *           type: string
     *           format: uuid
     *         description: UUID de la marca de tarjeta
     *     requestBody:
     *       required: true
     *       content:
     *         application/json:
     *           schema:
     *             $ref: '#/components/schemas/BrandCardInputDTO'
     *     responses:
     *       200:
     *         description: Marca de tarjeta actualizada.
     *         content:
     *           application/json:
     *             schema:
     *               type: object
     *               properties:
     *                 success:
     *                   type: boolean
     *                   example: true
     *                 data:
     *                   $ref: '#/components/schemas/BrandCardEntity'
     *       400:
     *         description: Error al actualizar la marca de tarjeta.
     *         content:
     *           application/json:
     *             schema:
     *               $ref: '#/components/schemas/ErrorResponse'
     */
    app.put(`/${process.env.BASE_URL_API}/brand-card/:brcrd_uuid`, brandCardCtrl.updateCtrl);

    /**
     * @swagger
     * /brand-card/{brcrd_uuid}:
     *   delete:
     *     tags:
     *       - Brand Cards
     *     summary: Eliminar marca de tarjeta
     *     description: Da de baja una marca de tarjeta del sistema.
     *     security:
     *       - bearerAuth: []
     *     parameters:
     *       - in: path
     *         name: brcrd_uuid
     *         required: true
     *         schema:
     *           type: string
     *           format: uuid
     *         description: UUID de la marca de tarjeta a eliminar
     *     responses:
     *       200:
     *         description: Marca de tarjeta eliminada.
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
     *                   example: Marca de tarjeta eliminada.
     *       400:
     *         description: Error al eliminar la marca de tarjeta.
     *         content:
     *           application/json:
     *             schema:
     *               $ref: '#/components/schemas/ErrorResponse'
     */
    app.delete(`/${process.env.BASE_URL_API}/brand-card/:brcrd_uuid`, brandCardCtrl.deleteCtrl);
}

export default configureBrandCardRoutes;