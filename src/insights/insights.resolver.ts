import { Args, Mutation, Resolver } from '@nestjs/graphql';
import { CurrentUser } from 'src/auth/current-user.decorator';
import { CoreOutput } from 'src/common/dtos/output.dto';
import { User } from 'src/users/entities/user.entity';
import { ExposeOriginalStudioPhotoInput } from './dtos/expose-original-studio-photo.dto';
import { InsightsService } from './insights.service';

@Resolver()
export class InsightsResolver {
  constructor(private readonly insightsService: InsightsService) {}

  // 컨셉북에서 원본 사진 노출 (thumbnail 클릭)
  @Mutation(returns => CoreOutput)
  exposeOriginalStudioPhoto(
    @CurrentUser() user: User,
    @Args('input') input: ExposeOriginalStudioPhotoInput,
  ): Promise<CoreOutput> {
    return this.insightsService.exposeOriginalStudioPhoto(user, input);
  }
}
