import { MailerService } from "@nestjs-modules/mailer";
import { Injectable } from "@nestjs/common";
import * as fs from "fs";
import * as path from "path";

import { KnexService } from "./knex.service";

@Injectable()
export class MailService {
  constructor(
    private readonly knexService: KnexService,
    public mailerService: MailerService
  ) {}

  async sendMail({
    to,
    from,
    subject,
    text,
    html,
  }: {
    to: string;
    from: string;
    subject: string;
    text?: string;
    html?: string;
  }) {
    return await this.mailerService.sendMail({
      to,
      from,
      subject,
      text,
      html,
    });
  }

  async sendResetPasswordMail(to: string, name: string, resetCode: string) {
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
}
