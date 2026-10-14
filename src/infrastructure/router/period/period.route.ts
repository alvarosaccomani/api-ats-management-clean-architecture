import { Express } from "express";
import { SequelizePeriodRepository } from "../../repository/period/sequelize-period.repository";
import { PeriodUseCase } from "../../../application/period/period-use-case";
import { PeriodController } from "../../controller/period/period.controller";
import SocketAdapter from "../../services/socketAdapter";

function configurePeriodRoutes(app: Express, socketAdapter: SocketAdapter) {
    /*
    *   Iniciar repository
    */
    
    const sequelizePeriodRepository = new SequelizePeriodRepository();
    
    /*
    *   Iniciar casos de uso
    */
    
    const periodUseCase = new PeriodUseCase(sequelizePeriodRepository);
    
    /*
    *   Iniciar controller
    */
    
    const periodCtrl = new PeriodController(periodUseCase, socketAdapter);
    
    /**
     * @swagger
     * /periods/{usr_uuid}/{crd_uuid}:
     *   get:
     *     tags:
     *       - Periods
     *     summary: Listar períodos de facturación de una tarjeta
     *     description: Retorna la lista de períodos (ciclos mensuales/resúmenes) asociados a la tarjeta y usuario.
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
     *         description: Períodos obtenidos exitosamente.
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
     *                   example: Períodos retornados.
     *                 data:
     *                   type: array
     *                   items:
     *                     $ref: '#/components/schemas/PeriodEntity'
     *       400:
     *         description: Error al recuperar los períodos.
     *         content:
     *           application/json:
     *             schema:
     *               $ref: '#/components/schemas/ErrorResponse'
     */
    app.get(`/${process.env.BASE_URL_API}/periods/:usr_uuid/:crd_uuid/:filter?/:page?/:perPage?`, periodCtrl.getAllCtrl);

    /**
     * @swagger
     * /period/{usr_uuid}/{crd_uuid}/{per_uuid}:
     *   get:
     *     tags:
     *       - Periods
     *     summary: Obtener detalle de período
     *     description: Retorna la información completa de un período de facturación.
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
     *       - in: path
     *         name: per_uuid
     *         required: true
     *         schema:
     *           type: string
     *           format: uuid
     *         description: UUID del período
     *     responses:
     *       200:
     *         description: Período retornado con éxito.
     *         content:
     *           application/json:
     *             schema:
     *               type: object
     *               properties:
     *                 success:
     *                   type: boolean
     *                   example: true
     *                 data:
     *                   $ref: '#/components/schemas/PeriodEntity'
     *       400:
     *         description: Error o período no encontrado.
     *         content:
     *           application/json:
     *             schema:
     *               $ref: '#/components/schemas/ErrorResponse'
     */
    app.get(`/${process.env.BASE_URL_API}/period/:usr_uuid/:crd_uuid/:per_uuid`, periodCtrl.getCtrl);

    /**
     * @swagger
     * /period:
     *   post:
     *     tags:
     *       - Periods
     *     summary: Crear período de facturación
     *     description: Abre un nuevo ciclo/período de facturación para la tarjeta.
     *     security:
     *       - bearerAuth: []
     *     requestBody:
     *       required: true
     *       content:
     *         application/json:
     *           schema:
     *             $ref: '#/components/schemas/PeriodInputDTO'
     *     responses:
     *       200:
     *         description: Período creado exitosamente.
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
     *                   example: Período insertado.
     *                 data:
     *                   $ref: '#/components/schemas/PeriodEntity'
     *       400:
     *         description: Error al insertar el período.
     *         content:
     *           application/json:
     *             schema:
     *               $ref: '#/components/schemas/ErrorResponse'
     */
    app.post(`/${process.env.BASE_URL_API}/period`, periodCtrl.insertCtrl);

    /**
     * @swagger
     * /period/{usr_uuid}/{crd_uuid}/{per_uuid}:
     *   put:
     *     tags:
     *       - Periods
     *     summary: Actualizar período
     *     description: Modifica fechas de cierre, vencimiento o estado de un período.
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
     *       - in: path
     *         name: per_uuid
     *         required: true
     *         schema:
     *           type: string
     *           format: uuid
     *         description: UUID del período
     *     requestBody:
     *       required: true
     *       content:
     *         application/json:
     *           schema:
     *             $ref: '#/components/schemas/PeriodUpdateDTO'
     *     responses:
     *       200:
     *         description: Período actualizado con éxito.
     *         content:
     *           application/json:
     *             schema:
     *               type: object
     *               properties:
     *                 success:
     *                   type: boolean
     *                   example: true
     *                 data:
     *                   $ref: '#/components/schemas/PeriodEntity'
     *       400:
     *         description: Error al actualizar el período.
     *         content:
     *           application/json:
     *             schema:
     *               $ref: '#/components/schemas/ErrorResponse'
     */
    app.put(`/${process.env.BASE_URL_API}/period/:usr_uuid/:crd_uuid/:per_uuid`, periodCtrl.updateCtrl);

    /**
     * @swagger
     * /period/{usr_uuid}/{crd_uuid}/{per_uuid}:
     *   delete:
     *     tags:
     *       - Periods
     *     summary: Eliminar período
     *     description: Da de baja un período de facturación.
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
     *       - in: path
     *         name: per_uuid
     *         required: true
     *         schema:
     *           type: string
     *           format: uuid
     *         description: UUID del período
     *     responses:
     *       200:
     *         description: Período eliminado.
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
     *                   example: Período eliminado.
     *       400:
     *         description: Error al eliminar el período.
     *         content:
     *           application/json:
     *             schema:
     *               $ref: '#/components/schemas/ErrorResponse'
     */
    app.delete(`/${process.env.BASE_URL_API}/period/:usr_uuid/:crd_uuid/:per_uuid`, periodCtrl.deleteCtrl);
}

export default configurePeriodRoutes;