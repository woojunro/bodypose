import { Field, ObjectType } from '@nestjs/graphql';

@ObjectType()
export abstract class CoreOutput {
  @Field(type => Boolean)
  ok: boolean;

  @Field(type => String, { nullable: true })
  error?: string;
}
