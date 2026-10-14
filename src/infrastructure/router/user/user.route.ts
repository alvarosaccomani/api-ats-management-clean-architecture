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
     * /users:
     *   get:
     *     tags:
     *       - Users
     *     summary: Obtiene la lista de usuarios registrados
     *     description: Retorna una lista de todos los usuarios registrados en el sistema.
     *     security:
     *       - bearerAuth: []
     *     responses:
     *       200:
     *         description: Operación exitosa. Retorna la lista de usuarios.
     *         content:
     *           application/json:
     *             schema:
     *               type: object
     *               properties:
     *                 success:
     *                   type: boolean
     *                   example: true
     *                 message:
     *                   type: string
     *                   example: Usuarios retornados.
     *                 data:
     *                   type: array
     *                   items:
     *                     $ref: '#/components/schemas/UserEntity'
     *       401:
     *         description: No autorizado. Token faltante o inválido.
     *         content:
     *           application/json:
     *             schema:
     *               $ref: '#/components/schemas/ErrorResponse'
     */
    app.get(`/${process.env.BASE_URL_API}/users/:filter?/:page?/:perPage?`, userCtrl.getAllCtrl);

    /**
     * @swagger
     * /user/{usr_uuid}:
     *   get:
     *     tags:
     *       - Users
     *     summary: Obtiene el detalle de un usuario por UUID
     *     description: Retorna la información detallada del usuario correspondiente al UUID provisto.
     *     security:
     *       - bearerAuth: []
     *     parameters:
     *       - in: path
     *         name: usr_uuid
     *         required: true
     *         schema:
     *           type: string
     *           format: uuid
     *         description: UUID del usuario a consultar
     *     responses:
     *       200:
     *         description: Usuario encontrado.
     *         content:
     *           application/json:
     *             schema:
     *               type: object
     *               properties:
     *                 success:
     *                   type: boolean
     *                   example: true
     *                 message:
     *                   type: string
     *                   example: Usuario encontrado.
     *                 data:
     *                   $ref: '#/components/schemas/UserEntity'
     *       401:
     *         description: No autorizado.
     *         content:
     *           application/json:
     *             schema:
     *               $ref: '#/components/schemas/ErrorResponse'
     *       404:
     *         description: Usuario no encontrado.
     *         content:
     *           application/json:
     *             schema:
     *               $ref: '#/components/schemas/ErrorResponse'
     */
    app.get(`/${process.env.BASE_URL_API}/user/:usr_uuid`, userCtrl.getCtrl);
    app.post(`/${process.env.BASE_URL_API}/user`, userCtrl.insertCtrl);
    app.put(`/${process.env.BASE_URL_API}/user/:usr_uuid`, userCtrl.updateCtrl);
    app.delete(`/${process.env.BASE_URL_API}/user/:usr_uuid`, userCtrl.deleteCtrl);
}

export default configureUserRoutes;