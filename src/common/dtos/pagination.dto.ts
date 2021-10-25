import { Field, InputType, Int, ObjectType } from '@nestjs/graphql';
import { IsInt, Min } from 'class-validator';
import { CoreOutput } from './output.dto';

@InputType()
export class PaginationInput {
  @Field(type => Int, { defaultValue: 1 })
  @IsInt()
  @Min(1)
  page: number;
}

@ObjectType()
export class PaginationOutput extends CoreOutput {
  @Field(type => Int, { nullable: true })
  totalPages?: number;
}

@InputType()
export class CursorPaginationInput {
  @Field(type => String, { nullable: true })
  beforeCursor?: string;

  @Field(type => String, { nullable: true })
  afterCursor?: string;
}

@ObjectType()
export class CursorPaginationOutput extends CoreOutput {
  @Field(type => String, { nullable: true })
  beforeCursor?: string;

  @Field(type => String, { nullable: true })
  afterCursor?: string;
}
