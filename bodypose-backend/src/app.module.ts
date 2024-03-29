import { Module } from '@nestjs/common';
import * as Joi from 'joi';
import { ConfigModule } from '@nestjs/config';
import { GraphQLModule } from '@nestjs/graphql';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UsersModule } from './users/users.module';
import { CommonModule } from './common/common.module';
import { AuthModule } from './auth/auth.module';
import { MailModule } from './mail/mail.module';
import { StudiosModule } from './studios/studios.module';
import { APP_GUARD } from '@nestjs/core';
import { JwtAuthGuard } from './auth/jwt-auth.guard';
import { PhotosModule } from './photos/photos.module';
import { UploadsModule } from './uploads/uploads.module';
import { GraphQLError, GraphQLFormattedError } from 'graphql';
import { NoticesModule } from './notices/notices.module';
import { ENTITY_LIST } from './common/constants/entity-list.constant';
import { InsightsModule } from './insights/insights.module';
import { MagazineModule } from './magazine/magazine.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath:
        process.env.NODE_ENV !== 'production'
          ? `.env.${process.env.NODE_ENV}`
          : 'app.yaml',
      validationSchema: Joi.object({
        NODE_ENV: Joi.string()
          .valid('development', 'production', 'test')
          .required(),
        DB_HOST:
          process.env.NODE_ENV === 'development'
            ? Joi.string().required()
            : null,
        DB_PORT:
          process.env.NODE_ENV === 'development'
            ? Joi.string().required()
            : null,
        DB_USERNAME: Joi.string().required(),
        DB_PASSWORD: Joi.string().required(),
        DB_NAME: Joi.string().required(),
        JWT_SECRET: Joi.string().required(),
        MAILGUN_API_KEY: Joi.string().required(),
        MAILGUN_DOMAIN_NAME: Joi.string().required(),
        GOOGLE_CLOUD_PROJECT: Joi.string().required(),
        GCLOUD_STORAGE_BUCKET: Joi.string().required(),
        KAKAO_ADMIN_KEY: Joi.string().required(),
        APPLE_LOGIN_P8_BASE64: Joi.string().required(),
        APPLE_LOGIN_TEAM_ID: Joi.string().required(),
        APPLE_LOGIN_KEY_ID: Joi.string().required(),
        APPLE_LOGIN_CLIENT_ID: Joi.string().required(),
        GOOGLE_AUTH_CLIENT_ID: Joi.string().required(),
        GOOGLE_APPLICATION_CREDENTIALS:
          process.env.NODE_ENV === 'development'
            ? Joi.string().required()
            : null,
        CLOUD_SQL_CONNECTION_NAME:
          process.env.NODE_ENV === 'production'
            ? Joi.string().required()
            : null,
      }),
    }),
    process.env.NODE_ENV === 'production'
      ? TypeOrmModule.forRoot({
          type: 'mysql',
          username: process.env.DB_USERNAME,
          password: process.env.DB_PASSWORD,
          database: process.env.DB_NAME,
          extra: {
            socketPath: `/cloudsql/${process.env.CLOUD_SQL_CONNECTION_NAME}`,
          },
          synchronize: false,
          logging: false,
          entities: ENTITY_LIST,
          charset: 'utf8mb4',
        })
      : TypeOrmModule.forRoot({
          type: 'mysql',
          host: process.env.DB_HOST,
          port: +process.env.DB_PORT,
          username: process.env.DB_USERNAME,
          password: process.env.DB_PASSWORD,
          database: process.env.DB_NAME,
          synchronize: true,
          logging: true,
          entities: ENTITY_LIST,
          charset: 'utf8mb4',
          // dropSchema: true,
        }),
    GraphQLModule.forRoot({
      autoSchemaFile: true,
      formatError: (error: GraphQLError) => {
        if (process.env.NODE_ENV === 'development') {
          return error;
        }
        const graphQLFormattedError: GraphQLFormattedError = {
          message: error.message,
        };
        return graphQLFormattedError;
      },
      context: ({ req, res }) => ({ req, res }),
      cors: {
        credentials: true,
        origin: true,
      },
    }),
    AuthModule,
    MailModule,
    CommonModule,
    UsersModule,
    StudiosModule,
    PhotosModule,
    UploadsModule,
    NoticesModule,
    InsightsModule,
    MagazineModule,
  ],
  controllers: [],
  providers: [
    {
      provide: APP_GUARD,
      useClass: JwtAuthGuard,
    },
  ],
})
export class AppModule {}
