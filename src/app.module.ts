import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UserModule } from './user/user.module';
import { CommonModule } from './common/common.module';
import { AuthModule } from './auth/auth.module';
import { JwtModule } from './jwt/jwt.module';
import { PrismaModule } from './prisma/prisma.module';
import { ConfigModule } from '@nestjs/config';
import { validationSchema } from './config/config.schema';
import { config } from './config';
import { CacheModule } from '@nestjs/cache-manager';
import { CacheConfig } from './config/cache.config';
import { UploadModule } from './upload/upload.module';
import { ArticleModule } from './article/article.module';
import { AccessControlModule } from './access-control/access-control.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      validationSchema,
      load: [config],
    }),
    CacheModule.registerAsync({
      isGlobal: true,
      imports: [ConfigModule],
      useClass: CacheConfig,

      // store: redisStore,
      // host: 'localhost',
      // port: 6379,
    }),
    // CacheModule.register({ isGlobal: true }),
    UserModule,
    CommonModule,
    AuthModule,
    JwtModule,
    PrismaModule,
    UploadModule,
    ArticleModule,
    AccessControlModule
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
