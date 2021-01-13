import { Field, Int, ObjectType } from '@nestjs/graphql';
import { IsInt, IsString, Max, Min, MinLength } from 'class-validator';
import { CoreEntity } from 'src/common/entities/core.entity';
import { ReviewPhoto } from 'src/photos/entities/review-photo.entity';
import { User } from 'src/users/entities/user.entity';
import { Column, Entity, ManyToOne, OneToMany } from 'typeorm';
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
  @MinLength(10)
  text: string;

  @Column({ default: 0 })
  @Field(type => Int)
  likeCount: number;

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

  @OneToMany(relation => ReviewPhoto, photo => photo.review)
  @Field(type => [ReviewPhoto])
  photos: ReviewPhoto[];
}
