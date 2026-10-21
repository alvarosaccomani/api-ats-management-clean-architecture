import { Express } from 'express';
import { FixedExpenseUseCase } from '../../../application/fixed-expense/fixed-expense-use-case';
import { FixedExpenseController } from '../../controller/fixed-expense/fixed-expense.controller';
import { SequelizeFixedExpenseRepository } from '../../repository/fixed-expense/sequelize-fixed-expense.repository';
import SocketAdapter from "../../services/socketAdapter";

function configureFixedExpenseRoutes(app: Express, socketAdapter: SocketAdapter) {
    const fixedExpenseRepository = new SequelizeFixedExpenseRepository();
    const fixedExpenseUseCase = new FixedExpenseUseCase(fixedExpenseRepository);
    const fixedExpenseCtrl = new FixedExpenseController(fixedExpenseUseCase);

    const apiPrefix = process.env.BASE_URL_API ? `/${process.env.BASE_URL_API}` : '/api';

    /**
     * @swagger
     * /fixed-expenses/{scp_uuid}:
     *   get:
     *     tags:
     *       - Fixed Expenses
     *     summary: Listar gastos fijos y recurrentes de un ámbito
     *     description: Retorna la lista de gastos fijos activos para el ámbito especificado, decorados con el estado de pago del mes solicitado (PAID o PENDING).
     *     security:
     *       - bearerAuth: []
     *     parameters:
     *       - in: path
     *         name: scp_uuid
     *         required: true
     *         schema:
     *           type: string
     *           format: uuid
     *         description: UUID del ámbito contable
     *       - in: query
     *         name: period
     *         required: false
     *         schema:
     *           type: string
     *           example: "2026-10"
     *         description: Período mensual en formato YYYY-MM (por defecto el mes actual)
     *     responses:
     *       200:
     *         description: Lista de gastos fijos obtenida exitosamente.
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
     *                     $ref: '#/components/schemas/FixedExpenseEntity'
     *       500:
     *         description: Error interno del servidor.
     */
    app.get(`${apiPrefix}/fixed-expenses/:scp_uuid`, fixedExpenseCtrl.getAllCtrl);

    /**
     * @swagger
     * /fixed-expense/{fex_uuid}:
     *   get:
     *     tags:
     *       - Fixed Expenses
     *     summary: Obtener detalle de un gasto fijo
     *     description: Retorna la información completa de una plantilla de gasto fijo por su UUID.
     *     security:
     *       - bearerAuth: []
     *     parameters:
     *       - in: path
     *         name: fex_uuid
     *         required: true
     *         schema:
     *           type: string
     *           format: uuid
     *         description: UUID del gasto fijo
     *     responses:
     *       200:
     *         description: Detalle obtenido exitosamente.
     *       404:
     *         description: Gasto fijo no encontrado.
     *       500:
     *         description: Error interno del servidor.
     */
    app.get(`${apiPrefix}/fixed-expense/:fex_uuid`, fixedExpenseCtrl.getDetailCtrl);

    /**
     * @swagger
     * /fixed-expense:
     *   post:
     *     tags:
     *       - Fixed Expenses
     *     summary: Crear una nueva plantilla de gasto fijo o servicio
     *     description: Registra un nuevo servicio o gasto recurrente dentro de un ámbito contable.
     *     security:
     *       - bearerAuth: []
     *     requestBody:
     *       required: true
     *       content:
     *         application/json:
     *           schema:
     *             $ref: '#/components/schemas/FixedExpenseInputDTO'
     *     responses:
     *       201:
     *         description: Gasto fijo creado exitosamente.
     *       500:
     *         description: Error interno al crear el gasto fijo.
     */
    app.post(`${apiPrefix}/fixed-expense`, fixedExpenseCtrl.createCtrl);

    /**
     * @swagger
     * /fixed-expense/{fex_uuid}:
     *   put:
     *     tags:
     *       - Fixed Expenses
     *     summary: Actualizar una plantilla de gasto fijo
     *     description: Modifica los parámetros de configuración de un gasto fijo existente.
     *     security:
     *       - bearerAuth: []
     *     parameters:
     *       - in: path
     *         name: fex_uuid
     *         required: true
     *         schema:
     *           type: string
     *           format: uuid
     *         description: UUID del gasto fijo a actualizar
     *     requestBody:
     *       required: true
     *       content:
     *         application/json:
     *           schema:
     *             $ref: '#/components/schemas/FixedExpenseInputDTO'
     *     responses:
     *       200:
     *         description: Gasto fijo actualizado exitosamente.
     *       404:
     *         description: Gasto fijo no encontrado.
     *       500:
     *         description: Error al actualizar.
     */
    app.put(`${apiPrefix}/fixed-expense/:fex_uuid`, fixedExpenseCtrl.updateCtrl);

    /**
     * @swagger
     * /fixed-expense/{fex_uuid}:
     *   delete:
     *     tags:
     *       - Fixed Expenses
     *     summary: Eliminar o desactivar un gasto fijo
     *     description: Realiza un borrado lógico del gasto fijo marcándolo como inactivo.
     *     security:
     *       - bearerAuth: []
     *     parameters:
     *       - in: path
     *         name: fex_uuid
     *         required: true
     *         schema:
     *           type: string
     *           format: uuid
     *         description: UUID del gasto fijo a dar de baja
     *     responses:
     *       200:
     *         description: Gasto fijo dado de baja exitosamente.
     *       500:
     *         description: Error interno al eliminar.
     */
    app.delete(`${apiPrefix}/fixed-expense/:fex_uuid`, fixedExpenseCtrl.deleteCtrl);

    /**
     * @swagger
     * /fixed-expense/{fex_uuid}/pay:
     *   post:
     *     tags:
     *       - Fixed Expenses
     *     summary: Registrar el pago mensual de un gasto fijo
     *     description: Genera una transacción contable de tipo EGRESO vinculada a este gasto fijo, actualizando el monto de referencia para el mes siguiente.
     *     security:
     *       - bearerAuth: []
     *     parameters:
     *       - in: path
     *         name: fex_uuid
     *         required: true
     *         schema:
     *           type: string
     *           format: uuid
     *         description: UUID del gasto fijo que se abona
     *     requestBody:
     *       required: true
     *       content:
     *         application/json:
     *           schema:
     *             type: object
     *             required:
     *               - trx_amount
     *               - usr_uuidcreator
     *             properties:
     *               trx_amount:
     *                 type: number
     *                 example: 35000.50
     *                 description: Monto real abonado en el período
     *               trx_datetime:
     *                 type: string
     *                 format: date-time
     *                 description: Fecha en que se efectuó el pago o débito
     *               crd_uuid:
     *                 type: string
     *                 format: uuid
     *                 description: Cuenta o tarjeta de donde salió el dinero (opcional, por defecto la cuenta habitual)
     *               prs_uuidactor:
     *                 type: string
     *                 format: uuid
     *                 description: Socio que pagó de su bolsillo si no salió de cuenta del negocio
     *               trx_notes:
     *                 type: string
     *                 example: "Factura Nro 0012-391039"
     *                 description: Observaciones o número de factura
     *               usr_uuidcreator:
     *                 type: string
     *                 format: uuid
     *                 description: UUID del usuario que registra el pago
     *     responses:
     *       201:
     *         description: Pago registrado y transacción de egreso creada exitosamente.
     *       400:
     *         description: Datos de pago inválidos.
     *       404:
     *         description: Gasto fijo no encontrado.
     *       500:
     *         description: Error interno al procesar el pago.
     */
    app.post(`${apiPrefix}/fixed-expense/:fex_uuid/pay`, fixedExpenseCtrl.payCtrl);
}

export default configureFixedExpenseRoutes;
