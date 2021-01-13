import { Module } from '@nestjs/common';
import * as Joi from 'joi';
import { ConfigModule } from '@nestjs/config';
import { GraphQLModule } from '@nestjs/graphql';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UsersModule } from './users/users.module';
import { CommonModule } from './common/common.module';
import { User } from './users/entities/user.entity';
import { AuthModule } from './auth/auth.module';
import { MailModule } from './mail/mail.module';
import { Verification } from './users/entities/verification.entity';
import { StudiosModule } from './studios/studios.module';
import { Studio } from './studios/entities/studio.entity';
import { Catchphrase } from './studios/entities/catchphrase.entity';
import { UsersClickStudios } from './studios/entities/users-click-studios.entity';
import { APP_GUARD } from '@nestjs/core';
import { JwtAuthGuard } from './auth/jwt-auth.guard';
import { PhotosModule } from './photos/photos.module';
import { StudioPhoto } from './photos/entities/studio-photo.entity';
import {
  BackgroundConcept,
  CostumeConcept,
  ObjectConcept,
} from './photos/entities/photo-concept.entity';
import { UsersClickStudioPhotos } from './photos/entities/users-click-studio-photos.entity';
import { Product } from './studios/entities/product.entity';
import { UsersReviewStudios } from './studios/entities/users-review-studios.entity';

@Module({
  imports: [
    ConfigModule.forRoot({
      envFilePath: `.env.${process.env.NODE_ENV}`,
      validationSchema: Joi.object({
        NODE_ENV: Joi.string()
          .valid('development', 'production', 'test')
          .required(),
        DB_HOST: Joi.string().required(),
        DB_PORT: Joi.string().required(),
        DB_USERNAME: Joi.string().required(),
        DB_PASSWORD: Joi.string().required(),
        DB_NAME: Joi.string().required(),
        JWT_SECRET: Joi.string().required(),
        MAILGUN_API_KEY: Joi.string().required(),
        MAILGUN_DOMAIN_NAME: Joi.string().required(),
      }),
    }),
    TypeOrmModule.forRoot({
      type: 'mysql',
      host: process.env.DB_HOST,
      port: +process.env.DB_PORT,
      username: process.env.DB_USERNAME,
      password: process.env.DB_PASSWORD,
      database: process.env.DB_NAME,
      synchronize: true,
      logging: true,
      entities: [
        User,
        Verification,
        Studio,
        Catchphrase,
        UsersClickStudios,
        StudioPhoto,
        BackgroundConcept,
        CostumeConcept,
        ObjectConcept,
        UsersClickStudioPhotos,
        Product,
        UsersReviewStudios,
      ],
    }),
    GraphQLModule.forRoot({
      autoSchemaFile: true,
    }),
    AuthModule,
    MailModule,
    CommonModule,
    UsersModule,
    StudiosModule,
    PhotosModule,
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
