import { Field, InputType, ObjectType, PickType } from '@nestjs/graphql';
import { Type } from 'class-transformer';
import { ValidateNested } from 'class-validator';
import { CoreOutput } from 'src/common/dtos/output.dto';
import { Branch } from '../entities/branch.entity';
import { Studio } from '../entities/studio.entity';

@InputType()
class UpdateBranchPayload extends PickType(
  Branch,
  ['name', 'address', 'parkingInfo'],
  InputType,
) {}

@InputType()
export class UpdateBranchesInput extends PickType(Studio, ['slug'], InputType) {
  @Field(type => [UpdateBranchPayload])
  @ValidateNested({ each: true })
  @Type(() => UpdateBranchPayload)
  payload: UpdateBranchPayload[];
}

@ObjectType()
export class UpdateBranchesOutput extends CoreOutput {}
