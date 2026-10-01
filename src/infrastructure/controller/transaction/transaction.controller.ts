import { Request, Response } from 'express';
import { TransactionUseCase } from '../../../application/transaction/transaction-use-case';

export class TransactionController {
    constructor(private transactionUseCase: TransactionUseCase) {
        this.getAllCtrl = this.getAllCtrl.bind(this);
        this.getDetailCtrl = this.getDetailCtrl.bind(this);
        this.insertCtrl = this.insertCtrl.bind(this);
        this.updateCtrl = this.updateCtrl.bind(this);
        this.deleteCtrl = this.deleteCtrl.bind(this);
    }

    public async getAllCtrl(req: Request, res: Response) {
        try {
            const { scp_uuid } = req.params;
            const { trx_type } = req.query;
            const transactions = await this.transactionUseCase.getTransactions(scp_uuid, trx_type as string);
            res.status(200).send({ success: true, data: transactions });
        } catch (error: any) {
            res.status(500).send({ success: false, error: error.message });
        }
    }

    public async getDetailCtrl(req: Request, res: Response) {
        try {
            const { trx_uuid } = req.params;
            const transaction = await this.transactionUseCase.getDetailTransaction(trx_uuid);
            res.status(200).send({ success: true, data: transaction });
        } catch (error: any) {
            res.status(500).send({ success: false, error: error.message });
        }
    }

    public async insertCtrl(req: Request, res: Response) {
        try {
            const transaction = await this.transactionUseCase.createTransaction(req.body);
            res.status(201).send({ success: true, data: transaction });
        } catch (error: any) {
            res.status(500).send({ success: false, error: error.message });
        }
    }

    public async updateCtrl(req: Request, res: Response) {
        try {
            const { trx_uuid } = req.params;
            const transaction = await this.transactionUseCase.updateTransaction(trx_uuid, req.body);
            res.status(200).send({ success: true, data: transaction });
        } catch (error: any) {
            res.status(500).send({ success: false, error: error.message });
        }
    }

    public async deleteCtrl(req: Request, res: Response) {
        try {
            const { trx_uuid } = req.params;
            const transaction = await this.transactionUseCase.deleteTransaction(trx_uuid);
            res.status(200).send({ success: true, data: transaction });
        } catch (error: any) {
            res.status(500).send({ success: false, error: error.message });
        }
    }
}
