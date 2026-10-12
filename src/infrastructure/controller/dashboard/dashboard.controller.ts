import { Request, Response } from 'express';
import { DashboardUseCase } from '../../../application/dashboard/dashboard-use-case';

export class DashboardController {
  constructor(private readonly dashboardUseCase: DashboardUseCase) {}

  public getSummary = async (req: Request, res: Response) => {
    try {
      const { usr_uuid } = req.params;
      const { scp_uuid } = req.query;
      const summary = await this.dashboardUseCase.getDashboardSummary(
        usr_uuid,
        scp_uuid ? String(scp_uuid) : undefined
      );
      return res.status(200).json({
        success: true,
        data: summary
      });
    } catch (error: any) {
      console.error('Error en getSummary Controller:', error.message);
      return res.status(500).json({
        success: false,
        error: error.message || 'Error al obtener el resumen del dashboard'
      });
    }
  };
}
