import { Field, InputType, Int, ObjectType } from '@nestjs/graphql';
import { Min } from 'class-validator';
import {
  CursorPaginationInput,
  CursorPaginationOutput,
} from 'src/common/dtos/pagination.dto';
import { Article } from '../entities/article.entity';

@InputType()
export class ArticlesInput extends CursorPaginationInput {
  @Field(type => Int, { nullable: true })
  @Min(1)
  categoryId?: number;

  @Field(type => Int, { nullable: true })
  @Min(1)
  authorId?: number;
}

@ObjectType()
export class ArticlesOutput extends CursorPaginationOutput {
  @Field(type => [Article], { nullable: true })
  articles?: Article[];
}
