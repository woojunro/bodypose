import { Field, InputType, Int, PartialType } from '@nestjs/graphql';
import { CreateArticleCategoryInput } from './create-article-category.dto';

@InputType()
export class UpdateArticleCategoryInput extends PartialType(
  CreateArticleCategoryInput,
) {
  @Field(type => Int)
  id: number;
}
