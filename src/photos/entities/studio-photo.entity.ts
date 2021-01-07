import { Field, Int, ObjectType, registerEnumType } from '@nestjs/graphql';
import { IsUrl } from 'class-validator';
import { CoreEntity } from 'src/common/entities/core.entity';
import { Studio } from 'src/studios/entities/studio.entity';
import { User } from 'src/users/entities/user.entity';
import {
  Column,
  Entity,
  JoinTable,
  ManyToMany,
  ManyToOne,
  RelationId,
} from 'typeorm';
import { PhotoConcept } from './photo-concept.entity';

export enum PhotoGender {
  MALE = 'MALE',
  FEMALE = 'FEMALE',
  COUPLE = 'COUPLE',
}

registerEnumType(PhotoGender, {
  name: 'PhotoGender',
});

@Entity()
@ObjectType()
export class StudioPhoto extends CoreEntity {
  @Column({ unique: true })
  @Field(type => String)
  @IsUrl()
  url: string;

  @ManyToOne(type => Studio, studio => studio.photos, { onDelete: 'CASCADE' })
  @Field(type => Studio)
  studio: Studio;

  @RelationId((photo: StudioPhoto) => photo.studio)
  @Field(type => Int)
  studioId: number;

  @Column({
    type: 'enum',
    enum: PhotoGender,
  })
  @Field(type => PhotoGender)
  gender: PhotoGender;

  @Column({ default: 0 })
  @Field(type => Int)
  clickCount: number;

  @Column({ default: 0 })
  @Field(type => Int)
  heartCount: number;

  @ManyToMany(type => User)
  @Field(type => [User])
  heartUsers: User[];

  @ManyToMany(type => PhotoConcept)
  @JoinTable()
  @Field(type => [PhotoConcept])
  concepts: PhotoConcept[];
}
