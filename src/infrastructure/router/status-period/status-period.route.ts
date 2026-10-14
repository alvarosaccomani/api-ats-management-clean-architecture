import { Express } from "express";
import { SequelizeStatusPeriodRepository } from "../../repository/status-period/sequelize-status-period.repository";
import { StatusPeriodUseCase } from "../../../application/status-period/status-period-use-case";
import { StatusPeriodController } from "../../controller/status-period/status-period.controller";
import SocketAdapter from "../../services/socketAdapter";

function configureStatusPeriodRoutes(app: Express, socketAdapter: SocketAdapter) {
    /*
    *   Iniciar repository
    */
    
    const sequelizeStatusPeriodRepository = new SequelizeStatusPeriodRepository();
    
    /*
    *   Iniciar casos de uso
    */
    
    const statusPeriodUseCase = new StatusPeriodUseCase(sequelizeStatusPeriodRepository);
    
    /*
    *   Iniciar controller
    */
    
    const statusPeriodCtrl = new StatusPeriodController(statusPeriodUseCase, socketAdapter);
    
    /**
     * @swagger
     * /status-periods:
     *   get:
     *     tags:
     *       - Status Periods
     *     summary: Listar estados de período
     *     description: Retorna la lista de estados para períodos (Abierto, Cerrado, En mora, etc.).
     *     security:
     *       - bearerAuth: []
     *     responses:
     *       200:
     *         description: Estados de período obtenidos exitosamente.
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
     *                     $ref: '#/components/schemas/StatusPeriodEntity'
     *       400:
     *         description: Error al recuperar los estados de período.
     *         content:
     *           application/json:
     *             schema:
     *               $ref: '#/components/schemas/ErrorResponse'
     */
    app.get(`/${process.env.BASE_URL_API}/status-periods/:filter?/:page?/:perPage?`, statusPeriodCtrl.getAllCtrl);

    /**
     * @swagger
     * /status-period/{sper_uuid}:
     *   get:
     *     tags:
     *       - Status Periods
     *     summary: Obtener detalle de estado de período
     *     description: Retorna la información de un estado por su UUID.
     *     security:
     *       - bearerAuth: []
     *     parameters:
     *       - in: path
     *         name: sper_uuid
     *         required: true
     *         schema:
     *           type: string
     *           format: uuid
     *         description: UUID del estado de período
     *     responses:
     *       200:
     *         description: Estado de período retornado con éxito.
     *         content:
     *           application/json:
     *             schema:
     *               type: object
     *               properties:
     *                 success:
     *                   type: boolean
     *                   example: true
     *                 data:
     *                   $ref: '#/components/schemas/StatusPeriodEntity'
     *       400:
     *         description: Error o estado no encontrado.
     *         content:
     *           application/json:
     *             schema:
     *               $ref: '#/components/schemas/ErrorResponse'
     */
    app.get(`/${process.env.BASE_URL_API}/status-period/:sper_uuid`, statusPeriodCtrl.getCtrl);

    /**
     * @swagger
     * /status-period:
     *   post:
     *     tags:
     *       - Status Periods
     *     summary: Crear estado de período
     *     description: Registra un nuevo estado para los ciclos de facturación.
     *     security:
     *       - bearerAuth: []
     *     requestBody:
     *       required: true
     *       content:
     *         application/json:
     *           schema:
     *             $ref: '#/components/schemas/StatusPeriodInputDTO'
     *     responses:
     *       200:
     *         description: Estado de período insertado exitosamente.
     *         content:
     *           application/json:
     *             schema:
     *               type: object
     *               properties:
     *                 success:
     *                   type: boolean
     *                   example: true
     *                 data:
     *                   $ref: '#/components/schemas/StatusPeriodEntity'
     *       400:
     *         description: Error al insertar el estado de período.
     *         content:
     *           application/json:
     *             schema:
     *               $ref: '#/components/schemas/ErrorResponse'
     */
    app.post(`/${process.env.BASE_URL_API}/status-period`, statusPeriodCtrl.insertCtrl);

    /**
     * @swagger
     * /status-period/{sper_uuid}:
     *   put:
     *     tags:
     *       - Status Periods
     *     summary: Actualizar estado de período
     *     description: Modifica los atributos de un estado de período existente.
     *     security:
     *       - bearerAuth: []
     *     parameters:
     *       - in: path
     *         name: sper_uuid
     *         required: true
     *         schema:
     *           type: string
     *           format: uuid
     *         description: UUID del estado de período a actualizar
     *     requestBody:
     *       required: true
     *       content:
     *         application/json:
     *           schema:
     *             $ref: '#/components/schemas/StatusPeriodInputDTO'
     *     responses:
     *       200:
     *         description: Estado de período actualizado.
     *         content:
     *           application/json:
     *             schema:
     *               type: object
     *               properties:
     *                 success:
     *                   type: boolean
     *                   example: true
     *                 data:
     *                   $ref: '#/components/schemas/StatusPeriodEntity'
     *       400:
     *         description: Error al actualizar el estado de período.
     *         content:
     *           application/json:
     *             schema:
     *               $ref: '#/components/schemas/ErrorResponse'
     */
    app.put(`/${process.env.BASE_URL_API}/status-period/:sper_uuid`, statusPeriodCtrl.updateCtrl);

    /**
     * @swagger
     * /status-period/{sper_uuid}:
     *   delete:
     *     tags:
     *       - Status Periods
     *     summary: Eliminar estado de período
     *     description: Da de baja un estado de período por su UUID.
     *     security:
     *       - bearerAuth: []
     *     parameters:
     *       - in: path
     *         name: sper_uuid
     *         required: true
     *         schema:
     *           type: string
     *           format: uuid
     *         description: UUID del estado a eliminar
     *     responses:
     *       200:
     *         description: Estado de período eliminado.
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
     *                   example: Estado de período eliminado.
     *       400:
     *         description: Error al eliminar el estado de período.
     *         content:
     *           application/json:
     *             schema:
     *               $ref: '#/components/schemas/ErrorResponse'
     */
    app.delete(`/${process.env.BASE_URL_API}/status-period/:sper_uuid`, statusPeriodCtrl.deleteCtrl);
}

export default configureStatusPeriodRoutes;