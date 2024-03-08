import { Field, InputType, Int, OmitType, PartialType } from '@nestjs/graphql';
import { Min } from 'class-validator';
import { CreateArticleInput } from './create-article.dto';

@InputType()
export class UpdateArticleInput extends PartialType(
  OmitType(CreateArticleInput, ['authorId']),
) {
  @Field(type => Int)
  @Min(1)
  id: number;
}
