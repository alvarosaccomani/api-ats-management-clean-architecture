import { Express } from "express";
import { SequelizePaymentMethodRepository } from "../../repository/payment-method/sequelize-payment-method.repository";
import { PaymentMethodUseCase } from "../../../application/payment-method/payment-method-use-case";
import { PaymentMethodController } from "../../controller/payment-method/payment-method.controller";
import SocketAdapter from "../../services/socketAdapter";

function configurePaymentMethodRoutes(app: Express, socketAdapter: SocketAdapter) {
    /*
    *   Iniciar repository
    */
    
    const sequelizePaymentMethodRepository = new SequelizePaymentMethodRepository();
    
    /*
    *   Iniciar casos de uso
    */
    
    const paymentMethodUseCase = new PaymentMethodUseCase(sequelizePaymentMethodRepository);
    
    /*
    *   Iniciar controller
    */
    
    const paymentMethodCtrl = new PaymentMethodController(paymentMethodUseCase, socketAdapter);
    
    /**
     * @swagger
     * /payment-methods:
     *   get:
     *     tags:
     *       - Payment Methods
     *     summary: Listar medios de pago
     *     description: Retorna la lista de medios de pago disponibles (Transferencia, QR, Efectivo, etc.).
     *     security:
     *       - bearerAuth: []
     *     responses:
     *       200:
     *         description: Medios de pago retornados exitosamente.
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
     *                     $ref: '#/components/schemas/PaymentMethodEntity'
     *       400:
     *         description: Error al recuperar los medios de pago.
     *         content:
     *           application/json:
     *             schema:
     *               $ref: '#/components/schemas/ErrorResponse'
     */
    app.get(`/${process.env.BASE_URL_API}/payment-methods/:filter?/:page?/:perPage?`, paymentMethodCtrl.getAllCtrl);

    /**
     * @swagger
     * /payment-method/{paym_uuid}:
     *   get:
     *     tags:
     *       - Payment Methods
     *     summary: Obtener detalle de medio de pago
     *     description: Retorna la información de un medio de pago por su UUID.
     *     security:
     *       - bearerAuth: []
     *     parameters:
     *       - in: path
     *         name: paym_uuid
     *         required: true
     *         schema:
     *           type: string
     *           format: uuid
     *         description: UUID del medio de pago
     *     responses:
     *       200:
     *         description: Medio de pago retornado con éxito.
     *         content:
     *           application/json:
     *             schema:
     *               type: object
     *               properties:
     *                 success:
     *                   type: boolean
     *                   example: true
     *                 data:
     *                   $ref: '#/components/schemas/PaymentMethodEntity'
     *       400:
     *         description: Error o medio de pago no encontrado.
     *         content:
     *           application/json:
     *             schema:
     *               $ref: '#/components/schemas/ErrorResponse'
     */
    app.get(`/${process.env.BASE_URL_API}/payment-method/:paym_uuid`, paymentMethodCtrl.getCtrl);

    /**
     * @swagger
     * /payment-method:
     *   post:
     *     tags:
     *       - Payment Methods
     *     summary: Crear medio de pago
     *     description: Registra un nuevo medio de pago en el catálogo.
     *     security:
     *       - bearerAuth: []
     *     requestBody:
     *       required: true
     *       content:
     *         application/json:
     *           schema:
     *             $ref: '#/components/schemas/PaymentMethodInputDTO'
     *     responses:
     *       200:
     *         description: Medio de pago insertado exitosamente.
     *         content:
     *           application/json:
     *             schema:
     *               type: object
     *               properties:
     *                 success:
     *                   type: boolean
     *                   example: true
     *                 data:
     *                   $ref: '#/components/schemas/PaymentMethodEntity'
     *       400:
     *         description: Error al insertar el medio de pago.
     *         content:
     *           application/json:
     *             schema:
     *               $ref: '#/components/schemas/ErrorResponse'
     */
    app.post(`/${process.env.BASE_URL_API}/payment-method`, paymentMethodCtrl.insertCtrl);

    /**
     * @swagger
     * /payment-method/{paym_uuid}:
     *   put:
     *     tags:
     *       - Payment Methods
     *     summary: Actualizar medio de pago
     *     description: Modifica los datos de un medio de pago existente.
     *     security:
     *       - bearerAuth: []
     *     parameters:
     *       - in: path
     *         name: paym_uuid
     *         required: true
     *         schema:
     *           type: string
     *           format: uuid
     *         description: UUID del medio de pago
     *     requestBody:
     *       required: true
     *       content:
     *         application/json:
     *           schema:
     *             $ref: '#/components/schemas/PaymentMethodInputDTO'
     *     responses:
     *       200:
     *         description: Medio de pago actualizado con éxito.
     *         content:
     *           application/json:
     *             schema:
     *               type: object
     *               properties:
     *                 success:
     *                   type: boolean
     *                   example: true
     *                 data:
     *                   $ref: '#/components/schemas/PaymentMethodEntity'
     *       400:
     *         description: Error al actualizar el medio de pago.
     *         content:
     *           application/json:
     *             schema:
     *               $ref: '#/components/schemas/ErrorResponse'
     */
    app.put(`/${process.env.BASE_URL_API}/payment-method/:paym_uuid`, paymentMethodCtrl.updateCtrl);

    /**
     * @swagger
     * /payment-method/{paym_uuid}:
     *   delete:
     *     tags:
     *       - Payment Methods
     *     summary: Eliminar medio de pago
     *     description: Da de baja un medio de pago del sistema.
     *     security:
     *       - bearerAuth: []
     *     parameters:
     *       - in: path
     *         name: paym_uuid
     *         required: true
     *         schema:
     *           type: string
     *           format: uuid
     *         description: UUID del medio de pago a eliminar
     *     responses:
     *       200:
     *         description: Medio de pago eliminado.
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
     *                   example: Medio de pago eliminado.
     *       400:
     *         description: Error al eliminar el medio de pago.
     *         content:
     *           application/json:
     *             schema:
     *               $ref: '#/components/schemas/ErrorResponse'
     */
    app.delete(`/${process.env.BASE_URL_API}/payment-method/:paym_uuid`, paymentMethodCtrl.deleteCtrl);
}

export default configurePaymentMethodRoutes;