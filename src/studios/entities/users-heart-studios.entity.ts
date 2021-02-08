import { Field, Int, ObjectType } from '@nestjs/graphql';
import { User } from 'src/users/entities/user.entity';
import {
  CreateDateColumn,
  Entity,
  ManyToOne,
  PrimaryGeneratedColumn,
  RelationId,
} from 'typeorm';
import { Studio } from './studio.entity';

@Entity()
@ObjectType()
export class UsersHeartStudios {
  @PrimaryGeneratedColumn()
  @Field(type => Int)
  id: number;

  @CreateDateColumn()
  @Field(type => Date)
  heartAt: Date;

  @ManyToOne(relation => User, { onDelete: 'SET NULL' })
  heartingUser: User;

  @RelationId((entity: UsersHeartStudios) => entity.heartingUser)
  @Field(type => Int)
  userId: number;

  @ManyToOne(relation => Studio, { onDelete: 'CASCADE' })
  heartedStudio: Studio;

  @RelationId((entity: UsersHeartStudios) => entity.heartedStudio)
  @Field(type => Int)
  studioId: number;
}
