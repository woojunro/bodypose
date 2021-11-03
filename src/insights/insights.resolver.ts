import { Args, Mutation, Query, Resolver } from '@nestjs/graphql';
import { CurrentUser } from 'src/auth/current-user.decorator';
import { Roles } from 'src/auth/roles.decorator';
import { CoreOutput } from 'src/common/dtos/output.dto';
import { User, UserType } from 'src/users/entities/user.entity';
import { ContactStudioInput } from './dtos/contact-studio.dto';
import { ExposeOriginalStudioPhotoInput } from './dtos/expose-original-studio-photo.dto';
import { GetStatsInput, GetStatsOutput } from './dtos/stat.dto';
import { ViewArticleInput } from './dtos/view-article.dto';
import { ViewStudioInfoInput } from './dtos/view-studio-info.dto';
import { InsightsService } from './insights.service';

@Resolver()
export class InsightsResolver {
  constructor(private readonly insightsService: InsightsService) {}

  // 통계 쿼리 (weekly)
  @Query(returns => GetStatsOutput)
  @Roles(UserType.ADMIN, UserType.STUDIO)
  weeklyStats(
    @CurrentUser() user: User,
    @Args('input') input: GetStatsInput,
  ): Promise<GetStatsOutput> {
    return this.insightsService.getWeeklyStats(user, input);
  }

  // 통계 쿼리 (monthly)
  @Query(returns => GetStatsOutput)
  @Roles(UserType.ADMIN, UserType.STUDIO)
  monthlyStats(
    @CurrentUser() user: User,
    @Args('input') input: GetStatsInput,
  ): Promise<GetStatsOutput> {
    return this.insightsService.getMonthlyStats(user, input);
  }

  // 컨셉북에서 원본 사진 노출 (thumbnail 클릭)
  @Mutation(returns => CoreOutput)
  exposeOriginalStudioPhoto(
    @CurrentUser() user: User,
    @Args('input') input: ExposeOriginalStudioPhotoInput,
  ): Promise<CoreOutput> {
    return this.insightsService.exposeOriginalStudioPhoto(user, input);
  }

  // 스튜디오 정보 창 접속
  @Mutation(returns => CoreOutput)
  viewStudioInfo(
    @CurrentUser() user: User,
    @Args('input') input: ViewStudioInfoInput,
  ): Promise<CoreOutput> {
    return this.insightsService.viewStudioInfo(user, input);
  }

  // 스튜디오 문의, 예약 버튼 클릭
  @Mutation(returns => CoreOutput)
  contactStudio(
    @CurrentUser() user: User,
    @Args('input') input: ContactStudioInput,
  ): Promise<CoreOutput> {
    return this.insightsService.contactStudio(user, input);
  }

  // 매거진 칼럼 조회
  @Mutation(returns => CoreOutput)
  viewArticle(
    @CurrentUser() user: User,
    @Args('input') input: ViewArticleInput,
  ): Promise<CoreOutput> {
    return this.insightsService.viewArticle(user, input);
  }
}
