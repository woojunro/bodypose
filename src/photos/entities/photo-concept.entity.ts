import { Field, ObjectType, registerEnumType } from '@nestjs/graphql';
import { IsString } from 'class-validator';
import { CoreEntity } from 'src/common/entities/core.entity';
import { Column, Entity, ManyToMany } from 'typeorm';
import { StudioPhoto } from './studio-photo.entity';

export enum PhotoConceptType {
  BACKGROUND = 'BACKGROUND',
  COSTUME = 'COSTUME',
  OBJECT = 'OBJECT',
}

registerEnumType(PhotoConceptType, {
  name: 'PhotoConceptType',
});

@Entity()
@ObjectType()
export class PhotoConcept extends CoreEntity {
  @Column()
  @Field(type => String)
  @IsString()
  name: string;

  @Column({ unique: true })
  @Field(type => String)
  @IsString()
  slug: string;
}

@Entity()
@ObjectType()
export class BackgroundConcept extends PhotoConcept {
  @ManyToMany(relation => StudioPhoto, photo => photo.backgroundConcepts)
  @Field(type => [StudioPhoto])
  studioPhotos: StudioPhoto[];
}

@Entity()
@ObjectType()
export class CostumeConcept extends PhotoConcept {
  @ManyToMany(relation => StudioPhoto, photo => photo.costumeConcepts)
  @Field(type => [StudioPhoto])
  studioPhotos: StudioPhoto[];
}

@Entity()
@ObjectType()
export class ObjectConcept extends PhotoConcept {
  @ManyToMany(relation => StudioPhoto, photo => photo.objectConcepts)
  @Field(type => [StudioPhoto])
  studioPhotos: StudioPhoto[];
}
