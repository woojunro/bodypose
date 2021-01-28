import { Args, Mutation, Resolver } from '@nestjs/graphql';
import { Roles } from 'src/auth/roles.decorator';
import { Role } from 'src/users/entities/user.entity';
import {
  CreateNoticeInput,
  CreateNoticeOutput,
} from './dtos/create-notice.dto';
import { Notice } from './entity/notice.entity';
import { NoticesService } from './notices.service';

@Resolver(of => Notice)
export class NoticesResolver {
  constructor(private readonly noticesService: NoticesService) {}

  @Roles(Role.ADMIN)
  @Mutation(returns => CreateNoticeOutput)
  createNotice(
    @Args('input') input: CreateNoticeInput,
  ): Promise<CreateNoticeOutput> {
    return this.noticesService.createNotice(input);
  }
}
