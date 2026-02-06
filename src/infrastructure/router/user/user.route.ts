import { Express } from "express";
import { SequelizeRepository } from "../../repository/user/sequelize-user.repository";
import { UserUseCase } from "../../../application/user/user-use-case";
import { UserController } from "../../../infrastructure/controller/user/user.controller";
import SocketAdapter from "../../services/socketAdapter";

function configureUserRoutes(app: Express, socketAdapter: SocketAdapter) {
    /*
    *   Iniciar repository
    */
    
    const sequelizeUserRepository = new SequelizeRepository();
    
    /*
    *   Iniciar casos de uso
    */
    
    const userUseCase = new UserUseCase(sequelizeUserRepository);
    
    /*
    *   Iniciar controller
    */
    
    const userCtrl = new UserController(userUseCase, socketAdapter);
    
    /**
     * @swagger
     * /api/user:
     *   get:
     *     summary: Obtiene la lista de usuarios registrados.
     *     description: Retorna una lista de todos los usuarios registrados en el sistema.
     *     responses:
     *       200:
     *         description: Operación exitosa. Retorna un objeto con los datos de los usuarios.
     *         content:
     *           application/json:
     *             schema:
     *               type: object
     *               properties:
     *                 success:
     *                   type: boolean
     *                   description: Indica si la operación fue exitosa.
     *                   example: true
     *                 message:
     *                   type: string
     *                   description: Mensaje descriptivo de la operación.
     *                   example: Usuarios retornados.
     *                 data:
     *                   type: array
     *                   description: Lista de usuarios registrados.
     *                   items:
     *                     $ref: '#/components/schemas/UserEntity'
     */
    app.get(`/${process.env.BASE_URL_API}/users/:filter?/:page?/:perPage?`, userCtrl.getAllCtrl);
    app.get(`/${process.env.BASE_URL_API}/user/:usr_uuid`, userCtrl.getCtrl);
    app.post(`/${process.env.BASE_URL_API}/user`, userCtrl.insertCtrl);
    app.put(`/${process.env.BASE_URL_API}/user/:usr_uuid`, userCtrl.updateCtrl);
    app.delete(`/${process.env.BASE_URL_API}/user/:usr_uuid`, userCtrl.deleteCtrl);
    app.post(`/${process.env.BASE_URL_API}/login`, userCtrl.loginCtrl);
    app.post(`/${process.env.BASE_URL_API}/register`, userCtrl.saveCtrl);
    app.post(`/${process.env.BASE_URL_API}/confirm-account`, userCtrl.confirmCtrl);
    app.post(`/${process.env.BASE_URL_API}/forgot-password`, userCtrl.forgotCtrl);
    app.post(`/${process.env.BASE_URL_API}/reset-password`, userCtrl.resetCtrl);
}

export default configureUserRoutes;