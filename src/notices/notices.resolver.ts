import { Args, Mutation, Query, Resolver } from '@nestjs/graphql';
import { Roles } from 'src/auth/roles.decorator';
import { CoreOutput } from 'src/common/dtos/output.dto';
import { UserType } from 'src/users/entities/user.entity';
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
  CreatePartnersNoticeInput,
  GetPartnersNoticeInput,
  GetPartnersNoticeOutput,
  GetPartnersNoticesInput,
  GetPartnersNoticesOutput,
  UpdatePartnersNoticeInput,
} from './dtos/partners-notice.dto';
import {
  UpdateNoticeInput,
  UpdateNoticeOutput,
} from './dtos/update-notice.dto';
import { Notice } from './entity/notice.entity';
import { PartnersNotice } from './entity/partners-notice.entity';
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

  @Roles(UserType.ADMIN)
  @Mutation(returns => CreateNoticeOutput)
  createNotice(
    @Args('input') input: CreateNoticeInput,
  ): Promise<CreateNoticeOutput> {
    return this.noticesService.createNotice(input);
  }

  @Roles(UserType.ADMIN)
  @Mutation(returns => UpdateNoticeOutput)
  updateNotice(@Args('input') input: UpdateNoticeInput) {
    return this.noticesService.updateNotice(input);
  }

  @Roles(UserType.ADMIN)
  @Mutation(returns => DeleteNoticeOutput)
  deleteNotice(
    @Args('input') input: DeleteNoticeInput,
  ): Promise<DeleteNoticeOutput> {
    return this.noticesService.deleteNotice(input);
  }
}

@Resolver(of => PartnersNotice)
export class PartnersNoticesResolver {
  constructor(private readonly noticesService: NoticesService) {}

  @Roles(UserType.ADMIN)
  @Mutation(returns => CoreOutput)
  createPartnersNotice(
    @Args('input') input: CreatePartnersNoticeInput,
  ): Promise<CoreOutput> {
    return this.noticesService.createPartnersNotice(input);
  }

  // Public
  @Query(returns => GetPartnersNoticesOutput)
  partnersNotices(
    @Args('input') input: GetPartnersNoticesInput,
  ): Promise<GetPartnersNoticesOutput> {
    return this.noticesService.getPartnersNotices(input);
  }

  // Public
  @Query(returns => GetPartnersNoticeOutput)
  partnersNotice(
    @Args('input') input: GetPartnersNoticeInput,
  ): Promise<GetPartnersNoticeOutput> {
    return this.noticesService.getPartnersNotice(input);
  }

  @Roles(UserType.ADMIN)
  @Mutation(returns => CoreOutput)
  updatePartnersNotice(
    @Args('input') input: UpdatePartnersNoticeInput,
  ): Promise<CoreOutput> {
    return this.noticesService.updatePartnersNotice(input);
  }

  @Roles(UserType.ADMIN)
  @Mutation(returns => CoreOutput)
  deletePartnersNotice(
    @Args('input') input: GetPartnersNoticeInput,
  ): Promise<CoreOutput> {
    return this.noticesService.deletePartnersNotice(input);
  }
}
