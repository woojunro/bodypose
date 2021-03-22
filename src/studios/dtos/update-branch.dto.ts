import { InputType, ObjectType } from '@nestjs/graphql';
import { CreateBranchInput, CreateBranchOutput } from './create-branch.dto';

@InputType()
export class UpdateBranchInput extends CreateBranchInput {}

@ObjectType()
export class UpdateBranchOutput extends CreateBranchOutput {}
