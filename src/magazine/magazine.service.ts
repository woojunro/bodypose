import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { UNEXPECTED_ERROR } from 'src/common/constants/error.constant';
import { CoreOutput } from 'src/common/dtos/output.dto';
import { Repository } from 'typeorm';
import { CreateArticleCategoryInput } from './dtos/create-article-category.dto';
import { ArticleCategory } from './entities/article-category.entity';

@Injectable()
export class MagazineService {
  constructor(
    @InjectRepository(ArticleCategory)
    private readonly articleCategoryRepository: Repository<ArticleCategory>,
  ) {}

  async createArticleCategory({
    name,
    order,
  }: CreateArticleCategoryInput): Promise<CoreOutput> {
    try {
      const newCategory = this.articleCategoryRepository.create({
        name,
        order,
      });
      await this.articleCategoryRepository.save(newCategory);
      return { ok: true };
    } catch (e) {
      console.log(e);
      return UNEXPECTED_ERROR;
    }
  }
}
