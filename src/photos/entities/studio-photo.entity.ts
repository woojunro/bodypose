import { Field, Int, ObjectType, registerEnumType } from '@nestjs/graphql';
import { IsEnum, IsInt, IsString, IsUrl } from 'class-validator';
import { CoreEntity } from 'src/common/entities/core.entity';
import { Studio } from 'src/studios/entities/studio.entity';
import {
  BeforeInsert,
  Column,
  Entity,
  JoinTable,
  ManyToMany,
  ManyToOne,
} from 'typeorm';
import {
  BackgroundConcept,
  CostumeConcept,
  ObjectConcept,
} from './photo-concept.entity';

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
  @Column()
  @Field(type => String)
  @IsUrl()
  thumbnailUrl: string;

  @Column()
  @Field(type => String)
  @IsUrl()
  originalUrl: string;

  @Column({ length: 8 })
  @IsString()
  substr: string;

  @ManyToOne(relation => Studio, { onDelete: 'CASCADE' })
  @Field(type => Studio)
  studio: Studio;

  @Column({
    type: 'enum',
    enum: PhotoGender,
  })
  @Field(type => PhotoGender)
  @IsEnum(PhotoGender)
  gender: PhotoGender;

  @Column({ default: 0 })
  @Field(type => Int)
  @IsInt()
  heartCount: number;

  @ManyToMany(relation => BackgroundConcept)
  @JoinTable({
    name: 'photos_background_concepts',
  })
  @Field(type => [BackgroundConcept])
  backgroundConcepts: BackgroundConcept[];

  @ManyToMany(relation => CostumeConcept)
  @JoinTable({
    name: 'photos_costume_concepts',
  })
  @Field(type => [CostumeConcept])
  costumeConcepts: CostumeConcept[];

  @ManyToMany(relation => ObjectConcept)
  @JoinTable({
    name: 'photos_object_concepts',
  })
  @Field(type => [ObjectConcept])
  objectConcepts: ObjectConcept[];

  @BeforeInsert()
  extractSubstrFromOriginalUrl(): void {
    this.substr = this.originalUrl.substr(-40, 8);
  }
}
