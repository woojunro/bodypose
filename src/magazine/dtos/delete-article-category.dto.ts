import { InputType, PickType } from '@nestjs/graphql';
import { ArticleCategory } from '../entities/article-category.entity';

@InputType()
export class DeleteArticleCategoryInput extends PickType(
  ArticleCategory,
  ['id'],
  InputType,
) {}
