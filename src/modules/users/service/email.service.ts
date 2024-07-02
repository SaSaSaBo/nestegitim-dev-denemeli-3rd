import { Injectable } from "@nestjs/common";
import * as nodemailer from 'nodemailer';

@Injectable()
export class EmailService {

    private transporter: nodemailer.Transporter;

    constructor() {
        this.transporter = nodemailer.createTransport({
            host: 'smtp.ethereal.email',
            port: 587,
            secure: false,
            auth: {
                user: 'german.hoppe@ethereal.email',
                pass: 'esGp4VqsWSJs3A8tx8'
            }
        });
    }

    async sendPasswordResetEmail(to: string, token: string) {
        const resetLink = "http://localhost:3001/reset-password?token=" + token;
        const mailOptions = {
            from: 'german.hoppe@ethereal.email',
            to,
            subject: 'Sıfırlama Linki',
            text: 'Sıfırlama linkiniz buradadır:',
            html: `<a href="${resetLink}">Sıfırlama Linki</a>`
        };

        try {
            const info = await this.transporter.sendMail(mailOptions);
            console.log("Sıfırlama linki e-posta adresinize gönderildi.", info.messageId);
            return { message: "Sıfırlama linki e-posta adresinize gönderildi." };
        } catch (error) {
            throw new Error("E-posta gönderimi sırasında bir hata oluştu: " + error.message);
        }
    }
}
