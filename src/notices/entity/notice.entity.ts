import { Field, ObjectType } from '@nestjs/graphql';
import { IsString, Length } from 'class-validator';
import { CoreEntity } from 'src/common/entities/core.entity';
import { Column, Entity } from 'typeorm';

@Entity()
@ObjectType()
export class Notice extends CoreEntity {
  @Column({ length: 100 })
  @Field(type => String)
  @Length(1, 100)
  title: string;

  @Column({ type: 'text' })
  @Field(type => String)
  @IsString()
  content: string;
}
