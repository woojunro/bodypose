import { Field, ObjectType } from '@nestjs/graphql';
import { CoreOutput } from 'src/common/dtos/output.dto';
import { ArticleCategory } from '../entities/article-category.entity';

@ObjectType()
export class AllArticleCategoriesOutput extends CoreOutput {
  @Field(type => [ArticleCategory], { nullable: true })
  categories?: ArticleCategory[];
}
