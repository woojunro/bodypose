import { Field, InputType, Int, ObjectType } from '@nestjs/graphql';
import { IsEmail, MaxLength, Min } from 'class-validator';
import { CoreOutput } from 'src/common/dtos/output.dto';

@InputType()
export class UpdateEmailInput {
  @Field(type => Int)
  @Min(1)
  userId: number;

  @Field(type => String)
  @IsEmail()
  @MaxLength(190)
  email: string;
}

@ObjectType()
export class UpdateEmailOutput extends CoreOutput {
  @Field(type => String, { nullable: true })
  email?: string;
}
