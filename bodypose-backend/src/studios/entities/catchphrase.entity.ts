import { Field, ObjectType } from '@nestjs/graphql';
import { IsString } from 'class-validator';
import { CoreEntity } from 'src/common/entities/core.entity';
import { Column, Entity, ManyToOne } from 'typeorm';
import { Studio } from './studio.entity';

@Entity()
@ObjectType()
export class Catchphrase extends CoreEntity {
  @Column()
  @Field(type => String)
  @IsString()
  phrase: string;

  @ManyToOne(type => Studio, studio => studio.catchphrases, {
    onDelete: 'CASCADE',
  })
  @Field(type => Studio)
  studio: Studio;
}
