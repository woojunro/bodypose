import {
  forwardRef,
  Inject,
  Injectable,
  InternalServerErrorException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { AuthService } from 'src/auth/auth.service';
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
import {
  GetMyProfileOutput,
  GetMyHeartStudiosOutput,
  GetMyHeartStudioPhotosOutput,
  GetMyHeartStudioPhotosInput,
} from './dtos/get-user.dto';
import { VerifyUserOutput } from './dtos/verify-user.dto';
import { LoginMethod, Role, User } from './entities/user.entity';
import { Verification } from './entities/verification.entity';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    @InjectRepository(Verification)
    private readonly verificationRepository: Repository<Verification>,
    @Inject(forwardRef(() => AuthService))
    private readonly authService: AuthService,
    private readonly mailService: MailService,
    @Inject(forwardRef(() => PhotosService))
    private readonly photosService: PhotosService,
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
      // Check if there exists a user with the inputted email
      const userByEmail = await this.userRepository.findOne({ email });
      if (userByEmail) {
        return {
          ok: false,
          error: 'DUPLICATE_EMAIL',
        };
      }
      // Check password security
      const isPasswordSecure = this.checkPasswordSecurity(password);
      if (!isPasswordSecure) {
        return {
          ok: false,
          error: 'INSECURE_PASSWORD',
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
      await this.mailService.sendConfirmationEmail(newUser, code);
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
        profile: { socialId, nickname, ...profiles },
      } = await this.authService.getOAuthProfileWithAccessToken(
        accessToken,
        createWith,
      );
      if (!ok) {
        return { ok, error };
      }
      // If the user does not exist, create one
      let user = await this.userRepository.findOne({
        loginMethod: createWith,
        socialId,
      });
      if (!user) {
        user = this.userRepository.create({
          loginMethod: createWith,
          socialId,
          isVerified: true,
          ...profiles,
        });
        // Get a possible nickname
        const newNickname = await this.getPossibleNickname(nickname);
        user.nickname = newNickname;
        user = await this.userRepository.save(user);
      }
      // Get JWT token
      const loginResult = await this.authService.loginWithOAuth(
        user.loginMethod as SocialLoginMethod,
        user.socialId,
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
    return this.userRepository.findOne({ email }, options);
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
        nickname: user.nickname,
      },
    };
  }

  async getMyHeartStudios(user: User): Promise<GetMyHeartStudiosOutput> {
    try {
      const { heartStudios } = await this.userRepository.findOne(
        { id: user.id },
        { relations: ['heartStudios', 'heartStudios.catchphrases'] },
      );
      if (!heartStudios) {
        return {
          ok: false,
          error: 'USER_NOT_FOUND',
        };
      }
      return {
        ok: true,
        studios: heartStudios,
      };
    } catch (e) {
      console.log(e);
      return UNEXPECTED_ERROR;
    }
  }

  async getMyHeartStudioPhotos(
    user: User,
    { page }: GetMyHeartStudioPhotosInput,
  ): Promise<GetMyHeartStudioPhotosOutput> {
    try {
      const isUserFound = await this.userRepository.findOne({ id: user.id });
      if (!isUserFound) {
        return {
          ok: false,
          error: 'USER_NOT_FOUND',
        };
      }
      return this.photosService.getHeartStudioPhotosByUserId(user.id, page);
    } catch (e) {
      console.log(e);
      return UNEXPECTED_ERROR;
    }
  }

  updateUser(user: User): Promise<User> {
    return this.userRepository.save(user);
  }

  /* TBU
  async updateUserProfileById(
    id: number,
    { email, nickname, ...others }: UpdateUserProfileInput,
  ): Promise<UpdateUserProfileOutput> {
    try {
      const userToUpdate = await this.getUserById(id);
      if (!userToUpdate) {
        return {
          ok: false,
          error: 'User not found',
        };
      }

      if (email) {
        // If email exists, do not allow to update it
        if (userToUpdate.email) {
          return {
            ok: false,
            error: 'You cannot change email once you register',
          };
        }
        const userWithEmail = await this.getUserByEmail(email);
        if (userWithEmail) {
          return {
            ok: false,
            error: 'User with that email already exists',
          };
        }
        userToUpdate.email = email;
      }
      if (nickname) {
        const userWithNickname = await this.getUserByNickname(nickname);
        if (userWithNickname) {
          return {
            ok: false,
            error: 'User with that nickname already exists',
          };
        }
        userToUpdate.nickname = nickname;
      }
      for (const key in others) {
        userToUpdate[key] = others[key];
      }
      const updatedUser = await this.updateUser(userToUpdate);
      return {
        ok: true,
        profile: updatedUser,
      };
    } catch (e) {
      console.log(e);
      return UNEXPECTED_ERROR;
    }
  }
  */

  // TODO: 비밀번호 수정 구현 (재설정, 변경 both)

  async deleteUserById(id: number): Promise<DeleteUserOutput> {
    try {
      const user = await this.getUserById(id);
      if (!user) {
        return {
          ok: false,
          error: 'USER_NOT_FOUND',
        };
      }
      // TODO: Handle social users
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
}
