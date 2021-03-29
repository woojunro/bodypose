import { forwardRef, Inject, Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import {
  CommonError,
  UNEXPECTED_ERROR,
} from 'src/common/constants/error.constant';
import { SocialLoginMethod } from 'src/users/dtos/create-user.dto';
import { LoginMethod } from 'src/users/entities/user.entity';
import { UsersService } from 'src/users/users.service';
import { EmailLoginInput, LoginOutput } from './dtos/login.dto';
import { GetOAuthProfileWithAccessTokenOutput } from './dtos/oauth.dto';
import { getGoogleProfileWithAccessToken } from './utils/googleAuth.util';
import { getKakaoProfileWithAccessToken } from './utils/kakaoOAuth.util';
import { getNaverProfileWithAccessToken } from './utils/naverLogin.util';

@Injectable()
export class AuthService {
  constructor(
    @Inject(forwardRef(() => UsersService))
    private readonly usersService: UsersService,
    private readonly jwtService: JwtService,
    private readonly configService: ConfigService,
  ) {}

  async emailLogin({ email, password }: EmailLoginInput): Promise<LoginOutput> {
    try {
      // Get a user with the inputted email
      const user = await this.usersService.getUserByEmail(email);
      if (!user) return CommonError('USER_NOT_FOUND');
      // Check if the user has social accounts
      if (user.socialAccounts.length !== 0)
        return CommonError('SOCIAL_ACCOUNTS_EXIST');
      // Check if the password is correct
      const isPasswordCorrect = await user.checkPassword(password);
      if (!isPasswordCorrect) return CommonError('WRONG_PASSWORD');
      // Check if the user is locked
      if (user.isLocked) return CommonError('USER_LOCKED');
      // Issue an auth token
      const payload = { id: user.id };
      const token = this.jwtService.sign(payload);
      // Update lastLogin
      this.usersService.updateLastLoginAt(email);
      // If not verified, notify
      return {
        ok: true,
        token,
        error: !user.isVerified && 'USER_NOT_VERIFIED',
      };
    } catch (e) {
      console.log(e);
      return UNEXPECTED_ERROR;
    }
  }

  async socialLogin(
    createdWith: SocialLoginMethod,
    socialId: string,
  ): Promise<LoginOutput> {
    try {
      const user = await this.usersService.getUserBySocialId(
        createdWith,
        socialId,
      );
      if (!user) {
        return {
          ok: false,
          error: 'User not found',
        };
      }
      const payload = { id: user.id, loginMethod: user.loginMethod };
      const token = this.jwtService.sign(payload);
      return {
        ok: true,
        token,
      };
    } catch (e) {
      console.log(e);
      return UNEXPECTED_ERROR;
    }
  }

  async getOAuthProfileWithAccessToken(
    accessToken: string,
    createWith: SocialLoginMethod,
  ): Promise<GetOAuthProfileWithAccessTokenOutput> {
    try {
      let result: GetOAuthProfileWithAccessTokenOutput;
      switch (createWith) {
        case LoginMethod.KAKAO:
          result = await getKakaoProfileWithAccessToken(accessToken);
          break;
        case LoginMethod.NAVER:
          result = await getNaverProfileWithAccessToken(accessToken);
          break;
        case LoginMethod.GOOGLE:
          result = await getGoogleProfileWithAccessToken(
            this.configService.get<string>('GOOGLE_AUTH_CLIENT_ID'),
            accessToken,
          );
          break;
        default:
          result = {
            ok: false,
            error: 'Invalid request',
          };
          break;
      }
      return result;
    } catch (e) {
      console.log(e);
      return UNEXPECTED_ERROR;
    }
  }
}
