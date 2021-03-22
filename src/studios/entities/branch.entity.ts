import { Field, ObjectType } from '@nestjs/graphql';
import { IsString } from 'class-validator';
import { CoreEntity } from 'src/common/entities/core.entity';
import { Column, Entity, ManyToOne } from 'typeorm';
import { Studio } from './studio.entity';

@Entity()
@ObjectType()
export class Branch extends CoreEntity {
  @Column()
  @Field(type => String)
  @IsString()
  name: string;

  @Column()
  @Field(type => String)
  @IsString()
  address: string;

  @ManyToOne(relation => Studio, studio => studio.branches, {
    onDelete: 'CASCADE',
  })
  @Field(type => Studio)
  studio: Studio;
}
