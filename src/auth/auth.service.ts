import { v4 } from 'uuid';
import {
  forwardRef,
  Inject,
  Injectable,
  InternalServerErrorException,
  UnauthorizedException,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { GqlExecutionContext } from '@nestjs/graphql';
import { JwtService } from '@nestjs/jwt';
import { InjectRepository } from '@nestjs/typeorm';
import { Request, Response } from 'express';
import {
  CommonError,
  UNEXPECTED_ERROR,
} from 'src/common/constants/error.constant';
import {
  ACCESS_TOKEN_COOKIE_OPTIONS,
  REFRESH_TOKEN_COOKIE_OPTIONS,
} from 'src/common/constants/token-cookie.constant';
import { OAuthProvider } from 'src/users/entities/user-oauth.entity';
import { User } from 'src/users/entities/user.entity';
import { UsersService } from 'src/users/users.service';
import { Repository } from 'typeorm';
import {
  EmailLoginInput,
  LoginOutput,
  SocialLoginInput,
} from './dtos/login.dto';
import { GetOAuthProfileWithAccessTokenOutput } from './dtos/oauth.dto';
import { RefreshTokenOutput } from './dtos/refresh-token.dto';
import { RefreshToken } from './entities/refresh-token.entity';
import { getGoogleProfileWithAccessToken } from './utils/googleAuth.util';
import {
  getKakaoProfileWithAccessToken,
  unlinkKakaoUser,
} from './utils/kakaoOAuth.util';
import { getNaverProfileWithAccessToken } from './utils/naverLogin.util';
import { LogoutInput, LogoutOutput } from './dtos/logout.dto';

@Injectable()
export class AuthService {
  constructor(
    @Inject(forwardRef(() => UsersService))
    private readonly usersService: UsersService,
    private readonly jwtService: JwtService,
    private readonly configService: ConfigService,
    @InjectRepository(RefreshToken)
    private readonly refreshTokenRepository: Repository<RefreshToken>,
  ) {}

  async processLogin(user: User, context: any): Promise<LoginOutput> {
    try {
      // Check if the user is locked
      if (user.isLocked) return CommonError('USER_LOCKED');
      // Issue an auth token
      const payload = { id: user.id };
      const token = this.jwtService.sign(payload);
      // Update lastLogin
      this.usersService.updateLastLoginAt(user.id);
      // Set cookie
      const refresh = await this.issueRefreshToken(user.id);
      context.res.cookie('refresh', refresh, REFRESH_TOKEN_COOKIE_OPTIONS);
      context.res.cookie('authorization', token, ACCESS_TOKEN_COOKIE_OPTIONS);
      // If not verified, notify
      return {
        ok: true,
        token,
        refresh,
        error: user.isVerified ? null : 'USER_NOT_VERIFIED',
      };
    } catch (e) {
      console.log(e);
      return UNEXPECTED_ERROR;
    }
  }

  async issueRefreshToken(id: number): Promise<string> {
    try {
      let refreshToken = await this.refreshTokenRepository.findOne({
        user: { id },
      });
      if (!refreshToken?.token) {
        const token = v4();
        refreshToken = await this.refreshTokenRepository.save(
          this.refreshTokenRepository.create({
            token,
            user: { id },
          }),
        );
      }
      const payload = { id, token: refreshToken.token };
      return this.jwtService.sign(payload, {
        secret: this.configService.get<string>('JWT_REFRESH_TOKEN_SECRET'),
        expiresIn: this.configService.get<string>('JWT_REFRESH_TOKEN_EXPIRE'),
      });
    } catch (e) {
      console.log(e);
      throw new InternalServerErrorException();
    }
  }

  async refreshAccessToken(
    { cookies, body }: Request,
    res: Response,
  ): Promise<RefreshTokenOutput> {
    try {
      let { refresh } = cookies;
      if (!refresh) refresh = body.refresh;
      if (!refresh) throw new Error();
      const payload = this.jwtService.verify(refresh, {
        secret: this.configService.get<string>('JWT_REFRESH_TOKEN_SECRET'),
      });
      // If the token is expired, verify() will throw an error
      const {
        token,
        user,
      } = await this.refreshTokenRepository
        .createQueryBuilder('refresh')
        .innerJoin('refresh.user', 'user')
        .addSelect('user.id')
        .addSelect('user.isLocked')
        .where('userId = :id', { id: payload.id })
        .getOne();
      if (token !== payload.token || user.isLocked) throw new Error();

      // Issue tokens
      const accessToken = this.jwtService.sign({ id: user.id });
      // Sliding refresh token exp
      const thirtyDaysInSeconds = 60 * 60 * 24 * 30;
      if (
        Number(payload.exp) - thirtyDaysInSeconds <
        Math.floor(Date.now() / 1000)
      )
        refresh = this.jwtService.sign(
          { id: user.id, token },
          {
            secret: this.configService.get<string>('JWT_REFRESH_TOKEN_SECRET'),
            expiresIn: this.configService.get<string>(
              'JWT_REFRESH_TOKEN_EXPIRE',
            ),
          },
        );

      // Set cookies
      res.cookie('refresh', refresh, REFRESH_TOKEN_COOKIE_OPTIONS);
      res.cookie('authorization', accessToken, ACCESS_TOKEN_COOKIE_OPTIONS);

      return {
        ok: true,
        token: accessToken,
        refresh,
      };
    } catch (e) {
      console.log(e);
      throw new UnauthorizedException();
    }
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
      if ([].length !== 0) return CommonError('SOCIAL_ACCOUNTS_EXIST');
      // Check if the password is correct
      const isPasswordCorrect = true;
      if (!isPasswordCorrect) return CommonError('WRONG_PASSWORD');

      return await this.processLogin(user, context);
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
        if (provider === OAuthProvider.KAKAO)
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

      return await this.processLogin(user, context);
    } catch (e) {
      console.log(e);
      return UNEXPECTED_ERROR;
    }
  }

  async getOAuthProfileWithAccessToken(
    accessToken: string,
    provider: OAuthProvider,
  ): Promise<GetOAuthProfileWithAccessTokenOutput> {
    try {
      let result: GetOAuthProfileWithAccessTokenOutput;
      switch (provider) {
        case OAuthProvider.KAKAO:
          result = await getKakaoProfileWithAccessToken(accessToken);
          break;
        case OAuthProvider.NAVER:
          result = await getNaverProfileWithAccessToken(accessToken);
          break;
        case OAuthProvider.GOOGLE:
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

  async logout(
    user: User,
    { fromAllDevices }: LogoutInput,
    context: any,
  ): Promise<LogoutOutput> {
    try {
      if (fromAllDevices) {
        await this.refreshTokenRepository.save(
          this.refreshTokenRepository.create({
            user: { id: user.id },
            token: null,
          }),
        );
      }
      // Clear cookies
      context.res.clearCookie('authorization');
      context.res.clearCookie('refresh', {
        path: REFRESH_TOKEN_COOKIE_OPTIONS.path,
      });
      return { ok: true };
    } catch (e) {
      console.log(e);
      return UNEXPECTED_ERROR;
    }
  }
}
