import { compare } from 'bcrypt';
import { v4 } from 'uuid';
import {
  BadRequestException,
  ConflictException,
  ForbiddenException,
  forwardRef,
  Inject,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { InjectRepository } from '@nestjs/typeorm';
import { CookieOptions, Request, Response } from 'express';
import {
  CommonError,
  UNEXPECTED_ERROR,
} from 'src/common/constants/error.constant';
import { OAuthProvider } from 'src/users/entities/user-oauth.entity';
import { User, UserType } from 'src/users/entities/user.entity';
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
import { getKakaoProfileWithAccessToken } from './utils/kakaoOAuth.util';
import { getNaverProfileWithAccessToken } from './utils/naverLogin.util';
import { LogoutInput, LogoutOutput } from './dtos/logout.dto';
import { ConfigService } from '@nestjs/config';
import {
  ACCESS_TOKEN_EXPIRES_IN,
  REFRESH_TOKEN_EXPIRES_IN,
  REFRESH_TOKEN_VALIDITY_MS,
  ACCESS_TOKEN_VALIDITY_MS,
} from 'src/auth/constants/cookie.constant';

@Injectable()
export class AuthService {
  private shouldCookieSecure: boolean;

  constructor(
    @Inject(forwardRef(() => UsersService))
    private readonly usersService: UsersService,
    private readonly jwtService: JwtService,
    private readonly configService: ConfigService,
    @InjectRepository(RefreshToken)
    private readonly refreshTokenRepository: Repository<RefreshToken>,
  ) {
    this.shouldCookieSecure =
      configService.get<string>('NODE_ENV') === 'production';
  }

  async processLogin(user: User, res: Response): Promise<LoginOutput> {
    // Check if the user is locked
    if (user.isLocked) throw new ForbiddenException('USER_LOCKED');
    // Issue an auth token
    const payload = { id: user.id };
    const token = this.jwtService.sign(payload, {
      expiresIn: ACCESS_TOKEN_EXPIRES_IN,
    });
    // Set cookies
    const refresh = await this.issueRefreshToken(user.id);
    const now = Date.now();
    this.setRefreshTokenCookie(res, refresh, now);
    this.setAccessTokenCookies(res, token, now);
    // Update lastLogin
    this.usersService.updateLastLoginAt(user.id);
    // return
    return {
      access: token,
      refresh,
    };
  }

  getTokenCookieOption(isAccessToken: boolean, now: number): CookieOptions {
    if (isAccessToken) {
      return {
        secure: this.shouldCookieSecure,
        expires: new Date(now + ACCESS_TOKEN_VALIDITY_MS),
        httpOnly: true,
        sameSite: 'lax',
      };
    } else {
      // Refresh token
      return {
        secure: this.shouldCookieSecure,
        expires: new Date(now + REFRESH_TOKEN_VALIDITY_MS),
        httpOnly: true,
        sameSite: 'lax',
        path: '/auth/refresh',
      };
    }
  }

  setAccessTokenCookies(res: Response, token: string, now: number): void {
    // HttpOnly
    res.cookie('authorization', token, this.getTokenCookieOption(true, now));
    // For checking if the access token exists
    // deepcode ignore WebCookieHttpOnlyDisabledExplicitly: needs insecure cookies in dev mode
    res.cookie('access', 'access', {
      secure: this.shouldCookieSecure,
      expires: new Date(now + ACCESS_TOKEN_VALIDITY_MS),
      httpOnly: false,
      sameSite: 'lax',
    });
  }

  setRefreshTokenCookie(res: Response, token: string, now: number): void {
    res.cookie('refresh', token, this.getTokenCookieOption(false, now));
  }

  clearAllAuthCookies(res: Response): void {
    res.clearCookie('authorization');
    res.clearCookie('access');
    res.clearCookie('refresh', { path: '/auth/refresh' });
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
        expiresIn: REFRESH_TOKEN_EXPIRES_IN,
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
      const payload = this.jwtService.verify(refresh);
      // If the token is expired, verify() will throw an error
      const refreshToken = await this.refreshTokenRepository
        .createQueryBuilder('refresh')
        .innerJoin('refresh.user', 'user')
        .addSelect('user.id')
        .addSelect('user.isLocked')
        .where('userId = :id', { id: payload.id })
        .getOne();
      if (!refreshToken) throw new Error();
      const { token, user } = refreshToken;
      if (token !== payload.token || user.isLocked) throw new Error();

      const now = Date.now();
      // Issue tokens
      const accessToken = this.jwtService.sign(
        { id: user.id },
        { expiresIn: ACCESS_TOKEN_EXPIRES_IN },
      );
      // Sliding refresh token exp
      const thirtyDaysInSeconds = 60 * 60 * 24 * 30;
      if (Number(payload.exp) - thirtyDaysInSeconds < Math.floor(now / 1000)) {
        // Set refresh
        refresh = await this.issueRefreshToken(user.id);
        this.setRefreshTokenCookie(res, refresh, now);
      }
      // Set access
      this.setAccessTokenCookies(res, accessToken, now);
      return {
        access: accessToken,
        refresh,
      };
    } catch (e) {
      console.log(e);
      this.clearAllAuthCookies(res);
      throw new UnauthorizedException();
    }
  }

  async emailLogin(
    { email, password }: EmailLoginInput,
    res: Response,
  ): Promise<LoginOutput> {
    // Get a user with the inputted email
    const user = await this.usersService.getUserByEmail(email);
    if (!user) throw new NotFoundException('USER_NOT_FOUND');
    if (user.type === UserType.STUDIO) {
      throw new ForbiddenException('FORBIDDEN_LOGIN_METHOD');
    }
    // Check if the user is created with social oauth
    if (user.oauthList.length !== 0) {
      throw new BadRequestException('SOCIAL_USER');
    }
    // Check if the password is correct
    const isPasswordCorrect = await compare(password, user.password);
    if (!isPasswordCorrect) throw new UnauthorizedException('WRONG_PASSWORD');

    return await this.processLogin(user, res);
  }

  async socialLogin(
    { provider, accessToken, email: emailInput }: SocialLoginInput,
    res: Response,
  ): Promise<LoginOutput> {
    // Get OAuth Profile
    const {
      ok,
      error,
      profile: { socialId, email },
    } = await this.getOAuthProfileWithAccessToken(accessToken, provider);
    if (!ok) throw new InternalServerErrorException(error);

    // Check if the profile is connected to a user
    let user = await this.usersService.getUserBySocialId(provider, socialId);
    if (!user) {
      if (!(email || emailInput)) {
        throw new BadRequestException('EMAIL_NOT_FOUND');
      }
      if (email) {
        const existingUser = await this.usersService.getUserByEmail(
          email,
          false,
        );
        if (existingUser) {
          if (existingUser.type !== UserType.USER) {
            throw new ForbiddenException('FORBIDDEN_LOGIN_METHOD');
          }
          const { error } = await this.usersService.createUserOAuth(
            existingUser.id,
            provider,
            socialId,
          );
          if (error) throw new InternalServerErrorException(error);
          user = existingUser;
        } else {
          user = await this.usersService.createSocialAccount(
            email,
            provider,
            socialId,
            true,
          );
        }
      } else {
        const existingUser = await this.usersService.getUserByEmail(
          emailInput,
          false,
        );
        if (existingUser) throw new ConflictException('DUPLICATE_EMAIL');
        user = await this.usersService.createSocialAccount(
          emailInput,
          provider,
          socialId,
          false,
        );
      }
    }
    return await this.processLogin(user, res);
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
    res: Response,
  ): Promise<LogoutOutput> {
    try {
      if (user && fromAllDevices) {
        await this.refreshTokenRepository.save(
          this.refreshTokenRepository.create({
            user: { id: user.id },
            token: null,
          }),
        );
      }
      this.clearAllAuthCookies(res);
      return { ok: true };
    } catch (e) {
      console.log(e);
      throw new InternalServerErrorException();
    }
  }
}
