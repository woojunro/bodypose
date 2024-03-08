import { Field, InputType, Int, registerEnumType } from '@nestjs/graphql';
import { IsEnum, IsInt } from 'class-validator';

export enum StudioContactType {
  CONTACT = 'CONTACT',
  RESERVATION = 'RESERVATION',
}

registerEnumType(StudioContactType, { name: 'StudioContactType' });

@InputType()
export class ContactStudioInput {
  @Field(type => StudioContactType)
  @IsEnum(StudioContactType)
  contactType: StudioContactType;

  @Field(type => Int)
  @IsInt()
  studioId: number;
}
