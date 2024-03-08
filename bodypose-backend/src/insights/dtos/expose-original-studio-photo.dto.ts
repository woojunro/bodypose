import { Field, InputType, Int } from '@nestjs/graphql';
import { IsInt } from 'class-validator';

@InputType()
export class ExposeOriginalStudioPhotoInput {
  @Field(type => Int)
  @IsInt()
  studioPhotoId: number;
}
