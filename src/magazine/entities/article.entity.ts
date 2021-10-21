import { Field, Int, ObjectType, registerEnumType } from '@nestjs/graphql';
import { IsEnum, IsUrl, Length } from 'class-validator';
import { CoreEntity } from 'src/common/entities/core.entity';
import { Column, Entity, ManyToOne } from 'typeorm';
import { Editor } from './editor.entity';

// Only two characters
export enum ArticleCategory {
  TRAINING,
  NUTRITION,
  SHOOTING_TIP,
}

registerEnumType(ArticleCategory, { name: 'ArticleCategory' });

@Entity()
@ObjectType()
export class Article extends CoreEntity {
  @Column({ type: 'int' })
  @Field(type => ArticleCategory)
  @IsEnum(ArticleCategory)
  category: ArticleCategory;

  @Column({ length: 20 })
  @Field(type => String)
  @Length(1, 20)
  title: string;

  @Column({ length: 255 })
  @Field(type => String)
  @IsUrl()
  @Length(1, 255)
  thumbnailUrl: string;

  @Column({ type: 'mediumtext' })
  @Field(type => String)
  @Length(1)
  content: string;

  @Column({ type: 'int', default: 0 })
  @Field(type => Int)
  viewCount: number;

  @ManyToOne(relation => Editor)
  @Field(type => Editor)
  author: Editor;
}
