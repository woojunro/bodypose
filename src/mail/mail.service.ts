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
      form.append('from', `BODYPOSE <bodypose@${this.domainName}`);
      // TODO: Upgrade Mailgun account and change "to"
      form.append('to', 'blackstar0223@gmail.com');
      form.append('subject', subject);
      form.append('template', template);
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
}
