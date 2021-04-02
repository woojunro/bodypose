import { forwardRef, Inject, Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { GqlExecutionContext } from '@nestjs/graphql';
import { JwtService } from '@nestjs/jwt';
import {
  CommonError,
  UNEXPECTED_ERROR,
} from 'src/common/constants/error.constant';
import { SocialProvider } from 'src/users/entities/social-account.entity';
import { User } from 'src/users/entities/user.entity';
import { UsersService } from 'src/users/users.service';
import {
  EmailLoginInput,
  LoginOutput,
  SocialLoginInput,
} from './dtos/login.dto';
import { GetOAuthProfileWithAccessTokenOutput } from './dtos/oauth.dto';
import { getGoogleProfileWithAccessToken } from './utils/googleAuth.util';
import {
  getKakaoProfileWithAccessToken,
  unlinkKakaoUser,
} from './utils/kakaoOAuth.util';
import { getNaverProfileWithAccessToken } from './utils/naverLogin.util';

@Injectable()
export class AuthService {
  constructor(
    @Inject(forwardRef(() => UsersService))
    private readonly usersService: UsersService,
    private readonly jwtService: JwtService,
    private readonly configService: ConfigService,
  ) {}

  processLogin(user: User, context: any): LoginOutput {
    // Check if the user is locked
    if (user.isLocked) return CommonError('USER_LOCKED');
    // Issue an auth token
    const payload = { id: user.id };
    const token = this.jwtService.sign(payload);
    // Update lastLogin
    this.usersService.updateLastLoginAt(user.id);
    // Set cookie
    context.res.cookie('authorization', token, {
      expires: new Date(Date.now() + 2 * 60 * 60 * 1000),
      httpOnly: true,
      sameSite: 'lax',
    });
    // If not verified, notify
    return {
      ok: true,
      token,
      error: user.isVerified ? null : 'USER_NOT_VERIFIED',
    };
  }

  async emailLogin(
    { email, password }: EmailLoginInput,
    context: GqlExecutionContext,
  ): Promise<LoginOutput> {
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

      return this.processLogin(user, context);
    } catch (e) {
      console.log(e);
      return UNEXPECTED_ERROR;
    }
  }

  async socialLogin(
    { provider, accessToken }: SocialLoginInput,
    context: GqlExecutionContext,
  ): Promise<LoginOutput> {
    try {
      // Get OAuth Profile
      const {
        ok,
        error,
        profile: { socialId, email },
      } = await this.getOAuthProfileWithAccessToken(accessToken, provider);
      if (!ok) return { ok, error };

      // TEMPORARY: FOR KAKAO
      if (!email) {
        if (provider === SocialProvider.KAKAO)
          unlinkKakaoUser(
            socialId,
            this.configService.get<string>('KAKAO_ADMIN_KEY'),
          );
        return CommonError('EMAIL_NOT_FOUND');
      }

      // Check if the profile is connected to a user
      let user = await this.usersService.getUserBySocialId(provider, socialId);
      if (!user) {
        user = await this.usersService.createSocialAccount(
          email,
          provider,
          socialId,
        );
      }

      return this.processLogin(user, context);
    } catch (e) {
      console.log(e);
      return UNEXPECTED_ERROR;
    }
  }

  async getOAuthProfileWithAccessToken(
    accessToken: string,
    provider: SocialProvider,
  ): Promise<GetOAuthProfileWithAccessTokenOutput> {
    try {
      let result: GetOAuthProfileWithAccessTokenOutput;
      switch (provider) {
        case SocialProvider.KAKAO:
          result = await getKakaoProfileWithAccessToken(accessToken);
          break;
        case SocialProvider.NAVER:
          result = await getNaverProfileWithAccessToken(accessToken);
          break;
        case SocialProvider.GOOGLE:
          result = await getGoogleProfileWithAccessToken(
            this.configService.get<string>('GOOGLE_AUTH_CLIENT_ID'),
            accessToken,
          );
          break;
        default:
          result = CommonError('INVALID_REQUEST');
          break;
      }
      return result;
    } catch (e) {
      console.log(e);
      return UNEXPECTED_ERROR;
    }
  }
}
