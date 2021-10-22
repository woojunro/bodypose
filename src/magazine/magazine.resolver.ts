import { Args, Mutation, Resolver } from '@nestjs/graphql';
import { Roles } from 'src/auth/roles.decorator';
import { CoreOutput } from 'src/common/dtos/output.dto';
import { UserType } from 'src/users/entities/user.entity';
import { CreateArticleCategoryInput } from './dtos/create-article-category.dto';
import { MagazineService } from './magazine.service';

@Resolver()
export class MagazineResolver {
  constructor(private readonly magazineService: MagazineService) {}

  @Mutation(returns => CoreOutput)
  @Roles(UserType.ADMIN)
  createArticleCategory(
    @Args('input') input: CreateArticleCategoryInput,
  ): Promise<CoreOutput> {
    return this.magazineService.createArticleCategory(input);
  }
}
