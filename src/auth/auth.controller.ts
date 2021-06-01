import {
  Body,
  Controller,
  HttpCode,
  Post,
  Request,
  Response,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { EmailLoginInput, LoginOutput } from './dtos/login.dto';
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

  @Post('refresh')
  refreshToken(
    @Request() req,
    @Response({ passthrough: true }) res,
  ): Promise<RefreshTokenOutput> {
    return this.authService.refreshAccessToken(req, res);
  }
}
