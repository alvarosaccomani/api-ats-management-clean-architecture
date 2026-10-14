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

    /**
     * @swagger
     * /user:
     *   post:
     *     tags:
     *       - Users
     *     summary: Crear un nuevo usuario
     *     description: Inserta un usuario localmente validando que nick y email no existan previamente.
     *     security:
     *       - bearerAuth: []
     *     requestBody:
     *       required: true
     *       content:
     *         application/json:
     *           schema:
     *             $ref: '#/components/schemas/UserInputDTO'
     *     responses:
     *       200:
     *         description: Usuario insertado exitosamente.
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
     *                   example: Usuario insertado.
     *                 data:
     *                   $ref: '#/components/schemas/UserEntity'
     *       400:
     *         description: Datos inválidos o usuario ya existente.
     *         content:
     *           application/json:
     *             schema:
     *               $ref: '#/components/schemas/ErrorResponse'
     */
    app.post(`/${process.env.BASE_URL_API}/user`, userCtrl.insertCtrl);

    /**
     * @swagger
     * /user/{usr_uuid}:
     *   put:
     *     tags:
     *       - Users
     *     summary: Actualizar un usuario existente
     *     description: Actualiza los datos del usuario especificado por su UUID.
     *     security:
     *       - bearerAuth: []
     *     parameters:
     *       - in: path
     *         name: usr_uuid
     *         required: true
     *         schema:
     *           type: string
     *           format: uuid
     *         description: UUID del usuario a actualizar
     *     requestBody:
     *       required: true
     *       content:
     *         application/json:
     *           schema:
     *             $ref: '#/components/schemas/UserUpdateDTO'
     *     responses:
     *       200:
     *         description: Usuario actualizado con éxito.
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
     *                   example: Usuario actualizado.
     *                 data:
     *                   $ref: '#/components/schemas/UserEntity'
     *       400:
     *         description: Datos de actualización inválidos.
     *         content:
     *           application/json:
     *             schema:
     *               $ref: '#/components/schemas/ErrorResponse'
     */
    app.put(`/${process.env.BASE_URL_API}/user/:usr_uuid`, userCtrl.updateCtrl);

    /**
     * @swagger
     * /user/{usr_uuid}:
     *   delete:
     *     tags:
     *       - Users
     *     summary: Eliminar un usuario
     *     description: Da de baja al usuario especificado por su UUID.
     *     security:
     *       - bearerAuth: []
     *     parameters:
     *       - in: path
     *         name: usr_uuid
     *         required: true
     *         schema:
     *           type: string
     *           format: uuid
     *         description: UUID del usuario a eliminar
     *     responses:
     *       200:
     *         description: Usuario eliminado con éxito.
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
     *                   example: Usuario eliminado.
     *       400:
     *         description: Error al eliminar el usuario.
     *         content:
     *           application/json:
     *             schema:
     *               $ref: '#/components/schemas/ErrorResponse'
     */
    app.delete(`/${process.env.BASE_URL_API}/user/:usr_uuid`, userCtrl.deleteCtrl);
}

export default configureUserRoutes;