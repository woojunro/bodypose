import { Field, Int, ObjectType } from '@nestjs/graphql';
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
export class UserClickStudioPhoto {
  @PrimaryGeneratedColumn()
  @Field(type => Int)
  id: number;

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
