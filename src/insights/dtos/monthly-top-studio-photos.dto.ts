import { Field, InputType, Int, ObjectType, PickType } from '@nestjs/graphql';
import { Length, Max, Min } from 'class-validator';
import { CoreOutput } from 'src/common/dtos/output.dto';
import { StudioPhoto } from 'src/photos/entities/studio-photo.entity';

@InputType()
export class GetMonthlyTopStudioPhotosInput {
  @Field(type => String)
  @Length(1, 20)
  studioSlug: string;

  @Field(type => Int)
  @Min(2021)
  @Max(9999)
  year: number;

  @Field(type => Int)
  @Min(1)
  @Max(12)
  month: number;
}

@ObjectType()
export class StudioPhotoWithCount extends PickType(StudioPhoto, ['id']) {
  @Field(type => Int)
  count: number;
}

@ObjectType()
export class GetTopStudioPhotosOutput extends CoreOutput {
  @Field(type => [StudioPhotoWithCount], { nullable: true })
  studioPhotos?: StudioPhotoWithCount[];
}
