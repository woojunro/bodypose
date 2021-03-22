import { Field, InputType, Int, ObjectType, PickType } from '@nestjs/graphql';
import { CoreOutput } from 'src/common/dtos/output.dto';
import { Branch } from '../entities/branch.entity';

@InputType()
class CreateBranchPayload extends PickType(
  Branch,
  ['name', 'address'],
  InputType,
) {}

@InputType()
export class CreateBranchInput {
  @Field(type => String)
  studioSlug: string;

  @Field(type => [CreateBranchPayload])
  payload: CreateBranchPayload[];
}

@ObjectType()
export class CreateBranchOutput extends CoreOutput {
  @Field(type => [Int], { nullable: true })
  idList?: number[];
}
