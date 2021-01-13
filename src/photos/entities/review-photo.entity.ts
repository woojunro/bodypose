import { Field, ObjectType } from '@nestjs/graphql';
import { IsUrl } from 'class-validator';
import { CoreEntity } from 'src/common/entities/core.entity';
import { UsersReviewStudios } from 'src/studios/entities/users-review-studios.entity';
import { Column, Entity, ManyToOne } from 'typeorm';

@Entity()
@ObjectType()
export class ReviewPhoto extends CoreEntity {
  @Column()
  @Field(type => String)
  @IsUrl()
  thumbnailUrl: string;

  @Column()
  @Field(type => String)
  @IsUrl()
  originalUrl: string;

  @ManyToOne(relation => UsersReviewStudios, review => review.photos, {
    onDelete: 'CASCADE',
  })
  @Field(type => UsersReviewStudios)
  review: UsersReviewStudios;
}
