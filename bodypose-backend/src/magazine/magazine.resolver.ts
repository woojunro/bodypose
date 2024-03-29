import { Args, Mutation, Query, Resolver } from '@nestjs/graphql';
import { Roles } from 'src/auth/roles.decorator';
import { CoreOutput } from 'src/common/dtos/output.dto';
import { UserType } from 'src/users/entities/user.entity';
import { AllArticleCategoriesOutput } from './dtos/all-article-categories.dto';
import { AllEditorsOutput } from './dtos/all-editors.dto';
import { ArticleInput, ArticleOutput } from './dtos/article.dto';
import { ArticlesInput, ArticlesOutput } from './dtos/articles.dto';
import { CreateArticleCategoryInput } from './dtos/create-article-category.dto';
import { CreateArticleInput } from './dtos/create-article.dto';
import { CreateEditorInput } from './dtos/create-editor.dto';
import { DeleteArticleCategoryInput } from './dtos/delete-article-category.dto';
import { DeleteArticleInput } from './dtos/delete-article.dto';
import { DeleteEditorInput } from './dtos/delete-editor.dto';
import { UpdateArticleCategoryInput } from './dtos/update-article-category.dto';
import { UpdateArticleInput } from './dtos/update-article.dto';
import { UpdateEditorInput } from './dtos/update-editor.dto';
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

  @Mutation(returns => CoreOutput)
  @Roles(UserType.ADMIN)
  createEditor(@Args('input') input: CreateEditorInput): Promise<CoreOutput> {
    return this.magazineService.createEditor(input);
  }

  @Query(returns => AllEditorsOutput)
  @Roles(UserType.ADMIN)
  allEditors(): Promise<AllEditorsOutput> {
    return this.magazineService.getAllEditors();
  }

  @Mutation(returns => CoreOutput)
  @Roles(UserType.ADMIN)
  updateEditor(@Args('input') input: UpdateEditorInput): Promise<CoreOutput> {
    return this.magazineService.updateEditor(input);
  }

  @Mutation(returns => CoreOutput)
  @Roles(UserType.ADMIN)
  deleteEditor(@Args('input') input: DeleteEditorInput): Promise<CoreOutput> {
    return this.magazineService.deleteEditor(input);
  }

  @Mutation(returns => CoreOutput)
  @Roles(UserType.ADMIN)
  createArticle(@Args('input') input: CreateArticleInput): Promise<CoreOutput> {
    return this.magazineService.createArticle(input);
  }

  // Public
  @Query(returns => ArticlesOutput)
  articles(@Args('input') input: ArticlesInput): Promise<ArticlesOutput> {
    return this.magazineService.getArticles(input);
  }

  // Public
  @Query(returns => ArticleOutput)
  article(@Args('input') input: ArticleInput): Promise<ArticleOutput> {
    return this.magazineService.getArticle(input);
  }

  @Mutation(returns => CoreOutput)
  @Roles(UserType.ADMIN)
  updateArticle(@Args('input') input: UpdateArticleInput): Promise<CoreOutput> {
    return this.magazineService.updateArticle(input);
  }

  @Mutation(returns => CoreOutput)
  @Roles(UserType.ADMIN)
  deleteArticle(@Args('input') input: DeleteArticleInput): Promise<CoreOutput> {
    return this.magazineService.deleteArticle(input);
  }
}
