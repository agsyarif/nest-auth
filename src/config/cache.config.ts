import { CacheModuleOptions, CacheOptionsFactory } from '@nestjs/cache-manager';
import {
  Injectable,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import * as redisStore from 'cache-manager-redis-store';

@Injectable()
export class CacheConfig implements CacheOptionsFactory {
  constructor(private readonly configService: ConfigService) {}

  async createCacheOptions(): Promise<CacheModuleOptions> {
    return {
      // store: await redisStore({
      //   ...this.configService.get('redis'),
      //   ttl: this.configService.get<number>('jwt.refresh.time') * 1000,
      // }),
      store: redisStore,
      host: 'localhost',
      port: 6380,
    };
  }
}