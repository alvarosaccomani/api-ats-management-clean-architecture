import { Express } from "express";
import { SequelizeAuthRepository } from "../../repository/auth/sequelize-auth.repository";
import { SequelizeRepository } from "../../repository/user/sequelize-user.repository";
import { AuthUseCase } from "../../../application/auth/auth-use-case";
import { UserUseCase } from "../../../application/user/user-use-case";
import { AuthController } from "../../controller/auth/auth.controller";
import SocketAdapter from "../../services/socketAdapter";

function configureAuthRoutes(app: Express, socketAdapter: SocketAdapter) {
    const sequelizeAuthRepository = new SequelizeAuthRepository();
    const sequelizeUserRepository = new SequelizeRepository();
    
    const authUseCase = new AuthUseCase(sequelizeAuthRepository);
    const userUseCase = new UserUseCase(sequelizeUserRepository);
    
    const authCtrl = new AuthController(authUseCase, userUseCase);
    
    /**
     * @swagger
     * /login:
     *   post:
     *     tags:
     *       - Auth
     *     summary: Iniciar sesión de usuario
     *     description: Autentica al usuario mediante credenciales y genera un token JWT si gettoken es true.
     *     requestBody:
     *       required: true
     *       content:
     *         application/json:
     *           schema:
     *             $ref: '#/components/schemas/LoginDTO'
     *     responses:
     *       200:
     *         description: Autenticación exitosa.
     *         content:
     *           application/json:
     *             schema:
     *               $ref: '#/components/schemas/StandardResponse'
     *       400:
     *         description: Credenciales inválidas o datos incompletos.
     *         content:
     *           application/json:
     *             schema:
     *               $ref: '#/components/schemas/ErrorResponse'
     */
    app.post(`/${process.env.BASE_URL_API}/login`, authCtrl.loginCtrl);
    app.post(`/${process.env.BASE_URL_API}/register`, authCtrl.saveCtrl);
    app.post(`/${process.env.BASE_URL_API}/confirm-account`, authCtrl.confirmCtrl);
    app.post(`/${process.env.BASE_URL_API}/forgot-password`, authCtrl.forgotCtrl);
    app.post(`/${process.env.BASE_URL_API}/reset-password`, authCtrl.resetCtrl);
    
    /**
     * @swagger
     * /auth/sso/verify:
     *   post:
     *     tags:
     *       - Auth
     *     summary: Verificar sesión federada SSO
     *     description: Valida el token SSO contra el servicio centralizado.
     *     security:
     *       - bearerAuth: []
     *     requestBody:
     *       required: true
     *       content:
     *         application/json:
     *           schema:
     *             type: object
     *             required:
     *               - sso_token
     *             properties:
     *               sso_token:
     *                 type: string
     *                 example: eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
     *     responses:
     *       200:
     *         description: Token SSO validado correctamente.
     *         content:
     *           application/json:
     *             schema:
     *               $ref: '#/components/schemas/StandardResponse'
     *       400:
     *         description: Token SSO inválido o expirado.
     *         content:
     *           application/json:
     *             schema:
     *               $ref: '#/components/schemas/ErrorResponse'
     */
    app.post(`/${process.env.BASE_URL_API}/auth/sso/verify`, authCtrl.verifySSOTokenCtrl);
    app.get(`/${process.env.BASE_URL_API}/auth/sso/config`, authCtrl.getAppConfigCtrl);
    app.post(`/${process.env.BASE_URL_API}/auth/sso/log-auth`, authCtrl.logAuthCtrl);
}

export default configureAuthRoutes;
