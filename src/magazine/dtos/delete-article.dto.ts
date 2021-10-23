import { InputType, PickType } from '@nestjs/graphql';
import { Article } from '../entities/article.entity';

@InputType()
export class DeleteArticleInput extends PickType(Article, ['id'], InputType) {}
