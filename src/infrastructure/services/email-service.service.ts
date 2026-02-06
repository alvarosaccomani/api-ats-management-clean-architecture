import nodemailer from 'nodemailer';

export class EmailService {
    private transporter;

    constructor() {
        this.transporter = nodemailer.createTransport({
            service: 'Gmail', // Cambia esto según tu proveedor de correo
            host: 'smtp.gmail.com',
            port: 587,
            secure: false, // use false for STARTTLS; true for SSL on port 465
            auth: {
                user: process.env.EMAIL_FROM, // Tu correo
                pass: process.env.EMAIL_PASSWORD, // Tu contraseña
            },
        });
    }

    /**
     * Envía un correo de confirmación de cuenta.
     * @param to - Dirección de correo del destinatario.
     * @param confirmationToken - Token de confirmación.
     */
    async sendConfirmationEmail(to: string, confirmationToken: string): Promise<void> {
        //const confirmationUrl = `${process.env.URL_CONFIRMATION}/confirm-account?token=${confirmationToken}`;
        const confirmationUrl = `${process.env.URL_CONFIRMATION}/auth/account-confirmed/${confirmationToken}`;

        const mailOptions = {
            from: process.env.EMAIL_FROM,
            to,
            subject: 'Confirma tu cuenta',
            html: `
                <h1>Bienvenido/a</h1>
                <p>Gracias por registrarte. Por favor, confirma tu cuenta haciendo clic en el siguiente enlace:</p>
                <a href="${confirmationUrl}">${confirmationUrl}</a>
            `,
        };

        await this.transporter.sendMail(mailOptions);
    }

    /**
     * Envía un correo de reestablecimeinto de contraseña.
     * @param to - Dirección de correo del destinatario.
     * @param confirmationToken - Token de confirmación.
     */
    async sendReestablishmentEmail(to: string, resetToken: string): Promise<void> {
        
        const resetUrl = `${process.env.URL_RESET}/auth/reset-password/${resetToken}`;

        const mailOptions = {
            from: process.env.EMAIL_FROM,
            to,
            subject: 'Restablecimiento de contraseña',
            html: `Has solicitado restablecer tu contraseña. Haz clic en el siguiente enlace para continuar:\n\n${resetUrl}\n\nSi no has realizado esta solicitud, ignora este mensaje.`,
        };

        await this.transporter.sendMail(mailOptions);
    }
}