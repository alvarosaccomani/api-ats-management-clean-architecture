import { Request, Response } from 'express';
import { FixedExpenseUseCase } from '../../../application/fixed-expense/fixed-expense-use-case';

export class FixedExpenseController {
    constructor(private readonly fixedExpenseUseCase: FixedExpenseUseCase) {
        this.getAllCtrl = this.getAllCtrl.bind(this);
        this.getDetailCtrl = this.getDetailCtrl.bind(this);
        this.createCtrl = this.createCtrl.bind(this);
        this.updateCtrl = this.updateCtrl.bind(this);
        this.deleteCtrl = this.deleteCtrl.bind(this);
        this.payCtrl = this.payCtrl.bind(this);
    }

    public async getAllCtrl(req: Request, res: Response) {
        try {
            const { scp_uuid } = req.params;
            const { period } = req.query;
            const data = await this.fixedExpenseUseCase.getFixedExpenses(scp_uuid, period as string);
            res.status(200).send({ success: true, data });
        } catch (error: any) {
            console.error('Error en getAllCtrl (fixed-expense):', error.message);
            res.status(500).send({ success: false, error: error.message });
        }
    }

    public async getDetailCtrl(req: Request, res: Response) {
        try {
            const { fex_uuid } = req.params;
            const data = await this.fixedExpenseUseCase.getFixedExpenseById(fex_uuid);
            if (!data) {
                return res.status(404).send({ success: false, message: 'Gasto fijo no encontrado' });
            }
            res.status(200).send({ success: true, data });
        } catch (error: any) {
            console.error('Error en getDetailCtrl (fixed-expense):', error.message);
            res.status(500).send({ success: false, error: error.message });
        }
    }

    public async createCtrl(req: Request, res: Response) {
        try {
            const data = await this.fixedExpenseUseCase.createFixedExpense(req.body);
            res.status(201).send({ success: true, data });
        } catch (error: any) {
            console.error('Error en createCtrl (fixed-expense):', error.message);
            res.status(500).send({ success: false, error: error.message });
        }
    }

    public async updateCtrl(req: Request, res: Response) {
        try {
            const { fex_uuid } = req.params;
            const data = await this.fixedExpenseUseCase.updateFixedExpense(fex_uuid, req.body);
            if (!data) {
                return res.status(404).send({ success: false, message: 'Gasto fijo no encontrado o inactivo' });
            }
            res.status(200).send({ success: true, data });
        } catch (error: any) {
            console.error('Error en updateCtrl (fixed-expense):', error.message);
            res.status(500).send({ success: false, error: error.message });
        }
    }

    public async deleteCtrl(req: Request, res: Response) {
        try {
            const { fex_uuid } = req.params;
            const deleted = await this.fixedExpenseUseCase.deleteFixedExpense(fex_uuid);
            res.status(200).send({ success: true, message: deleted ? 'Gasto fijo eliminado' : 'No se pudo eliminar' });
        } catch (error: any) {
            console.error('Error en deleteCtrl (fixed-expense):', error.message);
            res.status(500).send({ success: false, error: error.message });
        }
    }

    public async payCtrl(req: Request, res: Response) {
        try {
            const { fex_uuid } = req.params;
            const result = await this.fixedExpenseUseCase.payFixedExpense(fex_uuid, req.body);
            res.status(201).send(result);
        } catch (error: any) {
            console.error('Error en payCtrl (fixed-expense):', error.message);
            res.status(500).send({ success: false, error: error.message });
        }
    }
}
