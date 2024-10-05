import { readFileSync } from 'fs';
import { join } from 'path';
import { IConfig } from './interfaces/config.interface';
import { PrismaClient } from '@prisma/client';
import { redisUrlParser } from '../common/utils/redis-url-parser.util';

export function config(): IConfig {
  const publicKey = readFileSync(
    join(__dirname, '..', '..', '..', 'keys/public.key'),
    'utf-8',
  );
  const privateKey = readFileSync(
    join(__dirname, '..', '..', '..', 'keys/private.key'),
    'utf-8',
  );

  return {    
    id: process.env.APP_ID,
    port: parseInt(process.env.APP_PORT, 10),
    domain: process.env.DOMAIN,
    jwt: {
      access: {
        privateKey,
        publicKey,
        time: parseInt(process.env.JWT_ACCESS_TIME, 10),
      },
      confirmation: {
        secret: process.env.JWT_CONFIRMATION_SECRET,
        time: parseInt(process.env.JWT_CONFIRMATION_TIME, 10),
      },
      resetPassword: {
        secret: process.env.JWT_RESET_PASSWORD_SECRET,
        time: parseInt(process.env.JWT_RESET_PASSWORD_TIME, 10),
      },
      refresh: {
        secret: process.env.JWT_REFRESH_SECRET,
        time: parseInt(process.env.JWT_REFRESH_TIME, 10),
      },
    },
    emailService: {
      auth: {
        user: process.env.MAILGUN_MAILFROM,
        pass: process.env.MAILGUN_PASSWORD,
      },
      key: process.env.MAILGUN_APIKEY || 'string',
      domain: process.env.MAILGUN_DOMAIN,
      host: process.env.MAILGUN_HOST
    },
    db: new PrismaClient(),
    redis: redisUrlParser(process.env.REDIS_URL)
  };
}