import { Args, Mutation, Query, Resolver } from '@nestjs/graphql';
import { Roles } from 'src/auth/roles.decorator';
import { Role } from 'src/users/entities/user.entity';
import {
  CreateNoticeInput,
  CreateNoticeOutput,
} from './dtos/create-notice.dto';
import {
  DeleteNoticeInput,
  DeleteNoticeOutput,
} from './dtos/delete-notice.dto';
import {
  GetNoticeInput,
  GetNoticeOutput,
  GetNoticesInput,
  GetNoticesOutput,
} from './dtos/get-notice.dto';
import {
  UpdateNoticeInput,
  UpdateNoticeOutput,
} from './dtos/update-notice.dto';
import { Notice } from './entity/notice.entity';
import { NoticesService } from './notices.service';

@Resolver(of => Notice)
export class NoticesResolver {
  constructor(private readonly noticesService: NoticesService) {}

  // Public
  @Query(returns => GetNoticesOutput)
  notices(@Args('input') input: GetNoticesInput): Promise<GetNoticesOutput> {
    return this.noticesService.getNotices(input);
  }

  // Public
  @Query(returns => GetNoticeOutput)
  notice(@Args('input') input: GetNoticeInput): Promise<GetNoticeOutput> {
    return this.noticesService.getNotice(input);
  }

  @Roles(Role.ADMIN)
  @Mutation(returns => CreateNoticeOutput)
  createNotice(
    @Args('input') input: CreateNoticeInput,
  ): Promise<CreateNoticeOutput> {
    return this.noticesService.createNotice(input);
  }

  @Roles(Role.ADMIN)
  @Mutation(returns => UpdateNoticeOutput)
  updateNotice(@Args('input') input: UpdateNoticeInput) {
    return this.noticesService.updateNotice(input);
  }

  @Roles(Role.ADMIN)
  @Mutation(returns => DeleteNoticeOutput)
  deleteNotice(
    @Args('input') input: DeleteNoticeInput,
  ): Promise<DeleteNoticeOutput> {
    return this.noticesService.deleteNotice(input);
  }
}
