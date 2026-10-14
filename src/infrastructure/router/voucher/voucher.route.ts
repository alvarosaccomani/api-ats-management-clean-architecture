import { Express } from "express";
import { SequelizeVoucherRepository } from "../../repository/voucher/sequelize-voucher.repository";
import { SequelizeVoucherFeeRepository } from "../../repository/voucher-fee/sequelize-voucher-fee.repository";
import { VoucherUseCase } from "../../../application/voucher/voucher-use-case";
import { VoucherController } from "../../controller/voucher/voucher.controller";
import SocketAdapter from "../../services/socketAdapter";

function configureVoucherRoutes(app: Express, socketAdapter: SocketAdapter) {
    /*
    *   Iniciar repository
    */
    
    const sequelizeVoucherRepository = new SequelizeVoucherRepository();
    const sequelizeVoucherFeeRepository = new SequelizeVoucherFeeRepository();
    
    /*
    *   Iniciar casos de uso
    */
    
    const voucherUseCase = new VoucherUseCase(sequelizeVoucherRepository, sequelizeVoucherFeeRepository);
    
    /*
    *   Iniciar controller
    */
    
    const voucherCtrl = new VoucherController(voucherUseCase, socketAdapter);
    
    /**
     * @swagger
     * /vouchers/{usr_uuid}/{crd_uuid}/{per_uuid}:
     *   get:
     *     tags:
     *       - Vouchers
     *     summary: Listar cupones de compra / vouchers
     *     description: Retorna los cupones registrados para una tarjeta y período específicos.
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
     *         description: Cupones retornados exitosamente.
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
     *                   example: Vouchers retornados.
     *                 data:
     *                   type: array
     *                   items:
     *                     $ref: '#/components/schemas/VoucherEntity'
     *       400:
     *         description: Error al obtener los vouchers.
     *         content:
     *           application/json:
     *             schema:
     *               $ref: '#/components/schemas/ErrorResponse'
     */
    app.get(`/${process.env.BASE_URL_API}/vouchers/:usr_uuid/:crd_uuid/:per_uuid/:filter?/:page?/:perPage?`, voucherCtrl.getAllCtrl);

    /**
     * @swagger
     * /voucher/{usr_uuid}/{crd_uuid}/{per_uuid}/{vou_uuid}:
     *   get:
     *     tags:
     *       - Vouchers
     *     summary: Obtener detalle de voucher
     *     description: Retorna la información completa de un cupón específico.
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
     *         description: Voucher encontrado exitosamente.
     *         content:
     *           application/json:
     *             schema:
     *               type: object
     *               properties:
     *                 success:
     *                   type: boolean
     *                   example: true
     *                 data:
     *                   $ref: '#/components/schemas/VoucherEntity'
     *       400:
     *         description: Error o voucher no encontrado.
     *         content:
     *           application/json:
     *             schema:
     *               $ref: '#/components/schemas/ErrorResponse'
     */
    app.get(`/${process.env.BASE_URL_API}/voucher/:usr_uuid/:crd_uuid/:per_uuid/:vou_uuid`, voucherCtrl.getCtrl);

    /**
     * @swagger
     * /voucher:
     *   post:
     *     tags:
     *       - Vouchers
     *     summary: Crear nuevo voucher
     *     description: Registra un nuevo cupón de consumo con generación automática de cuotas si aplica.
     *     security:
     *       - bearerAuth: []
     *     requestBody:
     *       required: true
     *       content:
     *         application/json:
     *           schema:
     *             $ref: '#/components/schemas/VoucherInputDTO'
     *     responses:
     *       200:
     *         description: Voucher insertado con éxito.
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
     *                   example: Voucher insertado.
     *                 data:
     *                   $ref: '#/components/schemas/VoucherEntity'
     *       400:
     *         description: Error al insertar el voucher.
     *         content:
     *           application/json:
     *             schema:
     *               $ref: '#/components/schemas/ErrorResponse'
     */
    app.post(`/${process.env.BASE_URL_API}/voucher`, voucherCtrl.insertCtrl);

    /**
     * @swagger
     * /voucher/{usr_uuid}/{crd_uuid}/{per_uuid}/{vou_uuid}:
     *   put:
     *     tags:
     *       - Vouchers
     *     summary: Actualizar voucher
     *     description: Modifica los datos de un cupón existente.
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
     *     requestBody:
     *       required: true
     *       content:
     *         application/json:
     *           schema:
     *             $ref: '#/components/schemas/VoucherUpdateDTO'
     *     responses:
     *       200:
     *         description: Voucher actualizado.
     *         content:
     *           application/json:
     *             schema:
     *               type: object
     *               properties:
     *                 success:
     *                   type: boolean
     *                   example: true
     *                 data:
     *                   $ref: '#/components/schemas/VoucherEntity'
     *       400:
     *         description: Error al actualizar el voucher.
     *         content:
     *           application/json:
     *             schema:
     *               $ref: '#/components/schemas/ErrorResponse'
     */
    app.put(`/${process.env.BASE_URL_API}/voucher/:usr_uuid/:crd_uuid/:per_uuid/:vou_uuid`, voucherCtrl.updateCtrl);

    /**
     * @swagger
     * /voucher/{usr_uuid}/{crd_uuid}/{per_uuid}/{vou_uuid}:
     *   delete:
     *     tags:
     *       - Vouchers
     *     summary: Eliminar voucher
     *     description: Da de baja un cupón del sistema.
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
     *         description: Voucher eliminado con éxito.
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
     *                   example: Voucher eliminado.
     *       400:
     *         description: Error al eliminar el voucher.
     *         content:
     *           application/json:
     *             schema:
     *               $ref: '#/components/schemas/ErrorResponse'
     */
    app.delete(`/${process.env.BASE_URL_API}/voucher/:usr_uuid/:crd_uuid/:per_uuid/:vou_uuid`, voucherCtrl.deleteCtrl);
}

export default configureVoucherRoutes;