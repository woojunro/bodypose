import { Field, InputType, Int, PickType } from '@nestjs/graphql';
import { Min } from 'class-validator';
import { Article } from '../entities/article.entity';

@InputType()
export class CreateArticleInput extends PickType(
  Article,
  ['title', 'thumbnailUrl', 'content'],
  InputType,
) {
  @Field(type => Int)
  @Min(1)
  authorId: number;

  @Field(type => [Int])
  @Min(1, { each: true })
  categoryIds: number[];
}
