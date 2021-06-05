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
import { Request, Response } from 'express';
import {
  CommonError,
  UNEXPECTED_ERROR,
} from 'src/common/constants/error.constant';
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
import { getKakaoProfileWithAccessToken } from './utils/kakaoOAuth.util';
import { getNaverProfileWithAccessToken } from './utils/naverLogin.util';
import { LogoutInput, LogoutOutput } from './dtos/logout.dto';
import { ConfigService } from '@nestjs/config';
import {
  NINETY_DAYS_IN_MS,
  TWO_HOURS_IN_MS,
} from 'src/common/constants/common.constant';

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

  async processLogin(user: User, res: Response): Promise<LoginOutput> {
    // Check if the user is locked
    console.log(user.isLocked);
    if (user.isLocked) throw new ForbiddenException('USER_LOCKED');
    // Issue an auth token
    const payload = { id: user.id };
    const token = this.jwtService.sign(payload, { expiresIn: '2h' });
    // Set cookies
    const refresh = await this.issueRefreshToken(user.id);
    res.cookie('refresh', refresh, {
      expires: new Date(Date.now() + NINETY_DAYS_IN_MS),
      httpOnly: true,
      path: '/auth/refresh',
      sameSite: 'lax',
    });
    res.cookie('authorization', token, {
      expires: new Date(Date.now() + TWO_HOURS_IN_MS),
      httpOnly: true,
      sameSite: 'lax',
    });
    // Update lastLogin
    this.usersService.updateLastLoginAt(user.id);
    // return
    return {
      access: token,
      refresh,
    };
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
      return this.jwtService.sign(payload, { expiresIn: '90d' });
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
      ) {
        // Set refresh
        refresh = await this.issueRefreshToken(user.id);
        res.cookie('refresh', refresh, {
          expires: new Date(Date.now() + NINETY_DAYS_IN_MS),
          httpOnly: true,
          path: '/auth/refresh',
          sameSite: 'lax',
        });
      }

      // Set access
      res.cookie('authorization', accessToken, {
        expires: new Date(Date.now() + TWO_HOURS_IN_MS),
        httpOnly: true,
        sameSite: 'lax',
      });

      return {
        access: accessToken,
        refresh,
      };
    } catch (e) {
      console.log(e);
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
      const existingUser = await this.usersService.getUserByEmail(
        email || emailInput,
        false,
      );
      if (existingUser) throw new ConflictException('DUPLICATE_EMAIL');
      user = await this.usersService.createSocialAccount(
        email || emailInput,
        provider,
        socialId,
        Boolean(email),
      );
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
      if (fromAllDevices) {
        await this.refreshTokenRepository.save(
          this.refreshTokenRepository.create({
            user: { id: user.id },
            token: null,
          }),
        );
      }
      // Clear cookies
      res.clearCookie('authorization');
      res.clearCookie('refresh', {
        path: '/auth/refresh',
      });
      return { ok: true };
    } catch (e) {
      console.log(e);
      throw new InternalServerErrorException();
    }
  }
}
