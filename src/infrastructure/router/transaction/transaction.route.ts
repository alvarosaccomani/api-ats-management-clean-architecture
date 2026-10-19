import { Express } from 'express';
import { TransactionUseCase } from '../../../application/transaction/transaction-use-case';
import { TransactionController } from '../../controller/transaction/transaction.controller';
import { SequelizeTransactionRepository } from '../../repository/transaction/sequelize-transaction.repository';
import { SequelizePersonRepository } from '../../repository/person/sequelize-person.repository';
import SocketAdapter from "../../services/socketAdapter";

function configureTransactionRoutes(app: Express, socketAdapter: SocketAdapter) {
    const transactionRepository = new SequelizeTransactionRepository();
    const personRepository = new SequelizePersonRepository();
    const transactionUseCase = new TransactionUseCase(transactionRepository, personRepository);
    const transactionCtrl = new TransactionController(transactionUseCase);

    const apiPrefix = process.env.BASE_URL_API ? `/${process.env.BASE_URL_API}` : '/api';

    /**
     * @swagger
     * /transactions/{scp_uuid}:
     *   get:
     *     tags:
     *       - Transactions
     *     summary: Listar transacciones por ámbito/scope
     *     description: Retorna la lista de transacciones registradas dentro de un ámbito (scope), con filtro opcional por tipo de transacción (INCOME, EXPENSE, TRANSFER).
     *     security:
     *       - bearerAuth: []
     *     parameters:
     *       - in: path
     *         name: scp_uuid
     *         required: true
     *         schema:
     *           type: string
     *           format: uuid
     *         description: UUID del ámbito (scope)
     *       - in: query
     *         name: trx_type
     *         required: false
     *         schema:
     *           type: string
     *           enum: [EXPENSE, INCOME, TRANSFER]
     *         description: Filtrar por tipo de transacción
     *     responses:
     *       200:
     *         description: Transacciones obtenidas exitosamente.
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
     *                     $ref: '#/components/schemas/TransactionEntity'
     *       500:
     *         description: Error interno al obtener las transacciones.
     *         content:
     *           application/json:
     *             schema:
     *               $ref: '#/components/schemas/ErrorResponse'
     */
    app.get(`${apiPrefix}/transactions/:scp_uuid`, transactionCtrl.getAllCtrl);

    /**
     * @swagger
     * /transaction/{trx_uuid}:
     *   get:
     *     tags:
     *       - Transactions
     *     summary: Obtener detalle de transacción
     *     description: Retorna la información completa de una transacción por su UUID.
     *     security:
     *       - bearerAuth: []
     *     parameters:
     *       - in: path
     *         name: trx_uuid
     *         required: true
     *         schema:
     *           type: string
     *           format: uuid
     *         description: UUID de la transacción
     *     responses:
     *       200:
     *         description: Detalle de la transacción obtenido exitosamente.
     *         content:
     *           application/json:
     *             schema:
     *               type: object
     *               properties:
     *                 success:
     *                   type: boolean
     *                   example: true
     *                 data:
     *                   $ref: '#/components/schemas/TransactionEntity'
     *       500:
     *         description: Error interno al obtener la transacción.
     *         content:
     *           application/json:
     *             schema:
     *               $ref: '#/components/schemas/ErrorResponse'
     */
    app.get(`${apiPrefix}/transaction/:trx_uuid`, transactionCtrl.getDetailCtrl);

    /**
     * @swagger
     * /transaction:
     *   post:
     *     tags:
     *       - Transactions
     *     summary: Crear nueva transacción
     *     description: Registra una nueva transacción financiera (gasto, ingreso o transferencia) dentro de un ámbito.
     *     security:
     *       - bearerAuth: []
     *     requestBody:
     *       required: true
     *       content:
     *         application/json:
     *           schema:
     *             $ref: '#/components/schemas/TransactionInputDTO'
     *     responses:
     *       201:
     *         description: Transacción creada exitosamente.
     *         content:
     *           application/json:
     *             schema:
     *               type: object
     *               properties:
     *                 success:
     *                   type: boolean
     *                   example: true
     *                 data:
     *                   $ref: '#/components/schemas/TransactionEntity'
     *       500:
     *         description: Error interno al crear la transacción.
     *         content:
     *           application/json:
     *             schema:
     *               $ref: '#/components/schemas/ErrorResponse'
     */
    app.post(`${apiPrefix}/transaction`, transactionCtrl.insertCtrl);

    /**
     * @swagger
     * /transactions/bulk:
     *   post:
     *     tags:
     *       - Transactions
     *     summary: Crear múltiples transacciones en lote (Bulk)
     *     description: Inserta un lote de transacciones financieras dentro de una única transacción atómica de base de datos. Si una falla, se cancelan todas.
     *     security:
     *       - bearerAuth: []
     *     requestBody:
     *       required: true
     *       content:
     *         application/json:
     *           schema:
     *             $ref: '#/components/schemas/TransactionBulkInputDTO'
     *     responses:
     *       201:
     *         description: Transacciones creadas exitosamente.
     *         content:
     *           application/json:
     *             schema:
     *               type: object
     *               properties:
     *                 success:
     *                   type: boolean
     *                   example: true
     *                 count:
     *                   type: integer
     *                   example: 10
     *                 data:
     *                   type: array
     *                   items:
     *                     $ref: '#/components/schemas/TransactionEntity'
     *       400:
     *         description: Solicitud incorrecta (arreglo de transacciones inválido o vacío).
     *         content:
     *           application/json:
     *             schema:
     *               $ref: '#/components/schemas/ErrorResponse'
     *       500:
     *         description: Error interno al procesar la inserción masiva.
     *         content:
     *           application/json:
     *             schema:
     *               $ref: '#/components/schemas/ErrorResponse'
     */
    app.post(`${apiPrefix}/transactions/bulk`, transactionCtrl.bulkInsertCtrl);

    /**
     * @swagger
     * /transaction/{trx_uuid}:
     *   put:
     *     tags:
     *       - Transactions
     *     summary: Actualizar transacción
     *     description: Modifica los datos de una transacción existente.
     *     security:
     *       - bearerAuth: []
     *     parameters:
     *       - in: path
     *         name: trx_uuid
     *         required: true
     *         schema:
     *           type: string
     *           format: uuid
     *         description: UUID de la transacción
     *     requestBody:
     *       required: true
     *       content:
     *         application/json:
     *           schema:
     *             $ref: '#/components/schemas/TransactionUpdateDTO'
     *     responses:
     *       200:
     *         description: Transacción actualizada exitosamente.
     *         content:
     *           application/json:
     *             schema:
     *               type: object
     *               properties:
     *                 success:
     *                   type: boolean
     *                   example: true
     *                 data:
     *                   $ref: '#/components/schemas/TransactionEntity'
     *       500:
     *         description: Error interno al actualizar la transacción.
     *         content:
     *           application/json:
     *             schema:
     *               $ref: '#/components/schemas/ErrorResponse'
     */
    app.put(`${apiPrefix}/transaction/:trx_uuid`, transactionCtrl.updateCtrl);

    /**
     * @swagger
     * /transaction/{trx_uuid}:
     *   delete:
     *     tags:
     *       - Transactions
     *     summary: Eliminar transacción
     *     description: Elimina una transacción del sistema por su UUID.
     *     security:
     *       - bearerAuth: []
     *     parameters:
     *       - in: path
     *         name: trx_uuid
     *         required: true
     *         schema:
     *           type: string
     *           format: uuid
     *         description: UUID de la transacción
     *     responses:
     *       200:
     *         description: Transacción eliminada exitosamente.
     *         content:
     *           application/json:
     *             schema:
     *               type: object
     *               properties:
     *                 success:
     *                   type: boolean
     *                   example: true
     *                 data:
     *                   $ref: '#/components/schemas/TransactionEntity'
     *       500:
     *         description: Error interno al eliminar la transacción.
     *         content:
     *           application/json:
     *             schema:
     *               $ref: '#/components/schemas/ErrorResponse'
     */
    app.delete(`${apiPrefix}/transaction/:trx_uuid`, transactionCtrl.deleteCtrl);
}

export default configureTransactionRoutes;
