import { forwardRef, Module } from '@nestjs/common';
import { UsersService } from './users.service';
import { UsersResolver } from './users.resolver';
import { TypeOrmModule } from '@nestjs/typeorm';
import { MailModule } from 'src/mail/mail.module';
import { PhotosModule } from 'src/photos/photos.module';
import { UploadsModule } from 'src/uploads/uploads.module';
import { AuthModule } from 'src/auth/auth.module';
import { USERS_SERVICE_ENTITIES } from 'src/common/constants/entity-list.constant';

@Module({
  imports: [
    TypeOrmModule.forFeature([...USERS_SERVICE_ENTITIES]),
    MailModule,
    forwardRef(() => AuthModule),
    forwardRef(() => PhotosModule),
    forwardRef(() => UploadsModule),
  ],
  providers: [UsersService, UsersResolver],
  exports: [UsersService],
})
export class UsersModule {}
