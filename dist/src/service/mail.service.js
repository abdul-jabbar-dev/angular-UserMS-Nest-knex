"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.MailService = void 0;
const mailer_1 = require("@nestjs-modules/mailer");
const common_1 = require("@nestjs/common");
const knex_service_1 = require("./knex.service");
let MailService = class MailService {
    constructor(knexService, mailerService) {
        this.knexService = knexService;
        this.mailerService = mailerService;
    }
    async sendMail({ to, from, subject, text, html, }) {
        return await this.mailerService.sendMail({
            to,
            from,
            subject,
            text,
            html,
        });
    }
    async sendResetPasswordMail(to, name, resetCode) {
        return await this.sendMail({
            from: "abdul.jabbar.dev@gmail.com",
            subject: "Reset Code",
            html: `<!DOCTYPE html>
              <html>
              <head>
                <meta charset="UTF-8">
                <title>Reset Password</title>
              </head>
              <body>
                <h1>Password Reset</h1>
                <p>Hello ${name},</p>
                <p>Here is your password reset code: <strong>${resetCode}</strong></p>
                <p>If you did not request this, please ignore this email.</p>
                <p>Thank you!</p>
              </body>
              </html>
              `,
            to: to,
        });
    }
};
exports.MailService = MailService;
exports.MailService = MailService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [knex_service_1.KnexService,
        mailer_1.MailerService])
], MailService);
//# sourceMappingURL=mail.service.js.map