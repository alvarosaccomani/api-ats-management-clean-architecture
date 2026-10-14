import { Express } from "express";
import { SequelizePendingVoucherRepository } from "../../repository/pending-voucher/sequelize-pending-voucher.repository";
import { PendingVoucherUseCase } from "../../../application/pending-voucher/pending-voucher-use-case";
import { PendingVoucherController } from "../../controller/pending-voucher/pending-voucher.controller";
import SocketAdapter from "../../services/socketAdapter";

function configurePendingVoucherRoutes(app: Express, socketAdapter: SocketAdapter) {
    /*
    *   Iniciar repository
    */
    
    const sequelizePendingVoucherRepository = new SequelizePendingVoucherRepository();
    
    /*
    *   Iniciar casos de uso
    */
    
    const pendingVoucherUseCase = new PendingVoucherUseCase(sequelizePendingVoucherRepository);
    
    /*
    *   Iniciar controller
    */
    
    const pendingVoucherCtrl = new PendingVoucherController(pendingVoucherUseCase, socketAdapter);
    
    /**
     * @swagger
     * /pending-vouchers/{usr_uuid}:
     *   get:
     *     tags:
     *       - Pending Vouchers
     *     summary: Listar vouchers pendientes de procesamiento
     *     description: Retorna la lista de comprobantes escaneados o pendientes de confirmación del usuario.
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
     *         description: Vouchers pendientes obtenidos exitosamente.
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
     *                     $ref: '#/components/schemas/PendingVoucherEntity'
     *       400:
     *         description: Error al recuperar los vouchers pendientes.
     *         content:
     *           application/json:
     *             schema:
     *               $ref: '#/components/schemas/ErrorResponse'
     */
    app.get(`/${process.env.BASE_URL_API}/pending-vouchers/:usr_uuid/:filter?/:page?/:perPage?`, pendingVoucherCtrl.getAllCtrl);

    /**
     * @swagger
     * /pending-voucher/{usr_uuid}/{pevou_uuid}:
     *   get:
     *     tags:
     *       - Pending Vouchers
     *     summary: Obtener detalle de voucher pendiente
     *     description: Retorna la información de un cupón pendiente por su identificador.
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
     *         name: pevou_uuid
     *         required: true
     *         schema:
     *           type: string
     *           format: uuid
     *         description: UUID del voucher pendiente
     *     responses:
     *       200:
     *         description: Voucher pendiente encontrado con éxito.
     *         content:
     *           application/json:
     *             schema:
     *               type: object
     *               properties:
     *                 success:
     *                   type: boolean
     *                   example: true
     *                 data:
     *                   $ref: '#/components/schemas/PendingVoucherEntity'
     *       400:
     *         description: Error o voucher pendiente no encontrado.
     *         content:
     *           application/json:
     *             schema:
     *               $ref: '#/components/schemas/ErrorResponse'
     */
    app.get(`/${process.env.BASE_URL_API}/pending-voucher/:usr_uuid/:pevou_uuid`, pendingVoucherCtrl.getCtrl);

    /**
     * @swagger
     * /pending-voucher:
     *   post:
     *     tags:
     *       - Pending Vouchers
     *     summary: Crear voucher pendiente
     *     description: Guarda una imagen o captura escaneada de un comprobante para su posterior procesamiento.
     *     security:
     *       - bearerAuth: []
     *     requestBody:
     *       required: true
     *       content:
     *         application/json:
     *           schema:
     *             $ref: '#/components/schemas/PendingVoucherInputDTO'
     *     responses:
     *       200:
     *         description: Voucher pendiente guardado exitosamente.
     *         content:
     *           application/json:
     *             schema:
     *               type: object
     *               properties:
     *                 success:
     *                   type: boolean
     *                   example: true
     *                 data:
     *                   $ref: '#/components/schemas/PendingVoucherEntity'
     *       400:
     *         description: Error al guardar el voucher pendiente.
     *         content:
     *           application/json:
     *             schema:
     *               $ref: '#/components/schemas/ErrorResponse'
     */
    app.post(`/${process.env.BASE_URL_API}/pending-voucher`, pendingVoucherCtrl.insertCtrl);

    /**
     * @swagger
     * /pending-voucher/{usr_uuid}/{pevou_uuid}:
     *   put:
     *     tags:
     *       - Pending Vouchers
     *     summary: Actualizar voucher pendiente
     *     description: Modifica los datos o estado OCR de un voucher pendiente.
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
     *         name: pevou_uuid
     *         required: true
     *         schema:
     *           type: string
     *           format: uuid
     *         description: UUID del voucher pendiente
     *     requestBody:
     *       required: true
     *       content:
     *         application/json:
     *           schema:
     *             $ref: '#/components/schemas/PendingVoucherUpdateDTO'
     *     responses:
     *       200:
     *         description: Voucher pendiente actualizado exitosamente.
     *         content:
     *           application/json:
     *             schema:
     *               type: object
     *               properties:
     *                 success:
     *                   type: boolean
     *                   example: true
     *                 data:
     *                   $ref: '#/components/schemas/PendingVoucherEntity'
     *       400:
     *         description: Error al actualizar el voucher pendiente.
     *         content:
     *           application/json:
     *             schema:
     *               $ref: '#/components/schemas/ErrorResponse'
     */
    app.put(`/${process.env.BASE_URL_API}/pending-voucher/:usr_uuid/:pevou_uuid`, pendingVoucherCtrl.updateCtrl);

    /**
     * @swagger
     * /pending-voucher/{usr_uuid}/{pevou_uuid}:
     *   delete:
     *     tags:
     *       - Pending Vouchers
     *     summary: Eliminar voucher pendiente
     *     description: Da de baja un voucher pendiente descartado o ya procesado.
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
     *         name: pevou_uuid
     *         required: true
     *         schema:
     *           type: string
     *           format: uuid
     *         description: UUID del voucher pendiente
     *     responses:
     *       200:
     *         description: Voucher pendiente eliminado.
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
     *                   example: Voucher pendiente eliminado.
     *       400:
     *         description: Error al eliminar el voucher pendiente.
     *         content:
     *           application/json:
     *             schema:
     *               $ref: '#/components/schemas/ErrorResponse'
     */
    app.delete(`/${process.env.BASE_URL_API}/pending-voucher/:usr_uuid/:pevou_uuid`, pendingVoucherCtrl.deleteCtrl);
}

export default configurePendingVoucherRoutes;
