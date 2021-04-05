import { Controller, Post, Request, Response } from '@nestjs/common';
import { AuthService } from './auth.service';
import { RefreshTokenOutput } from './dtos/refresh-token.dto';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('refresh')
  refreshToken(
    @Request() req,
    @Response({ passthrough: true }) res,
  ): Promise<RefreshTokenOutput> {
    return this.authService.refreshAccessToken(req, res);
  }
}
