import { Express } from "express";
import { SequelizeVoucherFeeRepository } from "../../repository/voucher-fee/sequelize-voucher-fee.repository";
import { VoucherFeeUseCase } from "../../../application/voucher-fee/voucher-fee-use-case";
import { VoucherFeeController } from "../../controller/voucher-fee/voucher-fee.controller";
import SocketAdapter from "../../services/socketAdapter";

function configureVoucherFeeRoutes(app: Express, socketAdapter: SocketAdapter) {
    /*
    *   Iniciar repository
    */
    
    const sequelizeVoucherFeeRepository = new SequelizeVoucherFeeRepository();
    
    /*
    *   Iniciar casos de uso
    */
    
    const voucherFeeUseCase = new VoucherFeeUseCase(sequelizeVoucherFeeRepository);
    
    /*
    *   Iniciar controller
    */
    
    const voucherFeeCtrl = new VoucherFeeController(voucherFeeUseCase, socketAdapter);
    
    /**
     * @swagger
     * /voucher-fees/{usr_uuid}/{crd_uuid}/{per_uuid}/{vou_uuid}:
     *   get:
     *     tags:
     *       - Voucher Fees
     *     summary: Listar cuotas de un voucher
     *     description: Retorna la lista de cuotas asociadas a un cupón específico.
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
     *         name: vou_uuid
     *         required: true
     *         schema:
     *           type: string
     *           format: uuid
     *         description: UUID del voucher
     *     responses:
     *       200:
     *         description: Cuotas retornadas exitosamente.
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
     *                     $ref: '#/components/schemas/VoucherFeeEntity'
     *       400:
     *         description: Error al recuperar las cuotas.
     *         content:
     *           application/json:
     *             schema:
     *               $ref: '#/components/schemas/ErrorResponse'
     */
    app.get(`/${process.env.BASE_URL_API}/voucher-fees/:usr_uuid/:crd_uuid/:per_uuid/:vou_uuid/:filter?/:page?/:perPage?`, voucherFeeCtrl.getAllCtrl);

    /**
     * @swagger
     * /voucher-fee/{usr_uuid}/{crd_uuid}/{per_uuid}/{vou_uuid}/{vouf_uuid}:
     *   get:
     *     tags:
     *       - Voucher Fees
     *     summary: Obtener detalle de cuota
     *     description: Retorna la información de una cuota particular por su identificador.
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
     *         name: vou_uuid
     *         required: true
     *         schema:
     *           type: string
     *           format: uuid
     *         description: UUID del voucher
     *       - in: path
     *         name: vouf_uuid
     *         required: true
     *         schema:
     *           type: string
     *           format: uuid
     *         description: UUID de la cuota
     *     responses:
     *       200:
     *         description: Cuota encontrada con éxito.
     *         content:
     *           application/json:
     *             schema:
     *               type: object
     *               properties:
     *                 success:
     *                   type: boolean
     *                   example: true
     *                 data:
     *                   $ref: '#/components/schemas/VoucherFeeEntity'
     *       400:
     *         description: Error o cuota no encontrada.
     *         content:
     *           application/json:
     *             schema:
     *               $ref: '#/components/schemas/ErrorResponse'
     */
    app.get(`/${process.env.BASE_URL_API}/voucher-fee/:usr_uuid/:crd_uuid/:per_uuid/:vou_uuid/:vouf_uuid`, voucherFeeCtrl.getCtrl);

    /**
     * @swagger
     * /voucher-fee:
     *   post:
     *     tags:
     *       - Voucher Fees
     *     summary: Crear cuota para voucher
     *     description: Da de alta una nueva cuota individual para un cupón.
     *     security:
     *       - bearerAuth: []
     *     requestBody:
     *       required: true
     *       content:
     *         application/json:
     *           schema:
     *             $ref: '#/components/schemas/VoucherFeeInputDTO'
     *     responses:
     *       200:
     *         description: Cuota insertada con éxito.
     *         content:
     *           application/json:
     *             schema:
     *               type: object
     *               properties:
     *                 success:
     *                   type: boolean
     *                   example: true
     *                 data:
     *                   $ref: '#/components/schemas/VoucherFeeEntity'
     *       400:
     *         description: Error al insertar la cuota.
     *         content:
     *           application/json:
     *             schema:
     *               $ref: '#/components/schemas/ErrorResponse'
     */
    app.post(`/${process.env.BASE_URL_API}/voucher-fee`, voucherFeeCtrl.insertCtrl);

    /**
     * @swagger
     * /voucher-fee/{usr_uuid}/{crd_uuid}/{per_uuid}/{vou_uuid}/{vouf_uuid}:
     *   put:
     *     tags:
     *       - Voucher Fees
     *     summary: Actualizar cuota
     *     description: Modifica monto, fecha o estado de una cuota de voucher.
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
     *         name: vou_uuid
     *         required: true
     *         schema:
     *           type: string
     *           format: uuid
     *         description: UUID del voucher
     *       - in: path
     *         name: vouf_uuid
     *         required: true
     *         schema:
     *           type: string
     *           format: uuid
     *         description: UUID de la cuota
     *     requestBody:
     *       required: true
     *       content:
     *         application/json:
     *           schema:
     *             $ref: '#/components/schemas/VoucherFeeUpdateDTO'
     *     responses:
     *       200:
     *         description: Cuota actualizada con éxito.
     *         content:
     *           application/json:
     *             schema:
     *               type: object
     *               properties:
     *                 success:
     *                   type: boolean
     *                   example: true
     *                 data:
     *                   $ref: '#/components/schemas/VoucherFeeEntity'
     *       400:
     *         description: Error al actualizar la cuota.
     *         content:
     *           application/json:
     *             schema:
     *               $ref: '#/components/schemas/ErrorResponse'
     */
    app.put(`/${process.env.BASE_URL_API}/voucher-fee/:usr_uuid/:crd_uuid/:per_uuid/:vou_uuid/:vouf_uuid`, voucherFeeCtrl.updateCtrl);

    /**
     * @swagger
     * /voucher-fee/{usr_uuid}/{crd_uuid}/{per_uuid}/{vou_uuid}/{vouf_uuid}:
     *   delete:
     *     tags:
     *       - Voucher Fees
     *     summary: Eliminar cuota
     *     description: Da de baja una cuota específica.
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
     *         name: vou_uuid
     *         required: true
     *         schema:
     *           type: string
     *           format: uuid
     *         description: UUID del voucher
     *       - in: path
     *         name: vouf_uuid
     *         required: true
     *         schema:
     *           type: string
     *           format: uuid
     *         description: UUID de la cuota
     *     responses:
     *       200:
     *         description: Cuota eliminada exitosamente.
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
     *                   example: Cuota eliminada.
     *       400:
     *         description: Error al eliminar la cuota.
     *         content:
     *           application/json:
     *             schema:
     *               $ref: '#/components/schemas/ErrorResponse'
     */
    app.delete(`/${process.env.BASE_URL_API}/voucher-fee/:usr_uuid/:crd_uuid/:per_uuid/:vou_uuid/:vouf_uuid`, voucherFeeCtrl.deleteCtrl);
}

export default configureVoucherFeeRoutes;