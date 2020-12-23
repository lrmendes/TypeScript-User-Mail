import * as nodemailer from "nodemailer";
import config from '../configs/configs';

interface IMailMessage {
    subject: string;
    body: string;
    attachment ?: Array<string>;
}

interface IMessageDTO {
    from: string;
    to: string;
    message: IMailMessage;
}

interface IEmailService {
    sendMail(request: IMessageDTO): void;
}

class EmailService implements IEmailService {

    constructor (
        public mail: IMessageDTO
    ) {}

    async sendMail() {

        let mailOptions = {
            from: this.mail.from,
            to: this.mail.to,
            subject: this.mail.message.subject,
            html: this.mail.message.body
        };
        
        const transporter = nodemailer.createTransport({
            host: config.host,
            port: config.port,
            secure: false,
            auth: {
                user: config.user,
                pass: config.password
            },
            tls: { rejectUnauthorized: false }
        });

        return await transporter.sendMail(mailOptions).then(response => {
            return { data: response?.messageId || "success", code: 200};
        }).catch(error => {
            return { data: error?.message || "error", code: 400}
        });
        
    }
}

export default EmailService;