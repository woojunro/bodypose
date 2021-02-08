import { Field, InputType, ObjectType, PickType } from '@nestjs/graphql';
import { CoreOutput } from 'src/common/dtos/output.dto';
import { Studio } from '../entities/studio.entity';

@InputType()
export class HeartStudioInput extends PickType(Studio, ['slug'], InputType) {}

@ObjectType()
export class HeartStudioOutput extends CoreOutput {}
