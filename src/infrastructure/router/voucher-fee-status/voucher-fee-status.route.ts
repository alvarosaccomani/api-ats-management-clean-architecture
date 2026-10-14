import { Express } from "express";
import { SequelizeVoucherFeeStatusRepository } from "../../repository/voucher-fee-status/sequelize-voucher-fee-status.repository";
import { VoucherFeeStatusUseCase } from "../../../application/voucher-fee-status/voucher-fee-status-use-case";
import { VoucherFeeStatusController } from "../../controller/voucher-fee-status/voucher-fee-status.controller";
import SocketAdapter from "../../services/socketAdapter";

function configureVoucherFeeStatusRoutes(app: Express, socketAdapter: SocketAdapter) {
    /*
    *   Iniciar repository
    */
    
    const sequelizeVoucherFeeStatusRepository = new SequelizeVoucherFeeStatusRepository();
    
    /*
    *   Iniciar casos de uso
    */
    
    const voucherFeeStatusUseCase = new VoucherFeeStatusUseCase(sequelizeVoucherFeeStatusRepository);
    
    /*
    *   Iniciar controller
    */
    
    const voucherFeeStatusCtrl = new VoucherFeeStatusController(voucherFeeStatusUseCase, socketAdapter);
    
    /**
     * @swagger
     * /voucher-fee-statuses:
     *   get:
     *     tags:
     *       - Voucher Fee Statuses
     *     summary: Listar estados de cuotas
     *     description: Retorna la lista de estados posibles para las cuotas (Pagada, Pendiente, Vencida, etc.).
     *     security:
     *       - bearerAuth: []
     *     responses:
     *       200:
     *         description: Estados de cuotas retornados exitosamente.
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
     *                     $ref: '#/components/schemas/VoucherFeeStatusEntity'
     *       400:
     *         description: Error al recuperar los estados de cuotas.
     *         content:
     *           application/json:
     *             schema:
     *               $ref: '#/components/schemas/ErrorResponse'
     */
    app.get(`/${process.env.BASE_URL_API}/voucher-fee-statuses/:filter?/:page?/:perPage?`, voucherFeeStatusCtrl.getAllCtrl);

    /**
     * @swagger
     * /voucher-fee-status/{voufs_uuid}:
     *   get:
     *     tags:
     *       - Voucher Fee Statuses
     *     summary: Obtener detalle de estado de cuota
     *     description: Retorna la información de un estado de cuota por su UUID.
     *     security:
     *       - bearerAuth: []
     *     parameters:
     *       - in: path
     *         name: voufs_uuid
     *         required: true
     *         schema:
     *           type: string
     *           format: uuid
     *         description: UUID del estado de cuota
     *     responses:
     *       200:
     *         description: Estado de cuota retornado con éxito.
     *         content:
     *           application/json:
     *             schema:
     *               type: object
     *               properties:
     *                 success:
     *                   type: boolean
     *                   example: true
     *                 data:
     *                   $ref: '#/components/schemas/VoucherFeeStatusEntity'
     *       400:
     *         description: Error o estado de cuota no encontrado.
     *         content:
     *           application/json:
     *             schema:
     *               $ref: '#/components/schemas/ErrorResponse'
     */
    app.get(`/${process.env.BASE_URL_API}/voucher-fee-status/:voufs_uuid`, voucherFeeStatusCtrl.getCtrl);

    /**
     * @swagger
     * /voucher-fee-status:
     *   post:
     *     tags:
     *       - Voucher Fee Statuses
     *     summary: Crear estado de cuota
     *     description: Registra un nuevo estado para cuotas de cupones.
     *     security:
     *       - bearerAuth: []
     *     requestBody:
     *       required: true
     *       content:
     *         application/json:
     *           schema:
     *             $ref: '#/components/schemas/VoucherFeeStatusInputDTO'
     *     responses:
     *       200:
     *         description: Estado de cuota insertado exitosamente.
     *         content:
     *           application/json:
     *             schema:
     *               type: object
     *               properties:
     *                 success:
     *                   type: boolean
     *                   example: true
     *                 data:
     *                   $ref: '#/components/schemas/VoucherFeeStatusEntity'
     *       400:
     *         description: Error al insertar el estado de cuota.
     *         content:
     *           application/json:
     *             schema:
     *               $ref: '#/components/schemas/ErrorResponse'
     */
    app.post(`/${process.env.BASE_URL_API}/voucher-fee-status`, voucherFeeStatusCtrl.insertCtrl);

    /**
     * @swagger
     * /voucher-fee-status/{voufs_uuid}:
     *   put:
     *     tags:
     *       - Voucher Fee Statuses
     *     summary: Actualizar estado de cuota
     *     description: Modifica los atributos de un estado de cuota existente.
     *     security:
     *       - bearerAuth: []
     *     parameters:
     *       - in: path
     *         name: voufs_uuid
     *         required: true
     *         schema:
     *           type: string
     *           format: uuid
     *         description: UUID del estado a actualizar
     *     requestBody:
     *       required: true
     *       content:
     *         application/json:
     *           schema:
     *             $ref: '#/components/schemas/VoucherFeeStatusInputDTO'
     *     responses:
     *       200:
     *         description: Estado de cuota actualizado con éxito.
     *         content:
     *           application/json:
     *             schema:
     *               type: object
     *               properties:
     *                 success:
     *                   type: boolean
     *                   example: true
     *                 data:
     *                   $ref: '#/components/schemas/VoucherFeeStatusEntity'
     *       400:
     *         description: Error al actualizar el estado de cuota.
     *         content:
     *           application/json:
     *             schema:
     *               $ref: '#/components/schemas/ErrorResponse'
     */
    app.put(`/${process.env.BASE_URL_API}/voucher-fee-status/:voufs_uuid`, voucherFeeStatusCtrl.updateCtrl);

    /**
     * @swagger
     * /voucher-fee-status/{voufs_uuid}:
     *   delete:
     *     tags:
     *       - Voucher Fee Statuses
     *     summary: Eliminar estado de cuota
     *     description: Da de baja un estado de cuota por su UUID.
     *     security:
     *       - bearerAuth: []
     *     parameters:
     *       - in: path
     *         name: voufs_uuid
     *         required: true
     *         schema:
     *           type: string
     *           format: uuid
     *         description: UUID del estado a eliminar
     *     responses:
     *       200:
     *         description: Estado de cuota eliminado.
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
     *                   example: Estado de cuota eliminado.
     *       400:
     *         description: Error al eliminar el estado de cuota.
     *         content:
     *           application/json:
     *             schema:
     *               $ref: '#/components/schemas/ErrorResponse'
     */
    app.delete(`/${process.env.BASE_URL_API}/voucher-fee-status/:voufs_uuid`, voucherFeeStatusCtrl.deleteCtrl);
}

export default configureVoucherFeeStatusRoutes;