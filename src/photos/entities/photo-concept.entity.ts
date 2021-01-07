import { Field, ObjectType, registerEnumType } from '@nestjs/graphql';
import { CoreEntity } from 'src/common/entities/core.entity';
import { Column, Entity, ManyToMany } from 'typeorm';
import { StudioPhoto } from './studio-photo.entity';

export enum ConceptType {
  BACKGROUND = 'BACKGROUND',
  COSTUME = 'COSTUME',
  OBJECT = 'OBJECT',
}

registerEnumType(ConceptType, {
  name: 'ConceptType',
});

@Entity()
@ObjectType()
export class PhotoConcept extends CoreEntity {
  @Column({
    type: 'enum',
    enum: ConceptType,
  })
  @Field(type => ConceptType)
  conceptType: ConceptType;

  @Column({ unique: true })
  @Field(type => String)
  slug: string;

  @ManyToMany(type => StudioPhoto)
  @Field(type => [StudioPhoto])
  photos: StudioPhoto[];
}
