import { Injectable } from '@nestjs/common';
import nodemailer from 'nodemailer';

@Injectable()
export class MailService {
  private readonly transporter = nodemailer.createTransport({
    host: process.env.MAIL_HOST,
    port: Number(process.env.MAIL_PORT),
    secure: false,
    auth: {
      user: process.env.MAIL_USER,
      pass: process.env.MAIL_PASSWORD,
    },
  });
  async sendResetPassword(email: string, token: string): Promise<void> {
    const resetLink = `http://localhost:3000/reset-password?token=${token}`;

    await this.transporter.sendMail({
      from: `"Support" <${process.env.MAIL_FROM}>`,
      to: email,
      subject: 'Reset your password',
      html: `
        <p>You requested password reset</p>
        <p>
          <a href="${resetLink}">Click here to reset password</a>
        </p>
        <p>This link is valid for 15 minutes</p>
      `,
    });
  }
}
