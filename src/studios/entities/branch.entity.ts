import { Field, ObjectType } from '@nestjs/graphql';
import { Length } from 'class-validator';
import { CoreEntity } from 'src/common/entities/core.entity';
import { Column, Entity, ManyToOne } from 'typeorm';
import { Studio } from './studio.entity';

@Entity()
@ObjectType()
export class Branch extends CoreEntity {
  @Column({ length: 10 })
  @Field(type => String)
  @Length(1, 10)
  name: string;

  @Column({ length: 100 })
  @Field(type => String)
  @Length(1, 100)
  address: string;

  @Column({ type: 'text', nullable: true })
  @Field(type => String, { nullable: true })
  parkingInfo?: string;

  @ManyToOne(relation => Studio, studio => studio.branches, {
    onDelete: 'CASCADE',
  })
  studio: Studio;
}
