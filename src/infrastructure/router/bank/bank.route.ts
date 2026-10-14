import { Express } from "express";
import { SequelizeBankRepository } from "../../repository/bank/sequelize-bank.repository";
import { BankUseCase } from "../../../application/bank/bank-use-case";
import { BankController } from "../../controller/bank/bank.controller";
import SocketAdapter from "../../services/socketAdapter";

function configureBankRoutes(app: Express, socketAdapter: SocketAdapter) {
    /*
    *   Iniciar repository
    */
    
    const sequelizeBankRepository = new SequelizeBankRepository();
    
    /*
    *   Iniciar casos de uso
    */
    
    const bankUseCase = new BankUseCase(sequelizeBankRepository);
    
    /*
    *   Iniciar controller
    */
    
    const bankCtrl = new BankController(bankUseCase, socketAdapter);
    
    /**
     * @swagger
     * /banks/{usr_uuid}:
     *   get:
     *     tags:
     *       - Banks
     *     summary: Listar bancos de un usuario
     *     description: Retorna la lista paginada o completa de bancos asociados al usuario.
     *     security:
     *       - bearerAuth: []
     *     parameters:
     *       - in: path
     *         name: usr_uuid
     *         required: true
     *         schema:
     *           type: string
     *           format: uuid
     *         description: UUID del usuario
     *     responses:
     *       200:
     *         description: Bancos obtenidos exitosamente.
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
     *                   example: Bancos retornados.
     *                 data:
     *                   type: array
     *                   items:
     *                     $ref: '#/components/schemas/BankEntity'
     *       400:
     *         description: Error al recuperar los bancos.
     *         content:
     *           application/json:
     *             schema:
     *               $ref: '#/components/schemas/ErrorResponse'
     */
    app.get(`/${process.env.BASE_URL_API}/banks/:usr_uuid/:filter?/:page?/:perPage?`, bankCtrl.getAllCtrl);

    /**
     * @swagger
     * /bank/{usr_uuid}/{ban_uuid}:
     *   get:
     *     tags:
     *       - Banks
     *     summary: Obtener detalle de banco
     *     description: Retorna la información de un banco específico por su UUID y el usuario.
     *     security:
     *       - bearerAuth: []
     *     parameters:
     *       - in: path
     *         name: usr_uuid
     *         required: true
     *         schema:
     *           type: string
     *           format: uuid
     *         description: UUID del usuario
     *       - in: path
     *         name: ban_uuid
     *         required: true
     *         schema:
     *           type: string
     *           format: uuid
     *         description: UUID del banco
     *     responses:
     *       200:
     *         description: Banco retornado con éxito.
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
     *                   example: Banco retornado.
     *                 data:
     *                   $ref: '#/components/schemas/BankEntity'
     *       400:
     *         description: Error o banco no encontrado.
     *         content:
     *           application/json:
     *             schema:
     *               $ref: '#/components/schemas/ErrorResponse'
     */
    app.get(`/${process.env.BASE_URL_API}/bank/:usr_uuid/:ban_uuid`, bankCtrl.getCtrl);

    /**
     * @swagger
     * /bank:
     *   post:
     *     tags:
     *       - Banks
     *     summary: Crear un nuevo banco
     *     description: Da de alta un nuevo banco asociado al usuario.
     *     security:
     *       - bearerAuth: []
     *     requestBody:
     *       required: true
     *       content:
     *         application/json:
     *           schema:
     *             $ref: '#/components/schemas/BankInputDTO'
     *     responses:
     *       200:
     *         description: Banco insertado exitosamente.
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
     *                   example: Banco insertado.
     *                 data:
     *                   $ref: '#/components/schemas/BankEntity'
     *       400:
     *         description: Error al insertar el banco.
     *         content:
     *           application/json:
     *             schema:
     *               $ref: '#/components/schemas/ErrorResponse'
     */
    app.post(`/${process.env.BASE_URL_API}/bank`, bankCtrl.insertCtrl);

    /**
     * @swagger
     * /bank/{usr_uuid}/{ban_uuid}:
     *   put:
     *     tags:
     *       - Banks
     *     summary: Actualizar banco
     *     description: Modifica los datos de un banco existente.
     *     security:
     *       - bearerAuth: []
     *     parameters:
     *       - in: path
     *         name: usr_uuid
     *         required: true
     *         schema:
     *           type: string
     *           format: uuid
     *         description: UUID del usuario
     *       - in: path
     *         name: ban_uuid
     *         required: true
     *         schema:
     *           type: string
     *           format: uuid
     *         description: UUID del banco
     *     requestBody:
     *       required: true
     *       content:
     *         application/json:
     *           schema:
     *             $ref: '#/components/schemas/BankUpdateDTO'
     *     responses:
     *       200:
     *         description: Banco actualizado con éxito.
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
     *                   example: Banco actualizado.
     *                 data:
     *                   $ref: '#/components/schemas/BankEntity'
     *       400:
     *         description: Error al actualizar el banco.
     *         content:
     *           application/json:
     *             schema:
     *               $ref: '#/components/schemas/ErrorResponse'
     */
    app.put(`/${process.env.BASE_URL_API}/bank/:usr_uuid/:ban_uuid`, bankCtrl.updateCtrl);

    /**
     * @swagger
     * /bank/{usr_uuid}/{ban_uuid}:
     *   delete:
     *     tags:
     *       - Banks
     *     summary: Eliminar banco
     *     description: Da de baja un banco por su identificador.
     *     security:
     *       - bearerAuth: []
     *     parameters:
     *       - in: path
     *         name: usr_uuid
     *         required: true
     *         schema:
     *           type: string
     *           format: uuid
     *         description: UUID del usuario
     *       - in: path
     *         name: ban_uuid
     *         required: true
     *         schema:
     *           type: string
     *           format: uuid
     *         description: UUID del banco
     *     responses:
     *       200:
     *         description: Banco eliminado exitosamente.
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
     *                   example: Banco eliminado.
     *       400:
     *         description: Error al eliminar el banco.
     *         content:
     *           application/json:
     *             schema:
     *               $ref: '#/components/schemas/ErrorResponse'
     */
    app.delete(`/${process.env.BASE_URL_API}/bank/:usr_uuid/:ban_uuid`, bankCtrl.deleteCtrl);
}

export default configureBankRoutes;