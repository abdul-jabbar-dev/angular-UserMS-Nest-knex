"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.MailModule = void 0;
const common_1 = require("@nestjs/common");
const mail_service_1 = require("../service/mail.service");
const mailer_1 = require("@nestjs-modules/mailer");
const knex_service_1 = require("../service/knex.service");
let MailModule = class MailModule {
};
exports.MailModule = MailModule;
exports.MailModule = MailModule = __decorate([
    (0, common_1.Module)({
        imports: [
            mailer_1.MailerModule.forRoot({
                transport: {
                    host: "smtp.gmail.com",
                    port: 587,
                    secure: false,
                    auth: {
                        user: "abdul.jabbar.dev@gmail.com",
                        pass: "ekhg nlay dyvg ktwt",
                    },
                },
                defaults: {
                    from: '"No Reply" <no-reply@example.com>',
                },
            }),
        ],
        providers: [mail_service_1.MailService, knex_service_1.KnexService],
        exports: [mail_service_1.MailService],
    })
], MailModule);
//# sourceMappingURL=Mail.module.js.map