import { Express } from 'express';
import SocketAdapter from '../../services/socketAdapter';
import { SequelizeCommissionRepository } from '../../repository/commission/sequelize-commission.repository';
import { CommissionUseCase } from '../../../application/commission/commission-use-case';
import { CommissionController } from '../../controller/commission/commission.controller';

function configureCommissionRoutes(app: Express, socketAdapter: SocketAdapter): void {
    const commissionRepository = new SequelizeCommissionRepository();
    const commissionUseCase = new CommissionUseCase(commissionRepository);
    const commissionController = new CommissionController(commissionUseCase);

    const apiPrefix = process.env.BASE_URL_API ? `/${process.env.BASE_URL_API}` : '/api';
    
    /**
     * @swagger
     * /commissions/seller/{usr_uuid}:
     *   get:
     *     tags:
     *       - Commissions
     *     summary: Obtener resumen de comisiones de vendedor
     *     description: Retorna el cálculo totalizado de ventas y comisiones generadas por el vendedor, con filtro opcional por ámbito.
     *     security:
     *       - bearerAuth: []
     *     parameters:
     *       - in: path
     *         name: usr_uuid
     *         required: true
     *         schema:
     *           type: string
     *           format: uuid
     *         description: UUID del usuario vendedor
     *       - in: query
     *         name: scp_uuid
     *         required: false
     *         schema:
     *           type: string
     *           format: uuid
     *         description: UUID opcional del ámbito para filtrar ventas
     *     responses:
     *       200:
     *         description: Resumen de comisiones obtenido exitosamente.
     *         content:
     *           application/json:
     *             schema:
     *               type: object
     *               properties:
     *                 success:
     *                   type: boolean
     *                   example: true
     *                 data:
     *                   $ref: '#/components/schemas/SellerCommissionSummaryEntity'
     *       500:
     *         description: Error al calcular comisiones del vendedor.
     *         content:
     *           application/json:
     *             schema:
     *               $ref: '#/components/schemas/ErrorResponse'
     */
    app.get(`${apiPrefix}/commissions/seller/:usr_uuid`, commissionController.getSellerCommissions);
}

export default configureCommissionRoutes;
