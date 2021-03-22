import { Field, InputType, Int, ObjectType, PickType } from '@nestjs/graphql';
import { CoreOutput } from 'src/common/dtos/output.dto';
import { StudioPhoto } from '../entities/studio-photo.entity';

@InputType()
export class HeartStudioPhotoInput extends PickType(
  StudioPhoto,
  ['id'],
  InputType,
) {}

@ObjectType()
export class HeartStudioPhotoOutput extends CoreOutput {
  @Field(type => Int, { nullable: true })
  id?: number;
}
