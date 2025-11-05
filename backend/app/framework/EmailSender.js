import nodemailer from 'nodemailer';
import { loggerFunc } from './functions.js';
class EmailSender {
    static transporter;
    static init() {
        //az alábbi sor kell vissza!
        //secure: process.env.SMTP_SECURE === 'true',
        this.transporter = nodemailer.createTransport({
            host: process.env.SMTP_HOST,
            port: Number(process.env.SMTP_PORT),
            auth: {
                user: process.env.SMTP_USER,
                pass: process.env.SMTP_PASS,
            },
        });
    }
    static async sendMail(mailOptions) {
        try {
            const info = await this.transporter.sendMail(mailOptions);
            console.log('Message sent: %s', info.messageId);
            console.log('Preview URL: %s', nodemailer.getTestMessageUrl(info));
            return info.messageId !== null && info.messageId !== undefined;
        }
        catch (error) {
            console.error('Error sending email:', error);
            loggerFunc(error, "EmailSender", "sendMail");
            return false;
        }
    }
}
EmailSender.init();
export default EmailSender;
