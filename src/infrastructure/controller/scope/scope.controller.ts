import { Request, Response } from 'express';
import { ScopeUseCase } from '../../../application/scope/scope-use-case';

export class ScopeController {
    constructor(private scopeUseCase: ScopeUseCase) {
        this.getAllCtrl = this.getAllCtrl.bind(this);
        this.getDetailCtrl = this.getDetailCtrl.bind(this);
        this.insertCtrl = this.insertCtrl.bind(this);
        this.updateCtrl = this.updateCtrl.bind(this);
        this.deleteCtrl = this.deleteCtrl.bind(this);
    }

    public async getAllCtrl(req: Request, res: Response) {
        try {
            const { usr_uuid } = req.params;
            const scopes = await this.scopeUseCase.getScopes(usr_uuid);
            res.status(200).send({ success: true, data: scopes });
        } catch (error: any) {
            res.status(500).send({ success: false, error: error.message });
        }
    }

    public async getDetailCtrl(req: Request, res: Response) {
        try {
            const { scp_uuid } = req.params;
            const scope = await this.scopeUseCase.getDetailScope(scp_uuid);
            res.status(200).send({ success: true, data: scope });
        } catch (error: any) {
            res.status(500).send({ success: false, error: error.message });
        }
    }

    public async insertCtrl(req: Request, res: Response) {
        try {
            const scope = await this.scopeUseCase.createScope(req.body);
            res.status(201).send({ success: true, data: scope });
        } catch (error: any) {
            res.status(500).send({ success: false, error: error.message });
        }
    }

    public async updateCtrl(req: Request, res: Response) {
        try {
            const { scp_uuid } = req.params;
            const { usr_uuidowner, ...scopeData } = req.body;
            const scope = await this.scopeUseCase.updateScope(scp_uuid, usr_uuidowner, scopeData);
            res.status(200).send({ success: true, data: scope });
        } catch (error: any) {
            res.status(500).send({ success: false, error: error.message });
        }
    }

    public async deleteCtrl(req: Request, res: Response) {
        try {
            const { scp_uuid } = req.params;
            const scope = await this.scopeUseCase.deleteScope(scp_uuid);
            res.status(200).send({ success: true, data: scope });
        } catch (error: any) {
            res.status(500).send({ success: false, error: error.message });
        }
    }
}
