import { Express } from "express";
import { SequelizeVoucherStateRepository } from "../../repository/voucher-state/sequelize-voucher-state.repository";
import { VoucherStateUseCase } from "../../../application/voucher-state/voucher-state-use-case";
import { VoucherStateController } from "../../controller/voucher-state/voucher-state.controller";
import SocketAdapter from "../../services/socketAdapter";

function configureVoucherStateRoutes(app: Express, socketAdapter: SocketAdapter) {
    /*
    *   Iniciar repository
    */
    
    const sequelizeVoucherStateRepository = new SequelizeVoucherStateRepository();
    
    /*
    *   Iniciar casos de uso
    */
    
    const voucherStateUseCase = new VoucherStateUseCase(sequelizeVoucherStateRepository);
    
    /*
    *   Iniciar controller
    */
    
    const voucherStateCtrl = new VoucherStateController(voucherStateUseCase, socketAdapter);
    
    /**
     * @swagger
     * /voucher-states:
     *   get:
     *     tags:
     *       - Voucher States
     *     summary: Listar estados de cupones
     *     description: Retorna la lista de estados de vouchers (Aprobado, Rechazado, Pendiente, etc.).
     *     security:
     *       - bearerAuth: []
     *     responses:
     *       200:
     *         description: Estados de cupones retornados exitosamente.
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
     *                     $ref: '#/components/schemas/VoucherStateEntity'
     *       400:
     *         description: Error al recuperar los estados.
     *         content:
     *           application/json:
     *             schema:
     *               $ref: '#/components/schemas/ErrorResponse'
     */
    app.get(`/${process.env.BASE_URL_API}/voucher-states/:filter?/:page?/:perPage?`, voucherStateCtrl.getAllCtrl);

    /**
     * @swagger
     * /voucher-state/{vous_uuid}:
     *   get:
     *     tags:
     *       - Voucher States
     *     summary: Obtener detalle de estado de cupón
     *     description: Retorna la información de un estado por su UUID.
     *     security:
     *       - bearerAuth: []
     *     parameters:
     *       - in: path
     *         name: vous_uuid
     *         required: true
     *         schema:
     *           type: string
     *           format: uuid
     *         description: UUID del estado de voucher
     *     responses:
     *       200:
     *         description: Estado de voucher retornado con éxito.
     *         content:
     *           application/json:
     *             schema:
     *               type: object
     *               properties:
     *                 success:
     *                   type: boolean
     *                   example: true
     *                 data:
     *                   $ref: '#/components/schemas/VoucherStateEntity'
     *       400:
     *         description: Error o estado no encontrado.
     *         content:
     *           application/json:
     *             schema:
     *               $ref: '#/components/schemas/ErrorResponse'
     */
    app.get(`/${process.env.BASE_URL_API}/voucher-state/:vous_uuid`, voucherStateCtrl.getCtrl);

    /**
     * @swagger
     * /voucher-state:
     *   post:
     *     tags:
     *       - Voucher States
     *     summary: Crear estado de cupón
     *     description: Registra un nuevo estado para cupones en el sistema.
     *     security:
     *       - bearerAuth: []
     *     requestBody:
     *       required: true
     *       content:
     *         application/json:
     *           schema:
     *             $ref: '#/components/schemas/VoucherStateInputDTO'
     *     responses:
     *       200:
     *         description: Estado de cupón insertado exitosamente.
     *         content:
     *           application/json:
     *             schema:
     *               type: object
     *               properties:
     *                 success:
     *                   type: boolean
     *                   example: true
     *                 data:
     *                   $ref: '#/components/schemas/VoucherStateEntity'
     *       400:
     *         description: Error al insertar el estado.
     *         content:
     *           application/json:
     *             schema:
     *               $ref: '#/components/schemas/ErrorResponse'
     */
    app.post(`/${process.env.BASE_URL_API}/voucher-state`, voucherStateCtrl.insertCtrl);

    /**
     * @swagger
     * /voucher-state/{vous_uuid}:
     *   put:
     *     tags:
     *       - Voucher States
     *     summary: Actualizar estado de cupón
     *     description: Modifica los datos de un estado de cupón existente.
     *     security:
     *       - bearerAuth: []
     *     parameters:
     *       - in: path
     *         name: vous_uuid
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
     *             $ref: '#/components/schemas/VoucherStateInputDTO'
     *     responses:
     *       200:
     *         description: Estado de cupón actualizado con éxito.
     *         content:
     *           application/json:
     *             schema:
     *               type: object
     *               properties:
     *                 success:
     *                   type: boolean
     *                   example: true
     *                 data:
     *                   $ref: '#/components/schemas/VoucherStateEntity'
     *       400:
     *         description: Error al actualizar el estado.
     *         content:
     *           application/json:
     *             schema:
     *               $ref: '#/components/schemas/ErrorResponse'
     */
    app.put(`/${process.env.BASE_URL_API}/voucher-state/:vous_uuid`, voucherStateCtrl.updateCtrl);

    /**
     * @swagger
     * /voucher-state/{vous_uuid}:
     *   delete:
     *     tags:
     *       - Voucher States
     *     summary: Eliminar estado de cupón
     *     description: Da de baja un estado de cupón por su UUID.
     *     security:
     *       - bearerAuth: []
     *     parameters:
     *       - in: path
     *         name: vous_uuid
     *         required: true
     *         schema:
     *           type: string
     *           format: uuid
     *         description: UUID del estado a eliminar
     *     responses:
     *       200:
     *         description: Estado de cupón eliminado.
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
     *                   example: Estado de voucher eliminado.
     *       400:
     *         description: Error al eliminar el estado.
     *         content:
     *           application/json:
     *             schema:
     *               $ref: '#/components/schemas/ErrorResponse'
     */
    app.delete(`/${process.env.BASE_URL_API}/voucher-state/:vous_uuid`, voucherStateCtrl.deleteCtrl);
}

export default configureVoucherStateRoutes;