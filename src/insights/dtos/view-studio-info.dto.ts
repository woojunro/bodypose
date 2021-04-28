import { Field, InputType, Int } from '@nestjs/graphql';
import { IsEnum, IsInt } from 'class-validator';
import { ViewSource } from '../entities/log-studio-info-view.entity';

@InputType()
export class ViewStudioInfoInput {
  @Field(type => ViewSource)
  @IsEnum(ViewSource)
  source: ViewSource;

  @Field(type => Int)
  @IsInt()
  studioId: number;
}
