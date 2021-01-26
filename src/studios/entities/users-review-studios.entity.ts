import { Field, Int, ObjectType } from '@nestjs/graphql';
import {
  IsBoolean,
  IsInt,
  IsString,
  Max,
  Min,
  MinLength,
} from 'class-validator';
import { CoreEntity } from 'src/common/entities/core.entity';
import { ReviewPhoto } from 'src/photos/entities/review-photo.entity';
import { User } from 'src/users/entities/user.entity';
import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToMany,
  OneToOne,
} from 'typeorm';
import { Studio } from './studio.entity';

@Entity()
@ObjectType()
export class UsersReviewStudios extends CoreEntity {
  @Column()
  @Field(type => Int)
  @IsInt()
  @Min(1)
  @Max(5)
  rating: number;

  @Column({ type: 'text' })
  @Field(type => String)
  @IsString()
  @MinLength(12)
  text: string;

  @ManyToOne(relation => User, user => user.reviews, {
    onDelete: 'SET NULL',
  })
  @Field(type => User)
  user: User;

  @ManyToOne(relation => Studio, studio => studio.reviews, {
    onDelete: 'CASCADE',
  })
  @Field(type => Studio)
  studio: Studio;

  @Column()
  @Field(type => Boolean)
  @IsBoolean()
  isPhotoForProof: boolean;

  @OneToOne(relation => ReviewPhoto, { nullable: true, onDelete: 'SET NULL' })
  @JoinColumn()
  @Field(type => ReviewPhoto)
  thumbnailPhoto: ReviewPhoto;

  @OneToMany(relation => ReviewPhoto, photo => photo.review)
  @Field(type => [ReviewPhoto])
  photos: ReviewPhoto[];
}
