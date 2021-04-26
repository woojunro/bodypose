import got from 'got';
import * as FormData from 'form-data';
import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { EmailVar } from './mail.interfaces';

@Injectable()
export class MailService {
  private apiKey: string;
  private domainName: string;

  constructor(private readonly configService: ConfigService) {
    this.apiKey = configService.get<string>('MAILGUN_API_KEY');
    this.domainName = configService.get<string>('MAILGUN_DOMAIN_NAME');
  }

  async sendEmail(
    to: string,
    subject: string,
    template: string,
    emailVars: EmailVar[],
  ): Promise<boolean> {
    try {
      const form = new FormData();
      form.append('from', `BODYPOSE <bodypose@${this.domainName}>`);
      form.append('to', to);
      form.append('subject', subject);
      form.append('template', template);
      form.append('t:version', 'v2');
      emailVars.forEach(emailVar => {
        form.append(`v:${emailVar.key}`, emailVar.value);
      });
      const response = await got.post(
        `https://api.mailgun.net/v3/${this.domainName}/messages`,
        {
          headers: {
            Authorization: `Basic ${Buffer.from(`api:${this.apiKey}`).toString(
              'base64',
            )}`,
          },
          body: form,
        },
      );
      if (response.statusCode !== 200) {
        throw new Error('Mailgun API error');
      }
      return true;
    } catch (e) {
      console.log(e);
      return false;
    }
  }

  async sendEmailVerification(
    email: string,
    nickname: string,
    userId: number,
    code: string,
  ): Promise<boolean> {
    try {
      const ok = await this.sendEmail(
        email,
        '[바디포즈] 이메일을 확인해주세요.',
        'bodypose-email-verification',
        [
          { key: 'nickname', value: nickname },
          { key: 'userId', value: String(userId) },
          { key: 'code', value: code },
        ],
      );
      return ok;
    } catch (e) {
      console.log(e);
      return false;
    }
  }

  async sendPasswordReset(
    email: string,
    nickname: string,
    userId: number,
    code: string,
  ): Promise<boolean> {
    try {
      const ok = await this.sendEmail(
        email,
        '[바디포즈] 비밀번호 변경',
        'bodypose-password-reset',
        [
          { key: 'nickname', value: nickname },
          { key: 'userId', value: String(userId) },
          { key: 'code', value: code },
        ],
      );
      return ok;
    } catch (e) {
      console.log(e);
      return false;
    }
  }
}
