import { Field, Int, ObjectType } from '@nestjs/graphql';
import { User } from 'src/users/entities/user.entity';
import {
  CreateDateColumn,
  Entity,
  ManyToOne,
  PrimaryGeneratedColumn,
  RelationId,
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

  @RelationId((entity: UsersHeartStudioPhotos) => entity.user)
  @Field(type => Int)
  userId: number;

  @ManyToOne(relation => StudioPhoto, { onDelete: 'CASCADE' })
  studioPhoto: StudioPhoto;

  @RelationId((entity: UsersHeartStudioPhotos) => entity.studioPhoto)
  @Field(type => Int)
  studioPhotoId: number;
}
