import { Request, Response } from 'express';
import { ScopeUserUseCase } from '../../../application/scope-user/scope-user-use-case';

export class ScopeUserController {
    constructor(private scopeUserUseCase: ScopeUserUseCase) {
        this.getScopeUsersCtrl = this.getScopeUsersCtrl.bind(this);
        this.addScopeUserCtrl = this.addScopeUserCtrl.bind(this);
        this.removeScopeUserCtrl = this.removeScopeUserCtrl.bind(this);
    }

    public async getScopeUsersCtrl(req: Request, res: Response) {
        try {
            const { scp_uuid } = req.params;
            const scopeUsers = await this.scopeUserUseCase.getScopeUsers(scp_uuid);
            res.status(200).send({ success: true, data: scopeUsers });
        } catch (error: any) {
            res.status(500).send({ success: false, error: error.message });
        }
    }

    public async addScopeUserCtrl(req: Request, res: Response) {
        try {
            const scopeUser = await this.scopeUserUseCase.addScopeUser(req.body);
            res.status(201).send({ success: true, data: scopeUser });
        } catch (error: any) {
            res.status(500).send({ success: false, error: error.message });
        }
    }

    public async removeScopeUserCtrl(req: Request, res: Response) {
        try {
            const { scp_uuid, usr_uuid } = req.params;
            const result = await this.scopeUserUseCase.removeScopeUser(scp_uuid, usr_uuid);
            res.status(200).send({ success: true, data: result });
        } catch (error: any) {
            res.status(500).send({ success: false, error: error.message });
        }
    }
}
