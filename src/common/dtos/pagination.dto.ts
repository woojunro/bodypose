import { Field, InputType, Int, ObjectType } from '@nestjs/graphql';
import { IsInt, IsOptional, Min } from 'class-validator';
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
