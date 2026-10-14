import { Express } from "express";
import { SequelizePaymentPeriodStatusRepository } from "../../repository/payment-period-status/sequelize-payment-period-status.repository";
import { PaymentPeriodStatusUseCase } from "../../../application/payment-period-status/payment-period-status-use-case";
import { PaymentPeriodStatusController } from "../../controller/payment-period-status/payment-period-status.controller";
import SocketAdapter from "../../services/socketAdapter";

function configurePaymentPeriodStatusRoutes(app: Express, socketAdapter: SocketAdapter) {
    /*
    *   Iniciar repository
    */
    
    const sequelizePaymentPeriodStatusRepository = new SequelizePaymentPeriodStatusRepository();
    
    /*
    *   Iniciar casos de uso
    */
    
    const paymentPeriodStatusUseCase = new PaymentPeriodStatusUseCase(sequelizePaymentPeriodStatusRepository);
    
    /*
    *   Iniciar controller
    */
    
    const paymentPeriodStatusCtrl = new PaymentPeriodStatusController(paymentPeriodStatusUseCase, socketAdapter);
    
    /**
     * @swagger
     * /payment-period-statuses:
     *   get:
     *     tags:
     *       - Payment Period Statuses
     *     summary: Listar estados de pago de período
     *     description: Retorna la lista de estados posibles para los pagos de período (Pendiente, Confirmado, Rechazado, etc.).
     *     security:
     *       - bearerAuth: []
     *     responses:
     *       200:
     *         description: Estados de pago de período obtenidos exitosamente.
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
     *                   example: Estados de pago de período retornados.
     *                 data:
     *                   type: array
     *                   items:
     *                     $ref: '#/components/schemas/PaymentPeriodStatusEntity'
     *       400:
     *         description: Error al recuperar los estados de pago de período.
     *         content:
     *           application/json:
     *             schema:
     *               $ref: '#/components/schemas/ErrorResponse'
     */
    app.get(`/${process.env.BASE_URL_API}/payment-period-statuses/:filter?/:page?/:perPage?`, paymentPeriodStatusCtrl.getAllCtrl);

    /**
     * @swagger
     * /payment-period-status/{payps_uuid}:
     *   get:
     *     tags:
     *       - Payment Period Statuses
     *     summary: Obtener detalle de estado de pago de período
     *     description: Retorna la información de un estado de pago de período por su UUID.
     *     security:
     *       - bearerAuth: []
     *     parameters:
     *       - in: path
     *         name: payps_uuid
     *         required: true
     *         schema:
     *           type: string
     *           format: uuid
     *         description: UUID del estado de pago de período
     *     responses:
     *       200:
     *         description: Detalle del estado de pago de período obtenido exitosamente.
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
     *                   example: Estado de pago de período retornado.
     *                 data:
     *                   $ref: '#/components/schemas/PaymentPeriodStatusEntity'
     *       400:
     *         description: Error al recuperar el estado de pago de período.
     *         content:
     *           application/json:
     *             schema:
     *               $ref: '#/components/schemas/ErrorResponse'
     */
    app.get(`/${process.env.BASE_URL_API}/payment-period-status/:payps_uuid`, paymentPeriodStatusCtrl.getCtrl);

    /**
     * @swagger
     * /payment-period-status:
     *   post:
     *     tags:
     *       - Payment Period Statuses
     *     summary: Crear estado de pago de período
     *     description: Registra un nuevo estado para clasificar los pagos de período.
     *     security:
     *       - bearerAuth: []
     *     requestBody:
     *       required: true
     *       content:
     *         application/json:
     *           schema:
     *             $ref: '#/components/schemas/PaymentPeriodStatusInputDTO'
     *     responses:
     *       200:
     *         description: Estado de pago de período insertado exitosamente.
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
     *                   example: Estado de pago de período insertado.
     *                 data:
     *                   $ref: '#/components/schemas/PaymentPeriodStatusEntity'
     *       400:
     *         description: Datos inválidos o el nombre ya existe.
     *         content:
     *           application/json:
     *             schema:
     *               $ref: '#/components/schemas/ErrorResponse'
     */
    app.post(`/${process.env.BASE_URL_API}/payment-period-status`, paymentPeriodStatusCtrl.insertCtrl);

    /**
     * @swagger
     * /payment-period-status/{payps_uuid}:
     *   put:
     *     tags:
     *       - Payment Period Statuses
     *     summary: Actualizar estado de pago de período
     *     description: Modifica el nombre o descripción de un estado de pago de período existente.
     *     security:
     *       - bearerAuth: []
     *     parameters:
     *       - in: path
     *         name: payps_uuid
     *         required: true
     *         schema:
     *           type: string
     *           format: uuid
     *         description: UUID del estado de pago de período
     *     requestBody:
     *       required: true
     *       content:
     *         application/json:
     *           schema:
     *             $ref: '#/components/schemas/PaymentPeriodStatusInputDTO'
     *     responses:
     *       200:
     *         description: Estado de pago de período actualizado exitosamente.
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
     *                   example: Estado de pago de período actualizado.
     *                 data:
     *                   $ref: '#/components/schemas/PaymentPeriodStatusEntity'
     *       400:
     *         description: Error al actualizar el estado de pago de período.
     *         content:
     *           application/json:
     *             schema:
     *               $ref: '#/components/schemas/ErrorResponse'
     */
    app.put(`/${process.env.BASE_URL_API}/payment-period-status/:payps_uuid`, paymentPeriodStatusCtrl.updateCtrl);

    /**
     * @swagger
     * /payment-period-status/{payps_uuid}:
     *   delete:
     *     tags:
     *       - Payment Period Statuses
     *     summary: Eliminar estado de pago de período
     *     description: Elimina un estado de pago de período del sistema.
     *     security:
     *       - bearerAuth: []
     *     parameters:
     *       - in: path
     *         name: payps_uuid
     *         required: true
     *         schema:
     *           type: string
     *           format: uuid
     *         description: UUID del estado de pago de período
     *     responses:
     *       200:
     *         description: Estado de pago de período eliminado exitosamente.
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
     *                   example: Estado de pago de período eliminado.
     *                 data:
     *                   $ref: '#/components/schemas/PaymentPeriodStatusEntity'
     *       400:
     *         description: Error al eliminar el estado de pago de período.
     *         content:
     *           application/json:
     *             schema:
     *               $ref: '#/components/schemas/ErrorResponse'
     */
    app.delete(`/${process.env.BASE_URL_API}/payment-period-status/:payps_uuid`, paymentPeriodStatusCtrl.deleteCtrl);
}

export default configurePaymentPeriodStatusRoutes;