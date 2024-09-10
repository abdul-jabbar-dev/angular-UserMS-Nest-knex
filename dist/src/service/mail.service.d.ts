import { MailerService } from "@nestjs-modules/mailer";
import { KnexService } from "./knex.service";
export declare class MailService {
    private readonly knexService;
    mailerService: MailerService;
    constructor(knexService: KnexService, mailerService: MailerService);
    sendMail({ to, from, subject, text, html, }: {
        to: string;
        from: string;
        subject: string;
        text?: string;
        html?: string;
    }): Promise<any>;
    sendResetPasswordMail(to: string, name: string, resetCode: string): Promise<any>;
}
