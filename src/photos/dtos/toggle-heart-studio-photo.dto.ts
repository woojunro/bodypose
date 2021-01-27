import { InputType, ObjectType, PickType } from '@nestjs/graphql';
import { ToggleHeartStudioOutput } from 'src/studios/dtos/toggle-heart-studio.dto';
import { StudioPhoto } from '../entities/studio-photo.entity';

@InputType()
export class ToggleHeartStudioPhotoInput extends PickType(
  StudioPhoto,
  ['id'],
  InputType,
) {}

@ObjectType()
export class ToggleHeartStudioPhotoOutput extends ToggleHeartStudioOutput {}
