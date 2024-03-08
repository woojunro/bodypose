import { InputType, ObjectType, PickType } from '@nestjs/graphql';
import { CoreOutput } from 'src/common/dtos/output.dto';
import { Studio } from '../entities/studio.entity';

@InputType()
export class SetStudioPublicInput extends PickType(
  Studio,
  ['slug', 'isPublic'],
  InputType,
) {}

@ObjectType()
export class SetStudioPublicOutput extends CoreOutput {}
