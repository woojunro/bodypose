import { forwardRef, Module } from '@nestjs/common';
import { UsersService } from './users.service';
import { UsersResolver } from './users.resolver';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from './entities/user.entity';
import { AuthModule } from 'src/auth/auth.module';
import { Verification } from './entities/verification.entity';
import { MailModule } from 'src/mail/mail.module';
import { PhotosModule } from 'src/photos/photos.module';
import { PasswordReset } from './entities/password-reset.entity';
import { UserProfile } from './entities/user-profile.entity';
import { SocialAccount } from './entities/social-account.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      User,
      Verification,
      PasswordReset,
      UserProfile,
      SocialAccount,
    ]),
    forwardRef(() => AuthModule),
    MailModule,
    forwardRef(() => PhotosModule),
  ],
  providers: [UsersService, UsersResolver],
  exports: [UsersService],
})
export class UsersModule {}
