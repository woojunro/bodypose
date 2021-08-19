import { Field, Int, ObjectType, registerEnumType } from '@nestjs/graphql';
import {
  IsBoolean,
  IsEnum,
  IsInt,
  IsOptional,
  Length,
  Min,
} from 'class-validator';
import { CoreEntity } from 'src/common/entities/core.entity';
import { Column, Entity, ManyToOne } from 'typeorm';
import { Studio } from './studio.entity';

export enum StudioProductType {
  STUDIO = 'STUDIO',
  OUTDOOR = 'OUTDOOR',
}

registerEnumType(StudioProductType, {
  name: 'StudioProductType',
});

@Entity()
@ObjectType()
export class StudioProduct extends CoreEntity {
  @Column({
    type: 'enum',
    enum: StudioProductType,
  })
  @Field(type => StudioProductType)
  @IsEnum(StudioProductType)
  type: StudioProductType;

  @Column({ length: 25 })
  @Field(type => String)
  @Length(1, 25)
  title: string;

  @Column()
  @Field(type => Int)
  @IsInt()
  @Min(1)
  peopleCount: number;

  @Column({ nullable: true })
  @Field(type => Int, { nullable: true })
  @IsOptional()
  @IsInt()
  @Min(1)
  maxPeopleCount?: number;

  @Column({ nullable: true })
  @Field(type => Int, { nullable: true })
  @IsOptional()
  @IsInt()
  @Min(0)
  conceptCount?: number;

  @Column({ nullable: true })
  @Field(type => Int, { nullable: true })
  @IsOptional()
  @IsInt()
  @Min(1)
  maxConceptCount?: number;

  @Column()
  @Field(type => Int)
  @IsInt()
  @Min(0)
  cutCount: number;

  @Column({ nullable: true })
  @Field(type => Int, { nullable: true })
  @IsOptional()
  @IsInt()
  @Min(1)
  minuteCount?: number;

  @Column({ nullable: true })
  @Field(type => String, { nullable: true })
  @IsOptional()
  @Length(1, 255)
  description?: string;

  @Column({ nullable: true })
  @Field(type => Int, { nullable: true })
  @IsOptional()
  @IsInt()
  @Min(-1)
  weekdayPrice?: number;

  @Column({ nullable: true })
  @Field(type => Int, { nullable: true })
  @IsOptional()
  @IsInt()
  @Min(-1)
  weekendPrice?: number;

  @Column()
  @Field(type => Boolean)
  @IsBoolean()
  isOriginalProvided: boolean;

  @ManyToOne(relation => Studio, studio => studio.studioProducts, {
    onDelete: 'CASCADE',
  })
  studio: Studio;
}
