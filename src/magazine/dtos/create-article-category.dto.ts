import { InputType, PickType } from '@nestjs/graphql';
import { ArticleCategory } from '../entities/article-category.entity';

@InputType()
export class CreateArticleCategoryInput extends PickType(
  ArticleCategory,
  ['name', 'order'],
  InputType,
) {}
