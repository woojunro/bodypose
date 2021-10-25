import {
  Body,
  Controller,
  HttpCode,
  Post,
  Request,
  Response,
} from '@nestjs/common';
import { User } from 'src/users/entities/user.entity';
import { AuthService } from './auth.service';
import { CurrentUser } from './current-user.decorator';
import {
  EmailLoginInput,
  LoginOutput,
  SocialLoginInput,
} from './dtos/login.dto';
import { LogoutInput, LogoutOutput } from './dtos/logout.dto';
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

  @Post('login/partners')
  @HttpCode(200)
  partnersLogin(
    @Body() input: EmailLoginInput,
    @Response({ passthrough: true }) res,
  ): Promise<LoginOutput> {
    return this.authService.partnersLogin(input, res);
  }

  @Post('refresh')
  @HttpCode(200)
  refreshToken(
    @Request() req,
    @Response({ passthrough: true }) res,
  ): Promise<RefreshTokenOutput> {
    return this.authService.refreshAccessToken(req, res);
  }

  @Post('logout')
  @HttpCode(200)
  logout(
    @CurrentUser() user: User,
    @Body() input: LogoutInput,
    @Response({ passthrough: true }) res,
  ): Promise<LogoutOutput> {
    return this.authService.logout(user, input, res);
  }
}
