import { Express } from 'express';
import { PersonUseCase } from '../../../application/person/person-use-case';
import { PersonController } from '../../controller/person/person.controller';
import { SequelizePersonRepository } from '../../repository/person/sequelize-person.repository';
import SocketAdapter from "../../services/socketAdapter";

function configurePersonRoutes(app: Express, socketAdapter: SocketAdapter) {
    const personRepository = new SequelizePersonRepository();
    const personUseCase = new PersonUseCase(personRepository);
    const personCtrl = new PersonController(personUseCase);

    const apiPrefix = process.env.BASE_URL_API ? `/${process.env.BASE_URL_API}` : '/api';

    app.get(`${apiPrefix}/persons/:scp_uuid`, personCtrl.getAllCtrl);
    app.get(`${apiPrefix}/person/:prs_uuid`, personCtrl.getDetailCtrl);
    app.post(`${apiPrefix}/person`, personCtrl.insertCtrl);
    app.put(`${apiPrefix}/person/:prs_uuid`, personCtrl.updateCtrl);
    app.delete(`${apiPrefix}/person/:prs_uuid`, personCtrl.deleteCtrl);
}

export default configurePersonRoutes;
