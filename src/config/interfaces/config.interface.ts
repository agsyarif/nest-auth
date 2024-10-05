import { PrismaClient } from '@prisma/client';
import { IEmailConfig } from './email-config.interface';
import { IJwt } from './jwt.interface';
import { RedisOptions } from 'ioredis';

export interface IConfig {
  id: string;
  port: number;
  domain: string;
  db: PrismaClient;
  jwt: IJwt;
  emailService: IEmailConfig;
  redis: RedisOptions;
}