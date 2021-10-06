import { Field, InputType, Int, ObjectType, PickType } from '@nestjs/graphql';
import { Min } from 'class-validator';
import { CoreOutput } from 'src/common/dtos/output.dto';
import { Verification } from '../entities/verification.entity';

@InputType()
export class VerifyUserInput extends PickType(
  Verification,
  ['code'],
  InputType,
) {
  @Field(type => Int)
  @Min(1)
  userId: number;
}

@ObjectType()
export class VerifyUserOutput extends CoreOutput {}
