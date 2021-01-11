import { Field, InputType, Int, ObjectType, PickType } from '@nestjs/graphql';
import { IsInt } from 'class-validator';
import { CoreOutput } from 'src/common/dtos/output.dto';
import { StudioPhoto } from '../entities/studio-photo.entity';

@InputType()
export class DeleteStudioPhotoInput extends PickType(
  StudioPhoto,
  ['id'],
  InputType,
) {
  @Field(type => Int)
  @IsInt()
  studioId: number;
}

@ObjectType()
export class DeleteStudioPhotoOutput extends CoreOutput {}
