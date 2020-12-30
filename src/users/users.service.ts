import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { UNEXPECTED_ERROR } from 'src/common/constants/error.constant';
import { FindOneOptions, Repository } from 'typeorm';
import {
  CreateUserWithEmailInput,
  CreateUserWithEmailOutput,
} from './dtos/create-user.dto';
import { GetMyProfileOutput } from './dtos/get-my-profile.dto';
import {
  UpdateUserProfileInput,
  UpdateUserProfileOutput,
} from './dtos/update-user.dto';
import { LoginMethod, User } from './entities/user.entity';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
  ) {}

  checkPasswordSecurity(password: string): boolean {
    // At least one lowercase
    // At least one number
    // At least eight characters
    const passwordRegex = new RegExp('^(?=.*[0-9])(?=.*[a-z]).{8,}$');
    return passwordRegex.test(password);
  }

  async createUserWithEmail({
    email,
    password,
    nickname,
  }: CreateUserWithEmailInput): Promise<CreateUserWithEmailOutput> {
    try {
      // Check if there exists a user with the inputted email
      const userByEmail = await this.userRepository.findOne({ email });
      if (userByEmail) {
        return {
          ok: false,
          error: 'User with that email already exists',
        };
      }
      // Check password security
      const isPasswordSecure = this.checkPasswordSecurity(password);
      if (!isPasswordSecure) {
        return {
          ok: false,
          error: 'Password is not secure enough',
        };
      }
      // Check if there exists a user with the inputted nickname
      const userByNickname = await this.userRepository.findOne({ nickname });
      if (userByNickname) {
        return {
          ok: false,
          error: 'User with that nickname already exists',
        };
      }
      // Create and save the user
      const newUser = this.userRepository.create({ email, password, nickname });
      newUser.createdWith = LoginMethod.EMAIL;
      newUser.isVerified = false;
      await this.userRepository.save(newUser);
      // Return a token after login
      return {
        ok: true,
        token: 'sex',
      };
    } catch (e) {
      console.log(e);
      return {
        ok: false,
        error: UNEXPECTED_ERROR,
      };
    }
  }

  async getUserById(id: number, options?: FindOneOptions<User>): Promise<User> {
    return this.userRepository.findOne({ id }, options);
  }

  async getUserByEmail(
    email: string,
    options?: FindOneOptions<User>,
  ): Promise<User> {
    return this.userRepository.findOne({ email }, options);
  }

  async getUserProfileById(id: number): Promise<GetMyProfileOutput> {
    try {
      const user = await this.getUserById(id, {
        select: [
          'email',
          'gender',
          'isVerified',
          'nickname',
          'profileImageUrl',
          'createdWith',
        ],
      });
      if (!user) {
        return {
          ok: false,
          error: 'User not found',
        };
      }
      return {
        ok: true,
        profile: user,
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
