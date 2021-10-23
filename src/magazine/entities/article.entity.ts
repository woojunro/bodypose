import { Field, Int, ObjectType } from '@nestjs/graphql';
import { IsUrl, Length } from 'class-validator';
import { CoreEntity } from 'src/common/entities/core.entity';
import { Column, Entity, JoinTable, ManyToMany, ManyToOne } from 'typeorm';
import { ArticleCategory } from './article-category.entity';
import { Editor } from './editor.entity';
// import * as sanitizeHtml from 'sanitize-html';

@Entity()
@ObjectType()
export class Article extends CoreEntity {
  @Column({ length: 20 })
  @Field(type => String)
  @Length(1, 20)
  title: string;

  @ManyToMany(relation => ArticleCategory)
  @JoinTable()
  @Field(type => [ArticleCategory])
  categories: ArticleCategory[];

  @Column({ length: 255 })
  @Field(type => String)
  @IsUrl()
  @Length(1, 255)
  thumbnailUrl: string;

  // will select content only if a single article is requested
  @Column({ type: 'mediumtext', select: false })
  @Field(type => String)
  @Length(1)
  content: string;

  @Column({ type: 'int', default: 0 })
  @Field(type => Int)
  viewCount: number;

  @ManyToOne(relation => Editor, { onDelete: 'RESTRICT' })
  @Field(type => Editor)
  author: Editor;

  // 에디터가 직접 입력할 경우 sanitize 추가
  // @BeforeInsert()
  // @BeforeUpdate()
  // sanitizeContent(): void {
  //   if (this.content) {
  //     this.content = sanitizeHtml(this.content, {
  //       allowedTags: sanitizeHtml.defaults.allowedTags.concat([
  //         'img',
  //         'oembed',
  //       ]),
  //       allowedAttributes: {
  //         '*': ['class', 'style'],
  //         a: ['href', 'target', 'rel'],
  //         oembed: ['url'],
  //         img: ['src'],
  //       },
  //     });
  //   }
  // }
}
