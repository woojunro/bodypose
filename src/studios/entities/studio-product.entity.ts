import { Field, Int, ObjectType, registerEnumType } from '@nestjs/graphql';
import { IsEnum, IsInt, IsOptional, IsString, Min } from 'class-validator';
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

  @Column()
  @Field(type => String)
  @IsString()
  title: string;

  @Column()
  @Field(type => Int)
  @IsInt()
  @Min(1)
  peopleCount: number;

  @Column()
  @Field(type => Int)
  @IsInt()
  @Min(1)
  conceptCount: number;

  @Column()
  @Field(type => Int)
  @IsInt()
  @Min(1)
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
  @IsString()
  description?: string;

  @Column()
  @Field(type => Int)
  @IsInt()
  @Min(0)
  weekdayPrice: number;

  @Column()
  @Field(type => Int)
  @IsInt()
  @Min(0)
  weekendPrice: number;

  @ManyToOne(relation => Studio, studio => studio.products, {
    onDelete: 'CASCADE',
  })
  @Field(type => Studio)
  studio: Studio;
}
