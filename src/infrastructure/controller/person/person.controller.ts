import { Request, Response } from 'express';
import { PersonUseCase } from '../../../application/person/person-use-case';

export class PersonController {
    constructor(private personUseCase: PersonUseCase) {
        this.getAllCtrl = this.getAllCtrl.bind(this);
        this.getDetailCtrl = this.getDetailCtrl.bind(this);
        this.insertCtrl = this.insertCtrl.bind(this);
        this.updateCtrl = this.updateCtrl.bind(this);
        this.deleteCtrl = this.deleteCtrl.bind(this);
    }

    public async getAllCtrl(req: Request, res: Response) {
        try {
            const { scp_uuid } = req.params;
            const persons = await this.personUseCase.getPersons(scp_uuid);
            res.status(200).send({ success: true, data: persons });
        } catch (error: any) {
            res.status(500).send({ success: false, error: error.message });
        }
    }

    public async getDetailCtrl(req: Request, res: Response) {
        try {
            const { prs_uuid } = req.params;
            const person = await this.personUseCase.getDetailPerson(prs_uuid);
            res.status(200).send({ success: true, data: person });
        } catch (error: any) {
            res.status(500).send({ success: false, error: error.message });
        }
    }

    public async insertCtrl(req: Request, res: Response) {
        try {
            const person = await this.personUseCase.createPerson(req.body);
            res.status(201).send({ success: true, data: person });
        } catch (error: any) {
            console.error('Error en insertCtrl:', error);
            const detailedError = error.errors?.map((e: any) => e.message).join(', ') || error.original?.detail || error.original?.message || error.message;
            res.status(500).send({ success: false, error: detailedError });
        }
    }

    public async updateCtrl(req: Request, res: Response) {
        try {
            const { prs_uuid } = req.params;
            const person = await this.personUseCase.updatePerson(prs_uuid, req.body);
            res.status(200).send({ success: true, data: person });
        } catch (error: any) {
            console.error('Error en updateCtrl:', error);
            const detailedError = error.errors?.map((e: any) => e.message).join(', ') || error.original?.detail || error.original?.message || error.message;
            res.status(500).send({ success: false, error: detailedError });
        }
    }

    public async deleteCtrl(req: Request, res: Response) {
        try {
            const { prs_uuid } = req.params;
            const person = await this.personUseCase.deletePerson(prs_uuid);
            res.status(200).send({ success: true, data: person });
        } catch (error: any) {
            res.status(500).send({ success: false, error: error.message });
        }
    }
}
