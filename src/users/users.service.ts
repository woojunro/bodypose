import { hash, compare } from 'bcrypt';
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
  GetProfileInput,
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
import {
  NO_PROFILE_NICKNAME,
  PASSWORD_HASH_ROUNDS,
} from 'src/common/constants/common.constant';
import { LockUserInput, LockUserOutput } from './dtos/lock-user.dto';
import { UpdateEmailInput, UpdateEmailOutput } from './dtos/update-email.dto';
import { GetUserInfoInput, GetUserInfoOutput } from './dtos/get-user-info.dto';
import { Partner } from './entities/partner.entity';
import {
  CreatePartnerInput,
  CreatePartnerOutput,
} from './dtos/create-partner.dto';
import {
  ChangePasswordInput,
  ChangePasswordOutput,
} from './dtos/change-password.dto';

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
    @InjectRepository(Partner)
    private readonly partnerRepository: Repository<Partner>,
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

  isMineOrAdmin(user: User, id: number): boolean {
    return user.type === UserType.ADMIN || user.id === id;
  }

  async createUserWithEmail({
    email,
    password,
  }: CreateUserWithEmailInput): Promise<CreateUserWithEmailOutput> {
    try {
      // Check password security
      const isPasswordSecure = this.checkPasswordSecurity(password);
      if (!isPasswordSecure) return CommonError('INSECURE_PASSWORD');
      // Check if there exists a user with the inputted email
      const emailUser = await this.userRepository
        .createQueryBuilder('user')
        .select('user.id')
        .where('user.email = :email', { email })
        .withDeleted()
        .getOne();
      if (emailUser) return CommonError('DUPLICATE_EMAIL');

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

      // Create verification code and send it to the user
      const newVerification = this.verificationRepository.create();
      newVerification.user = createdUser;
      const { code } = await this.verificationRepository.save(newVerification);
      this.mailService.sendEmailVerification(
        email,
        NO_PROFILE_NICKNAME,
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
        this.mailService.sendEmailVerification(
          email,
          NO_PROFILE_NICKNAME,
          user.id,
          code,
        );
      }

      return user;
    } catch (e) {
      console.log(e);
      throw new InternalServerErrorException();
    }
  }

  async createUserOAuth(
    id: number,
    provider: OAuthProvider,
    socialId: string,
  ): Promise<CoreOutput> {
    try {
      const user = await this.userRepository.findOne(id, {
        select: ['id', 'isVerified', 'password'],
      });
      const oauth = await this.userOAuthRepository.findOne({
        provider,
        socialId,
      });
      if (oauth) return CommonError('DUPLICATE_OAUTH');
      const newOAuth = this.userOAuthRepository.create({
        user: { id },
        provider,
        socialId,
      });
      await this.userOAuthRepository.save(newOAuth);
      user.isVerified = true;
      user.password = null;
      await this.userRepository.save(user);
      return { ok: true };
    } catch (e) {
      console.log(e);
      return UNEXPECTED_ERROR;
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
      .select(['u.id', 'u.type', 'u.isLocked']);
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

  async getUserInfo(
    user: User,
    { id }: GetUserInfoInput,
  ): Promise<GetUserInfoOutput> {
    if (id) {
      if (!this.isMineOrAdmin(user, id)) {
        return CommonError('UNAUTHORIZED');
      }
    }

    const queryId = id || user.id;
    const userInfo = await this.userRepository
      .createQueryBuilder('u')
      .select([
        'u.id',
        'u.createdAt',
        'u.type',
        'u.email',
        'u.lastLoginAt',
        'u.isVerified',
        'u.deletedAt',
      ])
      .leftJoinAndSelect('u.oauthList', 'o')
      .leftJoinAndSelect('u.profile', 'p')
      .where('u.id = :queryId', { queryId })
      .withDeleted()
      .getOne();

    if (!userInfo) return CommonError('USER_NOT_FOUND');
    return {
      ok: true,
      userInfo,
    };
  }

  async createMyProfile(
    user: User,
    { nickname, isMale }: CreateProfileInput,
  ): Promise<CreateProfileOutput> {
    try {
      // Check nickname validity
      const isNicknameValid = this.checkNicknameValidity(nickname);
      if (!isNicknameValid) return CommonError('INVALID_NICKNAME');

      const { profile } = await this.getProfile(user, {});
      if (profile) return CommonError('PROFILE_ALREADY_EXISTS');

      // Check if there exists a user with the inputted nickname
      const duplicateNickname = await this.userProfileRepository.findOne(
        { nickname },
        { select: ['id'] },
      );
      if (duplicateNickname) return CommonError('DUPLICATE_NICKNAME');

      const { id } = await this.userProfileRepository.save(
        this.userProfileRepository.create({
          nickname,
          isMale,
        }),
      );
      await this.userRepository.update(user.id, { profile: { id } });

      return { ok: true };
    } catch (e) {
      console.log(e);
      return UNEXPECTED_ERROR;
    }
  }

  async getProfile(
    user: User,
    { id }: GetProfileInput,
  ): Promise<GetProfileOutput> {
    try {
      const queryId = id || user.id;
      const queryUser = await this.userRepository
        .createQueryBuilder('u')
        .select('u.id')
        .leftJoinAndSelect('u.profile', 'p')
        .where('u.id = :queryId', { queryId })
        .withDeleted()
        .getOne();
      const profile = queryUser?.profile;

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
      const u = await this.userRepository
        .createQueryBuilder('u')
        .select('u.id')
        .leftJoinAndSelect('u.profile', 'p')
        .where('u.id = :id', { id: userId })
        .getOne();
      const profileToUpdate = u?.profile;
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
      const { ok, error, profile: profileToUpdate } = await this.getProfile(
        user,
        {},
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
      const { ok, error, profile: profileToUpdate } = await this.getProfile(
        user,
        {},
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
        const { ok, error, profile } = await this.getProfile(user, {});
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

  async updateEmail(
    { userId, email }: UpdateEmailInput,
    user: User,
  ): Promise<UpdateEmailOutput> {
    try {
      if (!this.isMineOrAdmin(user, userId)) {
        return CommonError('INVALID_REQUEST');
      }
      const doesUserExist = await this.getUserById(userId);
      if (!doesUserExist) return CommonError('USER_NOT_FOUND');
      // Check duplicate email
      const isEmailDuplicate = await this.userRepository
        .createQueryBuilder('u')
        .select('u.id')
        .where('u.email = :email', { email })
        .withDeleted()
        .getOne();
      if (isEmailDuplicate) return CommonError('DUPLICATE_EMAIL');
      // Update email and set isVerified to false
      const payload = this.userRepository.create({
        id: userId,
        email,
        isVerified: false,
      });
      const updatedUser = await this.userRepository.save(payload);
      // Send email verification mail
      const { error } = await this.resendVerificationMail(updatedUser);
      return {
        ok: true,
        error,
        email: updatedUser.email,
      };
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
        .innerJoin('verification.user', 'user')
        .addSelect(['user.id', 'user.isVerified'])
        .where('user.id = :userId', { userId })
        .getOne();
      const isValid =
        verification &&
        verification.updatedAt >= new Date(Date.now() - 3600 * 1000 * 24) &&
        verification.code === code;
      if (!isValid) return CommonError('INVALID_REQUEST');
      if (verification.user.isVerified) {
        await this.verificationRepository.delete(verification.id);
        return CommonError('ALREADY_VERIFIED');
      }
      verification.user.isVerified = true;
      await this.userRepository.save(verification.user);
      await this.verificationRepository.delete(verification.id);
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
        // Create one
        verification = await this.verificationRepository.save(
          this.verificationRepository.create({
            user: { id: user.id },
          }),
        );
      } else {
        // Update code
        verification.createCode();
        verification = await this.verificationRepository.save(verification);
      }

      const { profile } = await this.userRepository
        .createQueryBuilder('user')
        .leftJoin('user.profile', 'profile')
        .select(['user.id', 'profile.nickname'])
        .where('user.id = :id', { id: user.id })
        .getOne();

      await this.mailService.sendEmailVerification(
        user.email,
        profile?.nickname || NO_PROFILE_NICKNAME,
        user.id,
        verification.code,
      );
      return { ok: true };
    } catch (e) {
      console.log(e);
      return CommonError('COULD_NOT_SEND_MAIL');
    }
  }

  async requestPasswordReset({
    email,
  }: RequestPasswordResetInput): Promise<RequestPasswordResetOutput> {
    try {
      const user = await this.userRepository
        .createQueryBuilder('user')
        .leftJoinAndSelect('user.oauthList', 'o')
        .leftJoin('user.profile', 'profile')
        .addSelect('profile.nickname')
        .where('user.email = :email', { email })
        .getOne();
      if (!user) return CommonError('USER_NOT_FOUND');
      if (user.oauthList.length !== 0) return CommonError('SOCIAL_USER');
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
        user.profile?.nickname || NO_PROFILE_NICKNAME,
        user.id,
        savedReset.code,
      );
      return {
        ok,
        error: ok ? null : 'MAILGUN_API_ERROR',
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
        return CommonError('INSECURE_PASSWORD');
      }
      // Find user with code
      const reset = await this.passwordResetRepository
        .createQueryBuilder('reset')
        .innerJoin('reset.user', 'user')
        .addSelect(['user.id', 'user.password'])
        .where('reset.userId = :userId', { userId })
        .getOne();
      if (!reset || reset.code !== code) {
        return CommonError('INVALID_REQUEST');
      }
      // Check code expire (1 hour)
      if (Date.now() - reset.updatedAt.valueOf() > 1000 * 3600) {
        return CommonError('CODE_EXPIRED');
      }
      // Update
      const { user } = reset;
      const hashedPassword = await hash(newPassword, PASSWORD_HASH_ROUNDS);
      user.password = hashedPassword;
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

  async changePassword(
    user: User,
    { currentPassword, newPassword }: ChangePasswordInput,
  ): Promise<ChangePasswordOutput> {
    try {
      if (!this.checkPasswordSecurity(newPassword)) {
        return CommonError('INSECURE_PASSWORD');
      }
      const { email } = user;
      const { id, password } = await this.getUserByEmail(email);
      const isCorrect = await compare(currentPassword, password);
      if (!isCorrect) return CommonError('WRONG_PASSWORD');
      const hashedPassword = await hash(newPassword, PASSWORD_HASH_ROUNDS);
      const updatedUser = this.userRepository.create({
        id,
        password: hashedPassword,
      });
      await this.userRepository.save(updatedUser);
      return { ok: true };
    } catch (e) {
      console.log(e);
      return UNEXPECTED_ERROR;
    }
  }

  async lockUser({ id, isLocked }: LockUserInput): Promise<LockUserOutput> {
    try {
      const user = await this.getUserById(id);
      if (!user) return CommonError('USER_NOT_FOUND');
      user.isLocked = isLocked;
      const { isLocked: updated } = await this.userRepository.save(user);
      return {
        ok: true,
        isLocked: updated,
      };
    } catch (e) {
      console.log(e);
      return UNEXPECTED_ERROR;
    }
  }

  async createPartner({
    password,
    ...input
  }: CreatePartnerInput): Promise<CreatePartnerOutput> {
    try {
      if (!this.checkPasswordSecurity(password)) {
        return CommonError('INSECURE_PASSWORD');
      }
      const partner = await this.partnerRepository.findOne(
        { email: input.email },
        { select: ['id'] },
      );
      if (partner) return CommonError('DUPLICATE_EMAIL');
      const hashedPassword = await hash(password, PASSWORD_HASH_ROUNDS);
      const user = await this.userRepository.save(
        this.userRepository.create({
          type: UserType.STUDIO,
          email: `partners${Date.now()}`,
          password: hashedPassword,
          isVerified: true,
          isLocked: true,
        }),
      );
      await this.partnerRepository.save(
        this.partnerRepository.create({ ...input, user }),
      );
      return { ok: true };
    } catch (e) {
      console.log(e);
      return UNEXPECTED_ERROR;
    }
  }

  async getPartnerByEmail(email: string): Promise<Partner> {
    return this.partnerRepository.findOne({ email }, { relations: ['user'] });
  }
}
