import {
  forwardRef,
  Inject,
  Injectable,
  InternalServerErrorException,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { InjectRepository } from '@nestjs/typeorm';
import { AuthService } from 'src/auth/auth.service';
import { unlinkKakaoUser } from 'src/auth/utils/kakaoOAuth.util';
import { UNEXPECTED_ERROR } from 'src/common/constants/error.constant';
import { MailService } from 'src/mail/mail.service';
import { PhotosService } from 'src/photos/photos.service';
import { FindOneOptions, Repository } from 'typeorm';
import {
  CreateUserWithEmailInput,
  CreateUserWithEmailOutput,
  CreateOrLoginUserWithOAuthInput,
  CreateOrLoginUserWithOAuthOutput,
  SocialLoginMethod,
} from './dtos/create-user.dto';
import { DeleteUserOutput } from './dtos/delete-user.dto';
import { GetMyProfileOutput } from './dtos/get-user.dto';
import {
  RequestPasswordResetInput,
  RequestPasswordResetOutput,
  UpdatePasswordInput,
  UpdatePasswordOutput,
} from './dtos/update-password.dto';
import {
  UpdateNicknameInput,
  UpdateNicknameOutput,
} from './dtos/update-user.dto';
import { VerifyUserOutput } from './dtos/verify-user.dto';
import { PasswordReset } from './entities/password_reset.entity';
import { LoginMethod, Role, User } from './entities/user.entity';
import { Verification } from './entities/verification.entity';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    @InjectRepository(Verification)
    private readonly verificationRepository: Repository<Verification>,
    @InjectRepository(PasswordReset)
    private readonly passwordResetRepository: Repository<PasswordReset>,
    @Inject(forwardRef(() => AuthService))
    private readonly authService: AuthService,
    private readonly mailService: MailService,
    @Inject(forwardRef(() => PhotosService))
    private readonly photosService: PhotosService,
    private readonly configService: ConfigService,
  ) {}

  checkPasswordSecurity(password: string): boolean {
    // At least one lowercase
    // At least one number
    // At least eight characters
    const passwordRegex = new RegExp('^(?=.*[0-9])(?=.*[a-z]).{8,}$');
    return passwordRegex.test(password);
  }

  async createUserWithEmail({
    email,
    password,
    nickname,
  }: CreateUserWithEmailInput): Promise<CreateUserWithEmailOutput> {
    try {
      // Check password security
      const isPasswordSecure = this.checkPasswordSecurity(password);
      if (!isPasswordSecure) {
        return {
          ok: false,
          error: 'INSECURE_PASSWORD',
        };
      }
      // Check nickname length
      if (nickname.length > 10) {
        return {
          ok: false,
          error: 'INVALID_NICKNAME',
        };
      }
      // Check if there exists a user with the inputted email
      const userByEmail = await this.userRepository.findOne({ email });
      if (userByEmail) {
        return {
          ok: false,
          error: 'DUPLICATE_EMAIL',
        };
      }
      // Check if there exists a user with the inputted nickname
      const userByNickname = await this.userRepository.findOne({ nickname });
      if (userByNickname) {
        return {
          ok: false,
          error: 'DUPLICATE_NICKNAME',
        };
      }
      // Create and save the user
      const newUser = this.userRepository.create({ email, password, nickname });
      newUser.loginMethod = LoginMethod.EMAIL;
      newUser.role = Role.USER;
      newUser.isVerified = false;
      const createdUser = await this.userRepository.save(newUser);
      // Create verification code and send it to the user
      const newVerification = this.verificationRepository.create();
      newVerification.user = createdUser;
      const { code } = await this.verificationRepository.save(newVerification);
      await this.mailService.sendEmailVerification(
        createdUser.email,
        createdUser.nickname,
        code,
      );
      // Return a token after login
      const { ok, error, token } = await this.authService.loginWithEmail({
        email,
        password,
      });
      return {
        ok,
        error,
        token,
      };
    } catch (e) {
      console.log(e);
      return UNEXPECTED_ERROR;
    }
  }

  async getPossibleNickname(nickname?: string): Promise<string> {
    try {
      const newNickname = nickname ? nickname : '바프새내기';
      const userWithNickname = await this.getUserByNickname(newNickname);
      if (userWithNickname) {
        for (let i = 1; ; i++) {
          const userWithNewNickname = await this.getUserByNickname(
            newNickname + i,
          );
          if (!userWithNewNickname) {
            return newNickname + i;
          }
        }
      }
      return newNickname;
    } catch (e) {
      throw new InternalServerErrorException();
    }
  }

  async createOrLoginUserWithOAuth({
    accessToken,
    createWith,
  }: CreateOrLoginUserWithOAuthInput): Promise<CreateOrLoginUserWithOAuthOutput> {
    try {
      const {
        ok,
        error,
        profile: { socialId, nickname, email, ...profiles },
      } = await this.authService.getOAuthProfileWithAccessToken(
        accessToken,
        createWith,
      );
      if (!ok) {
        return { ok, error };
      }
      const user = await this.userRepository.findOne({
        loginMethod: createWith,
        socialId,
      });
      if (user) {
        // Issue token
        return await this.authService.loginWithOAuth(
          user.loginMethod as SocialLoginMethod,
          user.socialId,
        );
      }
      // If there is a user with the same email, change its loginMethod
      if (email) {
        const userWithEmail = await this.userRepository.findOne({
          email,
          loginMethod: LoginMethod.EMAIL,
        });
        if (userWithEmail) {
          userWithEmail.loginMethod = createWith;
          userWithEmail.socialId = socialId;
          // Erase password
          userWithEmail.password = null;
          const user = await this.userRepository.save({
            ...userWithEmail,
            ...profiles,
            isVerified: true,
          });
          return await this.authService.loginWithOAuth(
            createWith,
            user.socialId,
          );
        }
      }
      // If the user does not exist, create one
      const newUser = this.userRepository.create({
        loginMethod: createWith,
        socialId,
        email,
        isVerified: true,
        ...profiles,
      });
      // Get a possible nickname
      const newNickname = await this.getPossibleNickname(nickname);
      newUser.nickname = newNickname;
      const createdUser = await this.userRepository.save(newUser);
      // Get JWT token
      const loginResult = await this.authService.loginWithOAuth(
        createdUser.loginMethod as SocialLoginMethod,
        createdUser.socialId,
      );
      return {
        ok: loginResult.ok,
        error: loginResult.error,
        token: loginResult.token,
      };
    } catch (e) {
      console.log(e);
      return UNEXPECTED_ERROR;
    }
  }

  async getUserById(id: number, options?: FindOneOptions<User>): Promise<User> {
    return this.userRepository.findOne({ id }, options);
  }

  async getUserByEmail(
    email: string,
    options?: FindOneOptions<User>,
  ): Promise<User> {
    return this.userRepository.findOne(
      { email, loginMethod: LoginMethod.EMAIL },
      options,
    );
  }

  async getUserByNickname(
    nickname: string,
    options?: FindOneOptions<User>,
  ): Promise<User> {
    return this.userRepository.findOne({ nickname }, options);
  }

  async getUserBySocialId(
    loginMethod: SocialLoginMethod,
    socialId: string,
  ): Promise<User> {
    return this.userRepository.findOne({ loginMethod, socialId });
  }

  async getMyProfile(user: User): Promise<GetMyProfileOutput> {
    if (!user) {
      return UNEXPECTED_ERROR;
    }

    return {
      ok: true,
      profile: {
        id: user.id,
        email: user.email,
        loginMethod: user.loginMethod,
        nickname: user.nickname,
        isVerified: user.isVerified,
      },
    };
  }

  updateUser(user: User): Promise<User> {
    return this.userRepository.save(user);
  }

  /* TBD
  프로필 수정 API
  */

  async deleteUserById(id: number): Promise<DeleteUserOutput> {
    try {
      const user = await this.getUserById(id);
      if (!user) {
        return {
          ok: false,
          error: 'USER_NOT_FOUND',
        };
      }
      if (user.loginMethod !== LoginMethod.EMAIL) {
        switch (user.loginMethod) {
          case LoginMethod.KAKAO:
            const adminKey = this.configService.get<string>('KAKAO_ADMIN_KEY');
            const result = await unlinkKakaoUser(user.socialId, adminKey);
            if (!result.ok) {
              return {
                ok: false,
                error: result.error,
              };
            }
            break;
          case LoginMethod.NAVER:
            break;
          case LoginMethod.GOOGLE:
            break;
          // TODO: Facebook
          default:
            throw new InternalServerErrorException();
        }
      }
      const result = await this.userRepository.delete({ id: user.id });
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
      if (currentUser && currentUser.email !== email) {
        return {
          ok: false,
          error: 'UNAUTHORIZED',
        };
      }
      const user = await this.userRepository.findOne({ email });
      if (!user) {
        return {
          ok: false,
          error: 'USER_NOT_FOUND',
        };
      }
      if (user.loginMethod !== LoginMethod.EMAIL) {
        return {
          ok: false,
          error: 'INVALID_LOGIN_METHOD',
        };
      }
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
        user.nickname,
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

  async updateNickname(
    { id }: User,
    { nickname }: UpdateNicknameInput,
  ): Promise<UpdateNicknameOutput> {
    try {
      // Check nickname length
      if (nickname.length > 10) {
        return {
          ok: false,
          error: 'INVALID_NICKNAME',
        };
      }
      const userWithNickname = await this.userRepository.findOne({ nickname });
      if (userWithNickname) {
        return {
          ok: false,
          error: 'DUPLICATE_NICKNAME',
        };
      }
      const user = await this.userRepository.findOne({ id });
      user.nickname = nickname;
      await this.userRepository.save(user);
      return { ok: true };
    } catch (e) {
      console.log(e);
      return UNEXPECTED_ERROR;
    }
  }
}
