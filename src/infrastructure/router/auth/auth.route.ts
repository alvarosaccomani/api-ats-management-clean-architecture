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

    /**
     * @swagger
     * /register:
     *   post:
     *     tags:
     *       - Auth
     *     summary: Registrar un nuevo usuario
     *     description: Registra un nuevo usuario tanto en el Kernel Central como localmente.
     *     requestBody:
     *       required: true
     *       content:
     *         application/json:
     *           schema:
     *             $ref: '#/components/schemas/RegisterDTO'
     *     responses:
     *       200:
     *         description: Usuario registrado con éxito.
     *         content:
     *           application/json:
     *             schema:
     *               $ref: '#/components/schemas/StandardResponse'
     *       400:
     *         description: Error en la validación o registro de usuario.
     *         content:
     *           application/json:
     *             schema:
     *               $ref: '#/components/schemas/ErrorResponse'
     */
    app.post(`/${process.env.BASE_URL_API}/register`, authCtrl.saveCtrl);

    /**
     * @swagger
     * /confirm-account:
     *   post:
     *     tags:
     *       - Auth
     *     summary: Confirmar cuenta de usuario
     *     description: Activa la cuenta mediante el token de confirmación enviado por correo.
     *     requestBody:
     *       required: true
     *       content:
     *         application/json:
     *           schema:
     *             $ref: '#/components/schemas/ConfirmAccountDTO'
     *     responses:
     *       200:
     *         description: Cuenta confirmada con éxito.
     *       400:
     *         description: Token inválido o expirado.
     *         content:
     *           application/json:
     *             schema:
     *               $ref: '#/components/schemas/ErrorResponse'
     */
    app.post(`/${process.env.BASE_URL_API}/confirm-account`, authCtrl.confirmCtrl);

    /**
     * @swagger
     * /forgot-password:
     *   post:
     *     tags:
     *       - Auth
     *     summary: Solicitar recuperación de contraseña
     *     description: Genera y envía un token de recuperación al correo provisto.
     *     requestBody:
     *       required: true
     *       content:
     *         application/json:
     *           schema:
     *             $ref: '#/components/schemas/ForgotPasswordDTO'
     *     responses:
     *       200:
     *         description: Correo de recuperación enviado.
     *         content:
     *           application/json:
     *             schema:
     *               $ref: '#/components/schemas/StandardResponse'
     *       400:
     *         description: Correo no encontrado o inválido.
     *         content:
     *           application/json:
     *             schema:
     *               $ref: '#/components/schemas/ErrorResponse'
     */
    app.post(`/${process.env.BASE_URL_API}/forgot-password`, authCtrl.forgotCtrl);

    /**
     * @swagger
     * /reset-password:
     *   post:
     *     tags:
     *       - Auth
     *     summary: Restablecer contraseña
     *     description: Actualiza la contraseña utilizando el token de reseteo recibido.
     *     requestBody:
     *       required: true
     *       content:
     *         application/json:
     *           schema:
     *             $ref: '#/components/schemas/ResetPasswordDTO'
     *     responses:
     *       200:
     *         description: Contraseña restablecida con éxito.
     *         content:
     *           application/json:
     *             schema:
     *               $ref: '#/components/schemas/StandardResponse'
     *       400:
     *         description: Token inválido o datos incompletos.
     *         content:
     *           application/json:
     *             schema:
     *               $ref: '#/components/schemas/ErrorResponse'
     */
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

    /**
     * @swagger
     * /auth/sso/config:
     *   get:
     *     tags:
     *       - Auth
     *     summary: Obtener configuración de login SSO
     *     description: Retorna el modo de inicio de sesión configurado para la aplicación (local o central).
     *     responses:
     *       200:
     *         description: Configuración obtenida correctamente.
     *         content:
     *           application/json:
     *             schema:
     *               type: object
     *               properties:
     *                 success:
     *                   type: boolean
     *                   example: true
     *                 app_login_mode:
     *                   type: string
     *                   example: central
     *                 central_login_url:
     *                   type: string
     *                   example: http://localhost:3006/auth/login?redirect=...
     */
    app.get(`/${process.env.BASE_URL_API}/auth/sso/config`, authCtrl.getAppConfigCtrl);

    /**
     * @swagger
     * /auth/sso/log-auth:
     *   post:
     *     tags:
     *       - Auth
     *     summary: Registrar log de auditoría de autenticación
     *     description: Reenvía un log de auditoría de autenticación al servicio central.
     *     requestBody:
     *       required: true
     *       content:
     *         application/json:
     *           schema:
     *             type: object
     *     responses:
     *       200:
     *         description: Auditoría registrada correctamente.
     */
    app.post(`/${process.env.BASE_URL_API}/auth/sso/log-auth`, authCtrl.logAuthCtrl);
}

export default configureAuthRoutes;
