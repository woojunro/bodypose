import { hash } from 'bcrypt';
import {
  forwardRef,
  Inject,
  Injectable,
  InternalServerErrorException,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { InjectRepository } from '@nestjs/typeorm';
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
  AdminUpdateProfileInput,
  CreateProfileInput,
  CreateProfileOutput,
  DeleteProfileImageInput,
  GetProfileOutput,
  UpdateProfileImageInput,
  UpdateProfileInput,
  UpdateProfileOutput,
} from './dtos/user-profile.dto';
import {
  RequestPasswordResetInput,
  RequestPasswordResetOutput,
  UpdatePasswordInput,
  UpdatePasswordOutput,
} from './dtos/update-password.dto';
import { VerifyUserInput, VerifyUserOutput } from './dtos/verify-user.dto';
import { PasswordReset } from './entities/password-reset.entity';
import { UserOauth, OAuthProvider } from './entities/user-oauth.entity';
import { UserProfile } from './entities/user-profile.entity';
import { UserType, User } from './entities/user.entity';
import { Verification } from './entities/verification.entity';
import { UploadsService } from 'src/uploads/uploads.service';
import { CoreOutput } from 'src/common/dtos/output.dto';
import { AuthService } from 'src/auth/auth.service';
import { PASSWORD_HASH_ROUNDS } from 'src/common/constants/common.constant';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    @InjectRepository(UserProfile)
    private readonly userProfileRepository: Repository<UserProfile>,
    @InjectRepository(UserOauth)
    private readonly userOAuthRepository: Repository<UserOauth>,
    @InjectRepository(Verification)
    private readonly verificationRepository: Repository<Verification>,
    @InjectRepository(PasswordReset)
    private readonly passwordResetRepository: Repository<PasswordReset>,
    private readonly mailService: MailService,
    private readonly configService: ConfigService,
    @Inject(forwardRef(() => AuthService))
    private readonly authService: AuthService,
    @Inject(forwardRef(() => UploadsService))
    private readonly uploadsService: UploadsService,
  ) {}

  checkPasswordSecurity(password: string): boolean {
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

  async createUserWithEmail({
    email,
    password,
    nickname,
  }: CreateUserWithEmailInput): Promise<CreateUserWithEmailOutput> {
    try {
      // Check password security
      const isPasswordSecure = this.checkPasswordSecurity(password);
      if (!isPasswordSecure) return CommonError('INSECURE_PASSWORD');
      // Check nickname validity
      const isNicknameValid = this.checkNicknameValidity(nickname);
      if (!isNicknameValid) return CommonError('INVALID_NICKNAME');
      // Check if there exists a user with the inputted email
      const emailUser = await this.userRepository
        .createQueryBuilder('user')
        .select('user.id')
        .where('user.email = :email', { email })
        .withDeleted()
        .getOne();
      if (emailUser) return CommonError('DUPLICATE_EMAIL');
      // Check if there exists a user with the inputted nickname
      const nicknameProfile = await this.userProfileRepository.findOne(
        { nickname },
        { select: ['id'] },
      );
      if (nicknameProfile) return CommonError('DUPLICATE_NICKNAME');

      // Hash the password
      const hashedPassword = await hash(password, PASSWORD_HASH_ROUNDS);

      // Create and save the user
      const newUser = this.userRepository.create({
        email,
        password: hashedPassword,
        type: UserType.USER,
        isLocked: false,
        isVerified: false,
      });
      const createdUser = await this.userRepository.save(newUser);

      // Create profile for the user
      const newProfile = this.userProfileRepository.create({ nickname });
      newProfile.user = createdUser;
      await this.userProfileRepository.save(newProfile);

      // Create verification code and send it to the user
      const newVerification = this.verificationRepository.create();
      newVerification.user = createdUser;
      const { code } = await this.verificationRepository.save(newVerification);
      this.mailService.sendEmailVerification(
        email,
        nickname,
        createdUser.id,
        code,
      );

      return { ok: true };
    } catch (e) {
      console.log(e);
      return UNEXPECTED_ERROR;
    }
  }

  async createSocialAccount(
    email: string,
    provider: OAuthProvider,
    socialId: string,
    isVerified: boolean,
  ): Promise<User> {
    try {
      const user = await this.userRepository.save(
        this.userRepository.create({
          email,
          isVerified,
          isLocked: false,
          type: UserType.USER,
        }),
      );
      await this.userOAuthRepository.save(
        this.userOAuthRepository.create({
          user,
          provider,
          socialId,
        }),
      );

      if (!isVerified) {
        // Create verification code and send it to the user
        const newVerification = this.verificationRepository.create();
        newVerification.user = user;
        const { code } = await this.verificationRepository.save(
          newVerification,
        );
        this.mailService.sendEmailVerification(email, '회원', user.id, code);
      }

      return user;
    } catch (e) {
      console.log(e);
      throw new InternalServerErrorException();
    }
  }

  async getUserById(id: number): Promise<User> {
    return this.userRepository.findOne(
      { id },
      { select: ['id', 'type', 'isVerified', 'isLocked', 'email'] },
    );
  }

  async getUserByEmail(email: string, needPassword = true): Promise<User> {
    let query = this.userRepository
      .createQueryBuilder('u')
      .select(['u.id', 'u.isLocked']);
    if (needPassword) {
      query = query.addSelect('u.password');
    }
    const user = query
      .leftJoinAndSelect('u.oauthList', 'oauth')
      .where('u.email = :email', { email })
      .withDeleted()
      .getOne();
    return user;
  }

  async getUserBySocialId(
    provider: OAuthProvider,
    socialId: string,
  ): Promise<User> {
    const user = await this.userRepository
      .createQueryBuilder('u')
      .select(['u.id', 'u.isLocked'])
      .leftJoinAndSelect('u.oauthList', 'oauth')
      .where('oauth.provider = :provider', { provider })
      .andWhere('oauth.socialId = :socialId', { socialId })
      .withDeleted()
      .getOne();
    console.log(user);
    return user;
  }

  async updateLastLoginAt(id: number): Promise<void> {
    const user = await this.userRepository.findOne(
      { id },
      { select: ['id', 'lastLoginAt', 'deletedAt'], withDeleted: true },
    );
    user.lastLoginAt = new Date();
    user.deletedAt = null;
    this.userRepository.save(user);
  }

  async createMyProfile(
    user: User,
    { nickname, isMale }: CreateProfileInput,
  ): Promise<CreateProfileOutput> {
    try {
      // Check nickname validity
      const isNicknameValid = this.checkNicknameValidity(nickname);
      if (!isNicknameValid) return CommonError('INVALID_NICKNAME');

      const isProfileAlreadyExists = await this.userProfileRepository
        .createQueryBuilder('profile')
        .select('profile.id')
        .where('profile.userId = :id', { id: user.id })
        .getOne();
      if (isProfileAlreadyExists) return CommonError('PROFILE_ALREADY_EXISTS');

      // Check if there exists a user with the inputted nickname
      const duplicateNickname = await this.userProfileRepository.findOne(
        { nickname },
        { select: ['id'] },
      );
      if (duplicateNickname) return CommonError('DUPLICATE_NICKNAME');

      await this.userProfileRepository.insert(
        this.userProfileRepository.create({
          nickname,
          isMale,
          user,
        }),
      );

      return { ok: true };
    } catch (e) {
      console.log(e);
      return UNEXPECTED_ERROR;
    }
  }

  async getMyProfile({ id }: User): Promise<GetProfileOutput> {
    try {
      const profile = await this.userProfileRepository
        .createQueryBuilder('profile')
        .where('profile.userId = :id', { id })
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

  async updateProfile({
    userId,
    ...profile
  }: AdminUpdateProfileInput): Promise<UpdateProfileOutput> {
    try {
      const profileToUpdate = await this.userProfileRepository
        .createQueryBuilder('profile')
        .where('profile.userId = :userId', { userId })
        .getOne();
      if (!profileToUpdate) return CommonError('PROFILE_NOT_FOUND');

      await this.userProfileRepository.save({ ...profileToUpdate, ...profile });

      return { ok: true };
    } catch (e) {
      if (e.errno === 1062) return CommonError('DUPLICATE_NICKNAME');
      console.log(e);
      return UNEXPECTED_ERROR;
    }
  }

  async updateMyProfile(
    user: User,
    profile: UpdateProfileInput,
  ): Promise<UpdateProfileOutput> {
    try {
      if (profile.nickname) {
        // Check nickname validity
        const isNicknameValid = this.checkNicknameValidity(profile.nickname);
        if (!isNicknameValid) return CommonError('INVALID_NICKNAME');
      }

      // Check if the profile exists
      const { ok, error, profile: profileToUpdate } = await this.getMyProfile(
        user,
      );
      if (!ok) return { ok, error };

      // Update
      await this.userProfileRepository.save({
        ...profileToUpdate,
        ...profile,
      });
      return { ok: true };
    } catch (e) {
      if (e.errno === 1062) return CommonError('DUPLICATE_NICKNAME');
      console.log(e);
      return UNEXPECTED_ERROR;
    }
  }

  async updateProfileImage(
    user: User,
    { profileImageUrl }: UpdateProfileImageInput,
  ): Promise<UpdateProfileOutput> {
    try {
      // Check if the profile exists
      const { ok, error, profile: profileToUpdate } = await this.getMyProfile(
        user,
      );
      if (!ok) return { ok, error };

      // Delete existing profile image
      if (profileToUpdate.profileImageUrl) {
        const path = profileToUpdate.profileImageUrl.substring(
          profileToUpdate.profileImageUrl.indexOf('profile-images'),
        );
        await this.uploadsService.deleteFile(path);
      }

      profileToUpdate.profileImageUrl = profileImageUrl;
      await this.userProfileRepository.save(profileToUpdate);
      return { ok: true };
    } catch (e) {
      console.log(e);
      return UNEXPECTED_ERROR;
    }
  }

  async deleteProfileImage(
    user: User,
    input: DeleteProfileImageInput,
  ): Promise<UpdateProfileOutput> {
    try {
      let profileToUpdate: UserProfile;
      if (user.type === UserType.ADMIN) {
        if (!input.userId) return CommonError('USER_ID_REQUIRED');
        profileToUpdate = await this.userProfileRepository
          .createQueryBuilder('profile')
          .where('profile.userId = :userId', { userId: input.userId })
          .getOne();
        if (!profileToUpdate) return CommonError('PROFILE_NOT_FOUND');
      } else {
        // Check if the profile exists
        const { ok, error, profile } = await this.getMyProfile(user);
        if (!ok) return { ok, error };
        profileToUpdate = profile;
      }

      // Delete existing profile image
      if (profileToUpdate.profileImageUrl) {
        const path = profileToUpdate.profileImageUrl.substring(
          profileToUpdate.profileImageUrl.indexOf('profile-images'),
        );
        await this.uploadsService.deleteFile(path);
      } else {
        return CommonError('PROFILE_IMAGE_DOES_NOT_EXIST');
      }

      profileToUpdate.profileImageUrl = null;
      await this.userProfileRepository.save(profileToUpdate);
      return { ok: true };
    } catch (e) {
      console.log(e);
      return UNEXPECTED_ERROR;
    }
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
      for (const socialAccount of []) {
        switch (socialAccount.provider) {
          case OAuthProvider.KAKAO:
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

  async verifyUser({
    userId,
    code,
  }: VerifyUserInput): Promise<VerifyUserOutput> {
    try {
      const verification = await this.verificationRepository
        .createQueryBuilder('verification')
        .innerJoinAndSelect('verification.user', 'user')
        .where('user.id = :userId', { userId })
        .getOne();
      if (!verification || verification.code !== code) {
        return {
          ok: false,
          error: 'INVALID_REQUEST',
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

  async resendVerificationMail(user: User): Promise<CoreOutput> {
    try {
      if (user.isVerified) return CommonError('ALREADY_VERIFIED');
      let verification = await this.verificationRepository
        .createQueryBuilder('verification')
        .where('verification.userId = :id', { id: user.id })
        .getOne();
      if (!verification) {
        verification = await this.verificationRepository.save(
          this.verificationRepository.create({
            user: { id: user.id },
          }),
        );
      }

      const { nickname } = await this.userProfileRepository
        .createQueryBuilder('profile')
        .select('profile.nickname')
        .where('profile.userId = :id', { id: user.id })
        .getOne();

      await this.mailService.sendEmailVerification(
        user.email,
        nickname,
        user.id,
        verification.code,
      );
      return { ok: true };
    } catch (e) {
      console.log(e);
      return CommonError('COULD_NOT_SEND_MAIL');
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
      if ([].length !== 0) return CommonError('SOCIAL_USER');
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
        user.id,
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
    userId,
    newPassword,
  }: UpdatePasswordInput): Promise<UpdatePasswordOutput> {
    try {
      // Check security
      if (!this.checkPasswordSecurity(newPassword)) {
        return {
          ok: false,
          error: 'INSECURE_PASSWORD',
        };
      }
      // Find user with code
      const reset = await this.passwordResetRepository
        .createQueryBuilder('reset')
        .innerJoinAndSelect('reset.user', 'user')
        .where('user.id = :userId', { userId })
        .getOne();
      if (!reset || reset.code !== code) {
        return {
          ok: false,
          error: 'INVALID_REQUEST',
        };
      }
      // Check code expire (1 hour)
      if (Date.now() - reset.updatedAt.valueOf() > 1000 * 3600) {
        return {
          ok: false,
          error: 'CODE_EXPIRED',
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
