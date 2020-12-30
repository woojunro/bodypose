import { forwardRef, Inject, Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UNEXPECTED_ERROR } from 'src/common/constants/error.constant';
import { UsersService } from 'src/users/users.service';
import { LoginWithEmailInput, LoginWithEmailOutput } from './dtos/login.dto';

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
  }: LoginWithEmailInput): Promise<LoginWithEmailOutput> {
    try {
      // Get a user with the inputted email
      const user = await this.usersService.getUserByEmail(email, {
        select: ['id', 'createdWith', 'password'],
      });
      if (!user) {
        return {
          ok: false,
          error: 'User not found',
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
      const payload = { id: user.id, createdWith: user.createdWith };
      const token = this.jwtService.sign(payload);
      return {
        ok: true,
        token,
      };
    } catch (e) {
      console.log(e);
      return {
        ok: false,
        error: UNEXPECTED_ERROR,
      };
    }
  }
}
