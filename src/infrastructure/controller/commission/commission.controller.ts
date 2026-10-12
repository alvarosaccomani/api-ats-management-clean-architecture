import { Request, Response } from 'express';
import { CommissionUseCase } from '../../../application/commission/commission-use-case';

export class CommissionController {
    constructor(private readonly commissionUseCase: CommissionUseCase) {}

    public getSellerCommissions = async (req: Request, res: Response) => {
        try {
            const { usr_uuid } = req.params;
            const { scp_uuid } = req.query;
            const result = await this.commissionUseCase.getSellerCommissions(
                usr_uuid,
                scp_uuid ? String(scp_uuid) : undefined
            );
            return res.status(200).json({
                success: true,
                data: result
            });
        } catch (error: any) {
            console.error('Error en getSellerCommissions Controller:', error.message);
            return res.status(500).json({
                success: false,
                error: error.message || 'Error al obtener las comisiones del vendedor'
            });
        }
    };
}
