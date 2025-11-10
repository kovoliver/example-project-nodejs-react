import nodemailer, { Transporter } from 'nodemailer';
import { MailOptions } from '../models/types.js';
import { loggerFunc } from './functions.js';
import dotenv from 'dotenv';
dotenv.config();

class EmailSender {
    private static transporter: Transporter;

    public static init() {
        this.transporter = nodemailer.createTransport({
            host: process.env.SMTP_HOST,
            port: Number(process.env.SMTP_PORT),
            auth: {
                user: process.env.SMTP_USER,
                pass: process.env.SMTP_PASS,
            },
        });
    }

    public static async sendMail(mailOptions: MailOptions): Promise<any> {
        try {
            const info = await this.transporter.sendMail(mailOptions);
            console.log('Message sent: %s', info.messageId);
            console.log('Preview URL: %s', nodemailer.getTestMessageUrl(info));

            return info.messageId !== null && info.messageId !== undefined;
        } catch (error:any) {
            console.error('Error sending email:', error);
            loggerFunc(error, "EmailSender", "sendMail");
            return false;
        }
    }
}

EmailSender.init();

export default EmailSender;