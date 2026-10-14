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

    /**
     * @swagger
     * /persons/{scp_uuid}:
     *   get:
     *     tags:
     *       - Persons
     *     summary: Listar personas por ámbito
     *     description: Retorna todas las personas asociadas a un ámbito (scope) específico.
     *     security:
     *       - bearerAuth: []
     *     parameters:
     *       - in: path
     *         name: scp_uuid
     *         required: true
     *         schema:
     *           type: string
     *           format: uuid
     *         description: UUID del ámbito (scope)
     *     responses:
     *       200:
     *         description: Lista de personas obtenida exitosamente.
     *         content:
     *           application/json:
     *             schema:
     *               type: object
     *               properties:
     *                 success:
     *                   type: boolean
     *                   example: true
     *                 data:
     *                   type: array
     *                   items:
     *                     $ref: '#/components/schemas/PersonEntity'
     *       500:
     *         description: Error interno al obtener personas.
     *         content:
     *           application/json:
     *             schema:
     *               $ref: '#/components/schemas/ErrorResponse'
     */
    app.get(`${apiPrefix}/persons/:scp_uuid`, personCtrl.getAllCtrl);

    /**
     * @swagger
     * /person/{prs_uuid}:
     *   get:
     *     tags:
     *       - Persons
     *     summary: Obtener detalle de persona por UUID
     *     description: Retorna la información completa de una persona.
     *     security:
     *       - bearerAuth: []
     *     parameters:
     *       - in: path
     *         name: prs_uuid
     *         required: true
     *         schema:
     *           type: string
     *           format: uuid
     *         description: UUID de la persona
     *     responses:
     *       200:
     *         description: Persona encontrada.
     *         content:
     *           application/json:
     *             schema:
     *               type: object
     *               properties:
     *                 success:
     *                   type: boolean
     *                   example: true
     *                 data:
     *                   $ref: '#/components/schemas/PersonEntity'
     *       500:
     *         description: Error interno al consultar la persona.
     *         content:
     *           application/json:
     *             schema:
     *               $ref: '#/components/schemas/ErrorResponse'
     */
    app.get(`${apiPrefix}/person/:prs_uuid`, personCtrl.getDetailCtrl);

    /**
     * @swagger
     * /person:
     *   post:
     *     tags:
     *       - Persons
     *     summary: Crear una nueva persona
     *     description: Da de alta una nueva persona dentro de un ámbito.
     *     security:
     *       - bearerAuth: []
     *     requestBody:
     *       required: true
     *       content:
     *         application/json:
     *           schema:
     *             $ref: '#/components/schemas/PersonInputDTO'
     *     responses:
     *       201:
     *         description: Persona creada exitosamente.
     *         content:
     *           application/json:
     *             schema:
     *               type: object
     *               properties:
     *                 success:
     *                   type: boolean
     *                   example: true
     *                 data:
     *                   $ref: '#/components/schemas/PersonEntity'
     *       500:
     *         description: Error al crear la persona.
     *         content:
     *           application/json:
     *             schema:
     *               $ref: '#/components/schemas/ErrorResponse'
     */
    app.post(`${apiPrefix}/person`, personCtrl.insertCtrl);

    /**
     * @swagger
     * /person/{prs_uuid}:
     *   put:
     *     tags:
     *       - Persons
     *     summary: Actualizar persona existente
     *     description: Modifica los atributos de una persona especificada por su UUID.
     *     security:
     *       - bearerAuth: []
     *     parameters:
     *       - in: path
     *         name: prs_uuid
     *         required: true
     *         schema:
     *           type: string
     *           format: uuid
     *         description: UUID de la persona a modificar
     *     requestBody:
     *       required: true
     *       content:
     *         application/json:
     *           schema:
     *             $ref: '#/components/schemas/PersonInputDTO'
     *     responses:
     *       200:
     *         description: Persona actualizada exitosamente.
     *         content:
     *           application/json:
     *             schema:
     *               type: object
     *               properties:
     *                 success:
     *                   type: boolean
     *                   example: true
     *                 data:
     *                   $ref: '#/components/schemas/PersonEntity'
     *       500:
     *         description: Error al actualizar la persona.
     *         content:
     *           application/json:
     *             schema:
     *               $ref: '#/components/schemas/ErrorResponse'
     */
    app.put(`${apiPrefix}/person/:prs_uuid`, personCtrl.updateCtrl);

    /**
     * @swagger
     * /person/{prs_uuid}:
     *   delete:
     *     tags:
     *       - Persons
     *     summary: Eliminar persona
     *     description: Da de baja a una persona por su UUID.
     *     security:
     *       - bearerAuth: []
     *     parameters:
     *       - in: path
     *         name: prs_uuid
     *         required: true
     *         schema:
     *           type: string
     *           format: uuid
     *         description: UUID de la persona a eliminar
     *     responses:
     *       200:
     *         description: Persona eliminada exitosamente.
     *         content:
     *           application/json:
     *             schema:
     *               type: object
     *               properties:
     *                 success:
     *                   type: boolean
     *                   example: true
     *                 data:
     *                   type: object
     *       500:
     *         description: Error al eliminar la persona.
     *         content:
     *           application/json:
     *             schema:
     *               $ref: '#/components/schemas/ErrorResponse'
     */
    app.delete(`${apiPrefix}/person/:prs_uuid`, personCtrl.deleteCtrl);
}

export default configurePersonRoutes;
