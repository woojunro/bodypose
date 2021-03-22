import { Field, InputType, ObjectType, PickType } from '@nestjs/graphql';
import { CoreOutput } from 'src/common/dtos/output.dto';
import { StudioPhoto } from '../entities/studio-photo.entity';

@InputType()
export class ClickStudioPhotoInput extends PickType(
  StudioPhoto,
  ['id'],
  InputType,
) {}

@ObjectType()
export class ClickStudioPhotoOutput extends CoreOutput {}
