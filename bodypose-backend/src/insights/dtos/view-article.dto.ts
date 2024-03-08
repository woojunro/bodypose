import { Field, InputType, Int } from '@nestjs/graphql';
import { IsEnum, Min } from 'class-validator';
import { ArticleViewSource } from '../entities/log-article-view.entity';

@InputType()
export class ViewArticleInput {
  @Field(type => Int)
  @Min(1)
  articleId: number;

  @Field(type => ArticleViewSource)
  @IsEnum(ArticleViewSource)
  source: ArticleViewSource;
}
