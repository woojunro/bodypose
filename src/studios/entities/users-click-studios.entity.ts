import { Field, ObjectType } from '@nestjs/graphql';
import { User } from 'src/users/entities/user.entity';
import {
  CreateDateColumn,
  Entity,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { Studio } from './studio.entity';

@Entity()
@ObjectType()
export class UsersClickStudios {
  @PrimaryGeneratedColumn({ type: 'bigint' })
  @Field(type => BigInt)
  id: bigint;

  @CreateDateColumn()
  @Field(type => Date)
  clickedAt: Date;

  @ManyToOne(type => User, {
    nullable: true,
    onDelete: 'SET NULL',
  })
  @Field(type => User, { nullable: true })
  user?: User;

  @ManyToOne(type => Studio, { onDelete: 'CASCADE' })
  @Field(type => Studio)
  studio: Studio;
}