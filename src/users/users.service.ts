import { forwardRef, Inject, Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { InjectRepository } from '@nestjs/typeorm';
import { AuthService } from 'src/auth/auth.service';
import { unlinkKakaoUser } from 'src/auth/utils/kakaoOAuth.util';
import {
  CommonError,
  UNEXPECTED_ERROR,
} from 'src/common/constants/error.constant';
import { MailService } from 'src/mail/mail.service';
import { Repository } from 'typeorm';
import {
  CreateUserWithEmailInput,
  CreateUserWithEmailOutput,
} from './dtos/create-user.dto';
import { DeleteUserOutput } from './dtos/delete-user.dto';
import {
  CreateMyProfileInput,
  CreateMyProfileOutput,
  GetMyProfileOutput,
  UpdateMyProfileInput,
  UpdateMyProfileOutput,
} from './dtos/user-profile.dto';
import {
  RequestPasswordResetInput,
  RequestPasswordResetOutput,
  UpdatePasswordInput,
  UpdatePasswordOutput,
} from './dtos/update-password.dto';
import { VerifyUserOutput } from './dtos/verify-user.dto';
import { PasswordReset } from './entities/password-reset.entity';
import {
  SocialAccount,
  SocialProvider,
} from './entities/social-account.entity';
import { UserProfile } from './entities/user-profile.entity';
import { UserType, User } from './entities/user.entity';
import { Verification } from './entities/verification.entity';
import { GqlExecutionContext } from '@nestjs/graphql';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    @InjectRepository(UserProfile)
    private readonly userProfileRepository: Repository<UserProfile>,
    @InjectRepository(SocialAccount)
    private readonly socialAccountRepository: Repository<SocialAccount>,
    @InjectRepository(Verification)
    private readonly verificationRepository: Repository<Verification>,
    @InjectRepository(PasswordReset)
    private readonly passwordResetRepository: Repository<PasswordReset>,
    @Inject(forwardRef(() => AuthService))
    private readonly authService: AuthService,
    private readonly mailService: MailService,
    private readonly configService: ConfigService,
  ) {}

  checkPasswordSecurity(password?: string): boolean {
    if (!password) return false;
    // At least one lowercase
    // At least one number
    // At least eight characters
    const passwordRegex = new RegExp('^(?=.*[0-9])(?=.*[a-z]).{8,}$');
    return passwordRegex.test(password);
  }

  checkNicknameValidity(nickname: string): boolean {
    return (
      /^[0-9a-zA-Z|ㄱ-ㅎ|ㅏ-ㅣ|가-힣]+$/.test(nickname) &&
      nickname.length >= 2 &&
      nickname.length <= 10
    );
  }

  async createUserWithEmail(
    { email, password, nickname }: CreateUserWithEmailInput,
    context: GqlExecutionContext,
  ): Promise<CreateUserWithEmailOutput> {
    try {
      // Check password security
      const isPasswordSecure = this.checkPasswordSecurity(password);
      if (!isPasswordSecure) return CommonError('INSECURE_PASSWORD');
      // Check nickname validity
      const isNicknameValid = this.checkNicknameValidity(nickname);
      if (!isNicknameValid) return CommonError('INVALID_NICKNAME');
      // Check if there exists a user with the inputted email
      const emailUser = await this.userRepository.findOne({ email });
      if (emailUser) return CommonError('DUPLICATE_EMAIL');
      // Check if there exists a user with the inputted nickname
      const nicknameProfile = await this.userProfileRepository.findOne({
        nickname,
      });
      if (nicknameProfile) return CommonError('DUPLICATE_NICKNAME');

      // Create and save the user
      const newUser = this.userRepository.create({ email, password });
      newUser.type = UserType.USER;
      newUser.lastLoginAt = new Date();
      newUser.isVerified = false;
      const createdUser = await this.userRepository.save(newUser);

      // Create profile for the user
      const newProfile = this.userProfileRepository.create({ nickname });
      newProfile.user = createdUser;
      await this.userProfileRepository.save(newProfile);

      // Create verification code and send it to the user
      const newVerification = this.verificationRepository.create();
      newVerification.user = createdUser;
      const { code } = await this.verificationRepository.save(newVerification);
      await this.mailService.sendEmailVerification(email, nickname, code);

      // Return tokens after login
      return await this.authService.emailLogin({ email, password }, context);
    } catch (e) {
      console.log(e);
      return UNEXPECTED_ERROR;
    }
  }

  async createSocialAccount(
    email: string,
    provider: SocialProvider,
    socialId: string,
  ): Promise<User> {
    let user = await this.userRepository
      .createQueryBuilder('user')
      .where('user.email = :email', { email })
      .getOne();
    if (!user) {
      user = await this.userRepository.save(
        this.userRepository.create({
          email,
          lastLoginAt: new Date(),
          isVerified: true,
          isLocked: false,
          type: UserType.USER,
        }),
      );
    }

    await this.socialAccountRepository.save(
      this.socialAccountRepository.create({
        user,
        provider,
        socialId,
      }),
    );

    // The user is verified
    user.password = null;
    user.isVerified = true;
    await this.userRepository.save(user);

    return user;
  }

  async getUserById(id: number): Promise<User> {
    return this.userRepository.findOne(
      { id },
      { select: ['id', 'type', 'isVerified', 'isLocked'] },
    );
  }

  async getUserByEmail(email: string): Promise<User> {
    const user = this.userRepository
      .createQueryBuilder('user')
      .addSelect('user.password')
      .leftJoinAndSelect('user.socialAccounts', 'socialAccount')
      .where('user.email = :email', { email })
      .getOne();
    return user;
  }

  async getUserBySocialId(
    provider: SocialProvider,
    socialId: string,
  ): Promise<User> {
    const user = await this.userRepository
      .createQueryBuilder('user')
      .leftJoinAndSelect('user.socialAccounts', 'socialAccount')
      .where('socialAccount.provider = :provider', { provider })
      .andWhere('socialAccount.socialId = :socialId', { socialId })
      .getOne();

    return user;
  }

  async updateLastLoginAt(id: number): Promise<void> {
    const user = await this.userRepository.findOne(
      { id },
      { select: ['id', 'lastLoginAt'] },
    );
    user.lastLoginAt = new Date();
    this.userRepository.save(user);
  }

  async createMyProfile(
    user: User,
    { nickname, gender }: CreateMyProfileInput,
  ): Promise<CreateMyProfileOutput> {
    try {
      // Check nickname validity
      const isNicknameValid = this.checkNicknameValidity(nickname);
      if (!isNicknameValid) return CommonError('INVALID_NICKNAME');

      const { error } = await this.getMyProfile(user);
      if (error !== 'PROFILE_NOT_FOUND')
        return CommonError('PROFILE_ALREADY_EXISTS');

      await this.userProfileRepository.save(
        this.userProfileRepository.create({
          nickname,
          gender,
          user,
        }),
      );

      return { ok: true };
    } catch (e) {
      if (e.errno === 1062) return CommonError('DUPLICATE_NICKNAME');
      console.log(e);
      return UNEXPECTED_ERROR;
    }
  }

  async getMyProfile({ id }: User): Promise<GetMyProfileOutput> {
    try {
      const { profile } = await this.userRepository
        .createQueryBuilder('user')
        .select('user.id')
        .leftJoinAndSelect('user.profile', 'profile')
        .where('user.id = :id', { id })
        .getOne();

      return {
        ok: Boolean(profile),
        error: !profile ? 'PROFILE_NOT_FOUND' : null,
        profile,
      };
    } catch (e) {
      console.log(e);
      return UNEXPECTED_ERROR;
    }
  }

  async updateMyProfile(
    user: User,
    profile: UpdateMyProfileInput,
  ): Promise<UpdateMyProfileOutput> {
    try {
      // Check if the profile exists
      const { ok, error, profile: profileToUpdate } = await this.getMyProfile(
        user,
      );
      if (!ok) return { ok, error };

      if (profile.nickname) {
        // Check nickname validity
        const isNicknameValid = this.checkNicknameValidity(profile.nickname);
        if (!isNicknameValid) return CommonError('INVALID_NICKNAME');
      }
      // Update
      await this.userProfileRepository.save({ ...profileToUpdate, ...profile });
      return { ok: true };
    } catch (e) {
      if (e.errno === 1062) return CommonError('DUPLICATE_NICKNAME');
      console.log(e);
      return UNEXPECTED_ERROR;
    }
  }

  updateUser(user: User): Promise<User> {
    return this.userRepository.save(user);
  }

  async deleteUserById(id: number): Promise<DeleteUserOutput> {
    try {
      const user = await this.userRepository
        .createQueryBuilder('user')
        .leftJoinAndSelect('user.socialAccounts', 'socialAccount')
        .where('user.id = :id', { id })
        .getOne();
      if (!user) {
        return {
          ok: false,
          error: 'USER_NOT_FOUND',
        };
      }
      for (const socialAccount of user.socialAccounts) {
        switch (socialAccount.provider) {
          case SocialProvider.KAKAO:
            const adminKey = this.configService.get<string>('KAKAO_ADMIN_KEY');
            const result = await unlinkKakaoUser(
              socialAccount.socialId,
              adminKey,
            );
            if (!result.ok) return CommonError(result.error);
            break;
          default:
            break;
        }
      }
      const result = await this.userRepository.softDelete({ id: user.id });
      return { ok: true };
    } catch (e) {
      console.log(e);
      return UNEXPECTED_ERROR;
    }
  }

  async verifyUser(code: string): Promise<VerifyUserOutput> {
    try {
      const verification = await this.verificationRepository.findOne(
        { code },
        { relations: ['user'] },
      );
      if (!verification) {
        return {
          ok: false,
          error: 'VERIFICATION_NOT_FOUND',
        };
      }
      verification.user.isVerified = true;
      await this.userRepository.save(verification.user);
      await this.verificationRepository.delete({ id: verification.id });
      return { ok: true };
    } catch (e) {
      console.log(e);
      return UNEXPECTED_ERROR;
    }
  }

  async requestPasswordReset(
    currentUser: User,
    { email }: RequestPasswordResetInput,
  ): Promise<RequestPasswordResetOutput> {
    try {
      if (currentUser && currentUser.email !== email)
        return CommonError('UNAUTHORIZED');
      const user = await this.userRepository
        .createQueryBuilder('user')
        .leftJoinAndSelect('user.socialAccounts', 'socialAccount')
        .leftJoinAndSelect('user.profile', 'profile')
        .where('user.email = :email', { email })
        .getOne();
      if (!user) return CommonError('USER_NOT_FOUND');
      if (user.socialAccounts.length !== 0) return CommonError('SOCIAL_USER');
      let savedReset: PasswordReset;
      const reset = await this.passwordResetRepository
        .createQueryBuilder('reset')
        .leftJoin('reset.user', 'user')
        .where('user.id = :id', { id: user.id })
        .getOne();
      if (reset) {
        reset.createCode();
        savedReset = await this.passwordResetRepository.save(reset);
      } else {
        const newReset = this.passwordResetRepository.create();
        newReset.user = user;
        savedReset = await this.passwordResetRepository.save(newReset);
      }
      const ok = await this.mailService.sendPasswordReset(
        user.email,
        user.profile ? user.profile.nickname : 'UNKNOWN',
        savedReset.code,
      );
      // UNKNOWN may be impossible
      return {
        ok,
        error: !ok && 'MAILGUN_API_ERROR',
      };
    } catch (e) {
      console.log(e);
      return UNEXPECTED_ERROR;
    }
  }

  async updatePassword({
    code,
    newPassword,
  }: UpdatePasswordInput): Promise<UpdatePasswordOutput> {
    try {
      // Find user with code
      const reset = await this.passwordResetRepository.findOne(
        { code },
        { relations: ['user'] },
      );
      if (!reset) {
        return {
          ok: false,
          error: 'CODE_NOT_FOUND',
        };
      }
      // Check code expire (1 hour)
      if (Date.now() - reset.updatedAt.valueOf() > 1000 * 3600) {
        return {
          ok: false,
          error: 'CODE_EXPIRED',
        };
      }
      // Check security
      if (!this.checkPasswordSecurity(newPassword)) {
        return {
          ok: false,
          error: 'INSECURE_PASSWORD',
        };
      }
      // Update
      const { user } = reset;
      user.password = newPassword;
      await this.userRepository.save(user);
      // Delete code
      await this.passwordResetRepository.delete({ id: reset.id });
      // return
      return { ok: true };
    } catch (e) {
      console.log(e);
      return UNEXPECTED_ERROR;
    }
  }
}
