import { Field, Int, ObjectType } from '@nestjs/graphql';
import { Length, Min } from 'class-validator';
import { CoreEntity } from 'src/common/entities/core.entity';
import { Column, Entity } from 'typeorm';

@Entity()
@ObjectType()
export class ArticleCategory extends CoreEntity {
  @Column({ length: 10 })
  @Field(type => String)
  @Length(1, 10)
  name: string;

  @Column({ type: 'int' })
  @Field(type => Int)
  @Min(0)
  order: number;
}
