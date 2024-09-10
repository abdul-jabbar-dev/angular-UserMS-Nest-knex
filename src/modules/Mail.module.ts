import { Module } from "@nestjs/common";
import { MailService } from "../service/mail.service";
import { MailerModule } from "@nestjs-modules/mailer";
import { KnexService } from "src/service/knex.service";

@Module({
  imports: [
    MailerModule.forRoot({
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
  providers: [MailService, KnexService],
  exports: [MailService],
})
export class MailModule {}
