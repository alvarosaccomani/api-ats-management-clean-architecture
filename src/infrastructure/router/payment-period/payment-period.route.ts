import { Express } from "express";
import { SequelizePaymentPeriodRepository } from "../../repository/payment-period/sequelize-payment-period.repository";
import { PaymentPeriodUseCase } from "../../../application/payment-period/payment-period-use-case";
import { PaymentPeriodController } from "../../controller/payment-period/payment-period.controller";
import SocketAdapter from "../../services/socketAdapter";

function configurePaymentPeriodRoutes(app: Express, socketAdapter: SocketAdapter) {
    /*
    *   Iniciar repository
    */
    
    const sequelizePaymentPeriodRepository = new SequelizePaymentPeriodRepository();
    
    /*
    *   Iniciar casos de uso
    */
    
    const paymentPeriodUseCase = new PaymentPeriodUseCase(sequelizePaymentPeriodRepository);
    
    /*
    *   Iniciar controller
    */
    
    const paymentPeriodCtrl = new PaymentPeriodController(paymentPeriodUseCase, socketAdapter);
    
    /**
     * @swagger
     * /payment-periods/{usr_uuid}/{crd_uuid}/{per_uuid}:
     *   get:
     *     tags:
     *       - Payment Periods
     *     summary: Listar pagos de un período
     *     description: Retorna la lista de pagos efectuados para un período específico de una tarjeta y usuario.
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
     *         description: Pagos de período obtenidos exitosamente.
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
     *                   example: Pagos de período retornados.
     *                 data:
     *                   type: array
     *                   items:
     *                     $ref: '#/components/schemas/PaymentPeriodEntity'
     *       400:
     *         description: Error al recuperar los pagos de período.
     *         content:
     *           application/json:
     *             schema:
     *               $ref: '#/components/schemas/ErrorResponse'
     */
    app.get(`/${process.env.BASE_URL_API}/payment-periods/:usr_uuid/:crd_uuid/:per_uuid/:filter?/:page?/:perPage?`, paymentPeriodCtrl.getAllCtrl);

    /**
     * @swagger
     * /payment-period/{usr_uuid}/{crd_uuid}/{per_uuid}/{payp_uuid}:
     *   get:
     *     tags:
     *       - Payment Periods
     *     summary: Obtener detalle de pago de período
     *     description: Retorna la información detallada de un pago registrado en un período.
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
     *       - in: path
     *         name: payp_uuid
     *         required: true
     *         schema:
     *           type: string
     *           format: uuid
     *         description: UUID del pago de período
     *     responses:
     *       200:
     *         description: Detalle del pago de período obtenido exitosamente.
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
     *                   example: Pago de período retornado.
     *                 data:
     *                   $ref: '#/components/schemas/PaymentPeriodEntity'
     *       400:
     *         description: Error al recuperar el pago de período.
     *         content:
     *           application/json:
     *             schema:
     *               $ref: '#/components/schemas/ErrorResponse'
     */
    app.get(`/${process.env.BASE_URL_API}/payment-period/:usr_uuid/:crd_uuid/:per_uuid/:payp_uuid`, paymentPeriodCtrl.getCtrl);

    /**
     * @swagger
     * /payment-period:
     *   post:
     *     tags:
     *       - Payment Periods
     *     summary: Registrar nuevo pago de período
     *     description: Crea un nuevo pago imputado al período de facturación especificado.
     *     security:
     *       - bearerAuth: []
     *     requestBody:
     *       required: true
     *       content:
     *         application/json:
     *           schema:
     *             $ref: '#/components/schemas/PaymentPeriodInputDTO'
     *     responses:
     *       200:
     *         description: Pago de período insertado exitosamente.
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
     *                   example: Pago de período insertado.
     *                 data:
     *                   $ref: '#/components/schemas/PaymentPeriodEntity'
     *       400:
     *         description: Datos inválidos o faltantes.
     *         content:
     *           application/json:
     *             schema:
     *               $ref: '#/components/schemas/ErrorResponse'
     */
    app.post(`/${process.env.BASE_URL_API}/payment-period`, paymentPeriodCtrl.insertCtrl);

    /**
     * @swagger
     * /payment-period/{usr_uuid}/{crd_uuid}/{per_uuid}/{payp_uuid}:
     *   put:
     *     tags:
     *       - Payment Periods
     *     summary: Actualizar pago de período
     *     description: Modifica los datos de un pago registrado en un período.
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
     *       - in: path
     *         name: payp_uuid
     *         required: true
     *         schema:
     *           type: string
     *           format: uuid
     *         description: UUID del pago de período
     *     requestBody:
     *       required: true
     *       content:
     *         application/json:
     *           schema:
     *             $ref: '#/components/schemas/PaymentPeriodUpdateDTO'
     *     responses:
     *       200:
     *         description: Pago de período actualizado exitosamente.
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
     *                   example: Pago de período actualizado.
     *                 data:
     *                   $ref: '#/components/schemas/PaymentPeriodEntity'
     *       400:
     *         description: Error al actualizar el pago de período.
     *         content:
     *           application/json:
     *             schema:
     *               $ref: '#/components/schemas/ErrorResponse'
     */
    app.put(`/${process.env.BASE_URL_API}/payment-period/:usr_uuid/:crd_uuid/:per_uuid/:payp_uuid`, paymentPeriodCtrl.updateCtrl);

    /**
     * @swagger
     * /payment-period/{usr_uuid}/{crd_uuid}/{per_uuid}/{payp_uuid}:
     *   delete:
     *     tags:
     *       - Payment Periods
     *     summary: Eliminar pago de período
     *     description: Elimina un pago registrado de un período de facturación.
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
     *       - in: path
     *         name: payp_uuid
     *         required: true
     *         schema:
     *           type: string
     *           format: uuid
     *         description: UUID del pago de período
     *     responses:
     *       200:
     *         description: Pago de período eliminado exitosamente.
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
     *                   example: Pago de período eliminado.
     *                 data:
     *                   $ref: '#/components/schemas/PaymentPeriodEntity'
     *       400:
     *         description: Error al eliminar el pago de período.
     *         content:
     *           application/json:
     *             schema:
     *               $ref: '#/components/schemas/ErrorResponse'
     */
    app.delete(`/${process.env.BASE_URL_API}/payment-period/:usr_uuid/:crd_uuid/:per_uuid/:payp_uuid`, paymentPeriodCtrl.deleteCtrl);
}

export default configurePaymentPeriodRoutes;