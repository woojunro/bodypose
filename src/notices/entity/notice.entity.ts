import { Field, ObjectType } from '@nestjs/graphql';
import { IsString } from 'class-validator';
import { CoreEntity } from 'src/common/entities/core.entity';
import { Column, Entity } from 'typeorm';

@Entity()
@ObjectType()
export class Notice extends CoreEntity {
  @Column()
  @Field(type => String)
  @IsString()
  title: string;

  @Column({ type: 'text' })
  @Field(type => String)
  @IsString()
  content: string;
}
