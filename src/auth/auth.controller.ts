import {
  Body,
  Controller,
  HttpCode,
  Post,
  Request,
  Response,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import {
  EmailLoginInput,
  LoginOutput,
  SocialLoginInput,
} from './dtos/login.dto';
import { RefreshTokenOutput } from './dtos/refresh-token.dto';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('login/email')
  @HttpCode(200)
  emailLogin(
    @Body() input: EmailLoginInput,
    @Response({ passthrough: true }) res,
  ): Promise<LoginOutput> {
    return this.authService.emailLogin(input, res);
  }

  @Post('login/oauth')
  @HttpCode(200)
  socialLogin(
    @Body() input: SocialLoginInput,
    @Response({ passthrough: true }) res,
  ): Promise<LoginOutput> {
    return this.authService.socialLogin(input, res);
  }

  @Post('refresh')
  @HttpCode(200)
  refreshToken(
    @Request() req,
    @Response({ passthrough: true }) res,
  ): Promise<RefreshTokenOutput> {
    return this.authService.refreshAccessToken(req, res);
  }
}
