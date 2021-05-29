import { forwardRef, Module } from '@nestjs/common';
import { UsersService } from './users.service';
import { UsersResolver } from './users.resolver';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from './entities/user.entity';
import { Verification } from './entities/verification.entity';
import { MailModule } from 'src/mail/mail.module';
import { PhotosModule } from 'src/photos/photos.module';
import { PasswordReset } from './entities/password-reset.entity';
import { UserProfile } from './entities/user-profile.entity';
import { UserOauth } from './entities/user-oauth.entity';
import { UploadsModule } from 'src/uploads/uploads.module';
import { AuthModule } from 'src/auth/auth.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      User,
      Verification,
      PasswordReset,
      UserProfile,
      UserOauth,
    ]),
    MailModule,
    forwardRef(() => AuthModule),
    forwardRef(() => PhotosModule),
    forwardRef(() => UploadsModule),
  ],
  providers: [UsersService, UsersResolver],
  exports: [UsersService],
})
export class UsersModule {}
