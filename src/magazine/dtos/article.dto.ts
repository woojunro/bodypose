import { Field, InputType, ObjectType, PickType } from '@nestjs/graphql';
import { CoreOutput } from 'src/common/dtos/output.dto';
import { Article } from '../entities/article.entity';

@InputType()
export class ArticleInput extends PickType(Article, ['id'], InputType) {}

@ObjectType()
export class ArticleOutput extends CoreOutput {
  @Field(type => Article, { nullable: true })
  article?: Article;
}
