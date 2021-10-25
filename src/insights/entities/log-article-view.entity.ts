import { registerEnumType } from '@nestjs/graphql';
import { Article } from 'src/magazine/entities/article.entity';
import { User } from 'src/users/entities/user.entity';
import { Column, Entity, ManyToOne } from 'typeorm';
import { LogEntity } from './log.entity';

// 매거진 칼럼 조회 경로
// max length: 2
export enum ArticleViewSource {
  HOME = 'HO',
  ARTICLE_LIST = 'AR',
  ETC = 'ET',
}

registerEnumType(ArticleViewSource, { name: 'ArticleViewSource' });

@Entity()
export class LogArticleView extends LogEntity {
  @Column({ length: 2 })
  source: ArticleViewSource;

  @ManyToOne(relation => User, { nullable: true, onDelete: 'SET NULL' })
  user?: User;

  @ManyToOne(relation => Article, { onDelete: 'CASCADE' })
  article: Article;
}
