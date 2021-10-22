import { Args, Mutation, Query, Resolver } from '@nestjs/graphql';
import { Roles } from 'src/auth/roles.decorator';
import { CoreOutput } from 'src/common/dtos/output.dto';
import { UserType } from 'src/users/entities/user.entity';
import { AllArticleCategoriesOutput } from './dtos/all-article-categories.dto';
import { CreateArticleCategoryInput } from './dtos/create-article-category.dto';
import { DeleteArticleCategoryInput } from './dtos/delete-article-category.dto';
import { UpdateArticleCategoryInput } from './dtos/update-article-category.dto';
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

  // Public
  @Query(returns => AllArticleCategoriesOutput)
  allArticleCategories(): Promise<AllArticleCategoriesOutput> {
    return this.magazineService.getAllArticleCategories();
  }

  @Mutation(returns => CoreOutput)
  @Roles(UserType.ADMIN)
  updateArticleCategory(
    @Args('input') input: UpdateArticleCategoryInput,
  ): Promise<CoreOutput> {
    return this.magazineService.updateArticleCategory(input);
  }

  @Mutation(returns => CoreOutput)
  @Roles(UserType.ADMIN)
  deleteArticleCategory(
    @Args('input') input: DeleteArticleCategoryInput,
  ): Promise<CoreOutput> {
    return this.magazineService.deleteArticleCategory(input);
  }
}
