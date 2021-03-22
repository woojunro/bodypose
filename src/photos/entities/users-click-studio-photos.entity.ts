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
export class UsersClickStudioPhotos {
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

  @ManyToOne(type => StudioPhoto, { onDelete: 'CASCADE' })
  @Field(type => StudioPhoto)
  studioPhoto: StudioPhoto;
}
