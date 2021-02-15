import { Field, ObjectType } from '@nestjs/graphql';
import { User } from 'src/users/entities/user.entity';
import {
  CreateDateColumn,
  Entity,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { StudioPhoto } from './studio-photo.entity';

@Entity()
@ObjectType()
export class UsersHeartStudioPhotos {
  @PrimaryGeneratedColumn({ type: 'bigint' })
  @Field(type => BigInt)
  id: bigint;

  @CreateDateColumn()
  @Field(type => Date)
  heartAt: Date;

  @ManyToOne(relation => User, { onDelete: 'SET NULL' })
  user: User;

  @ManyToOne(relation => StudioPhoto, { onDelete: 'CASCADE' })
  studioPhoto: StudioPhoto;
}
