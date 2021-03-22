import { Field, InputType, ObjectType, PickType } from '@nestjs/graphql';
import { IsString } from 'class-validator';
import { CoreOutput } from 'src/common/dtos/output.dto';
import { StudioPhoto } from '../entities/studio-photo.entity';

@InputType()
export class DeleteStudioPhotoInput extends PickType(
  StudioPhoto,
  ['id'],
  InputType,
) {
  @Field(type => String)
  @IsString()
  studioSlug: string;
}

@ObjectType()
export class DeleteStudioPhotoOutput extends CoreOutput {}
