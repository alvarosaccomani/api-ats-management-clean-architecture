import { Express } from "express";
import { SequelizeTypeCardRepository } from "../../repository/type-card/sequelize-type-card.repository";
import { TypeCardUseCase } from "../../../application/type-card/type-card-use-case";
import { TypeCardController } from "../../controller/type-card/type-card.controller";
import SocketAdapter from "../../services/socketAdapter";

function configureTypeCardRoutes(app: Express, socketAdapter: SocketAdapter) {
    /*
    *   Iniciar repository
    */
    
    const sequelizeTypeCardRepository = new SequelizeTypeCardRepository();
    
    /*
    *   Iniciar casos de uso
    */
    
    const typeCardUseCase = new TypeCardUseCase(sequelizeTypeCardRepository);
    
    /*
    *   Iniciar controller
    */
    
    const typeCardCtrl = new TypeCardController(typeCardUseCase, socketAdapter);
    
    /**
     * @swagger
     * /type-cards:
     *   get:
     *     tags:
     *       - Type Cards
     *     summary: Listar tipos de tarjetas
     *     description: Retorna la lista de tipos de tarjetas (Crédito, Débito, etc.).
     *     security:
     *       - bearerAuth: []
     *     responses:
     *       200:
     *         description: Tipos de tarjetas retornados exitosamente.
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
     *                     $ref: '#/components/schemas/TypeCardEntity'
     *       400:
     *         description: Error al recuperar los tipos de tarjetas.
     *         content:
     *           application/json:
     *             schema:
     *               $ref: '#/components/schemas/ErrorResponse'
     */
    app.get(`/${process.env.BASE_URL_API}/type-cards/:filter?/:page?/:perPage?`, typeCardCtrl.getAllCtrl);

    /**
     * @swagger
     * /type-card/{tycrd_uuid}:
     *   get:
     *     tags:
     *       - Type Cards
     *     summary: Obtener detalle de tipo de tarjeta
     *     description: Retorna la información de un tipo de tarjeta por su UUID.
     *     security:
     *       - bearerAuth: []
     *     parameters:
     *       - in: path
     *         name: tycrd_uuid
     *         required: true
     *         schema:
     *           type: string
     *           format: uuid
     *         description: UUID del tipo de tarjeta
     *     responses:
     *       200:
     *         description: Tipo de tarjeta retornado con éxito.
     *         content:
     *           application/json:
     *             schema:
     *               type: object
     *               properties:
     *                 success:
     *                   type: boolean
     *                   example: true
     *                 data:
     *                   $ref: '#/components/schemas/TypeCardEntity'
     *       400:
     *         description: Error o tipo de tarjeta no encontrado.
     *         content:
     *           application/json:
     *             schema:
     *               $ref: '#/components/schemas/ErrorResponse'
     */
    app.get(`/${process.env.BASE_URL_API}/type-card/:tycrd_uuid`, typeCardCtrl.getCtrl);

    /**
     * @swagger
     * /type-card:
     *   post:
     *     tags:
     *       - Type Cards
     *     summary: Crear tipo de tarjeta
     *     description: Registra un nuevo tipo de tarjeta en el sistema.
     *     security:
     *       - bearerAuth: []
     *     requestBody:
     *       required: true
     *       content:
     *         application/json:
     *           schema:
     *             $ref: '#/components/schemas/TypeCardInputDTO'
     *     responses:
     *       200:
     *         description: Tipo de tarjeta insertado exitosamente.
     *         content:
     *           application/json:
     *             schema:
     *               type: object
     *               properties:
     *                 success:
     *                   type: boolean
     *                   example: true
     *                 data:
     *                   $ref: '#/components/schemas/TypeCardEntity'
     *       400:
     *         description: Error al insertar el tipo de tarjeta.
     *         content:
     *           application/json:
     *             schema:
     *               $ref: '#/components/schemas/ErrorResponse'
     */
    app.post(`/${process.env.BASE_URL_API}/type-card`, typeCardCtrl.insertCtrl);

    /**
     * @swagger
     * /type-card/{tycrd_uuid}:
     *   put:
     *     tags:
     *       - Type Cards
     *     summary: Actualizar tipo de tarjeta
     *     description: Modifica los datos de un tipo de tarjeta existente.
     *     security:
     *       - bearerAuth: []
     *     parameters:
     *       - in: path
     *         name: tycrd_uuid
     *         required: true
     *         schema:
     *           type: string
     *           format: uuid
     *         description: UUID del tipo de tarjeta
     *     requestBody:
     *       required: true
     *       content:
     *         application/json:
     *           schema:
     *             $ref: '#/components/schemas/TypeCardInputDTO'
     *     responses:
     *       200:
     *         description: Tipo de tarjeta actualizado con éxito.
     *         content:
     *           application/json:
     *             schema:
     *               type: object
     *               properties:
     *                 success:
     *                   type: boolean
     *                   example: true
     *                 data:
     *                   $ref: '#/components/schemas/TypeCardEntity'
     *       400:
     *         description: Error al actualizar el tipo de tarjeta.
     *         content:
     *           application/json:
     *             schema:
     *               $ref: '#/components/schemas/ErrorResponse'
     */
    app.put(`/${process.env.BASE_URL_API}/type-card/:tycrd_uuid`, typeCardCtrl.updateCtrl);

    /**
     * @swagger
     * /type-card/{tycrd_uuid}:
     *   delete:
     *     tags:
     *       - Type Cards
     *     summary: Eliminar tipo de tarjeta
     *     description: Da de baja un tipo de tarjeta por su UUID.
     *     security:
     *       - bearerAuth: []
     *     parameters:
     *       - in: path
     *         name: tycrd_uuid
     *         required: true
     *         schema:
     *           type: string
     *           format: uuid
     *         description: UUID del tipo de tarjeta a eliminar
     *     responses:
     *       200:
     *         description: Tipo de tarjeta eliminado exitosamente.
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
     *                   example: Tipo de tarjeta eliminado.
     *       400:
     *         description: Error al eliminar el tipo de tarjeta.
     *         content:
     *           application/json:
     *             schema:
     *               $ref: '#/components/schemas/ErrorResponse'
     */
    app.delete(`/${process.env.BASE_URL_API}/type-card/:tycrd_uuid`, typeCardCtrl.deleteCtrl);
}

export default configureTypeCardRoutes;