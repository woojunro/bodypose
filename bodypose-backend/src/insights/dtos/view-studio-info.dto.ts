import { Field, InputType, Int } from '@nestjs/graphql';
import { IsEnum, IsInt } from 'class-validator';
import { StudioInfoViewSource } from '../entities/log-studio-info-view.entity';

@InputType()
export class ViewStudioInfoInput {
  @Field(type => StudioInfoViewSource)
  @IsEnum(StudioInfoViewSource)
  source: StudioInfoViewSource;

  @Field(type => Int)
  @IsInt()
  studioId: number;
}
