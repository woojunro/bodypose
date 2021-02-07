import { forwardRef, Inject, Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UNEXPECTED_ERROR } from 'src/common/constants/error.constant';
import { SocialLoginMethod } from 'src/users/dtos/create-user.dto';
import { LoginMethod } from 'src/users/entities/user.entity';
import { UsersService } from 'src/users/users.service';
import { LoginWithEmailInput, LoginOutput } from './dtos/login.dto';
import { GetOAuthProfileWithAccessTokenOutput } from './dtos/oauth.dto';
import { getKakaoProfileWithAccessToken } from './utils/kakaoOAuth.util';

@Injectable()
export class AuthService {
  constructor(
    @Inject(forwardRef(() => UsersService))
    private readonly usersService: UsersService,
    private readonly jwtService: JwtService,
  ) {}

  async loginWithEmail({
    email,
    password,
  }: LoginWithEmailInput): Promise<LoginOutput> {
    try {
      // Get a user with the inputted email
      const user = await this.usersService.getUserByEmail(email, {
        select: ['id', 'loginMethod', 'password'],
      });
      if (!user) {
        return {
          ok: false,
          error: 'User not found',
        };
      }
      // Check if the user is registered by email
      if (user.loginMethod !== LoginMethod.EMAIL) {
        return {
          ok: false,
          error: 'SOCIAL_USER',
        };
      }
      // Check if the password is correct
      const isPasswordCorrect = await user.checkPassword(password);
      if (!isPasswordCorrect) {
        return {
          ok: false,
          error: 'Wrong password',
        };
      }
      // Issue an auth token
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

  async loginWithOAuth(
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
          // TODO: Naver Auth 구현
          break;
        case LoginMethod.GOOGLE:
          // TODO: Google Auth 구현
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
