import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import {
  CommonError,
  UNEXPECTED_ERROR,
} from 'src/common/constants/error.constant';
import { CoreOutput } from 'src/common/dtos/output.dto';
import { Repository } from 'typeorm';
import { ARTICLE_CATEGORY_NOT_FOUND } from './constants/error.constant';
import { AllArticleCategoriesOutput } from './dtos/all-article-categories.dto';
import { CreateArticleCategoryInput } from './dtos/create-article-category.dto';
import { DeleteArticleCategoryInput } from './dtos/delete-article-category.dto';
import { UpdateArticleCategoryInput } from './dtos/update-article-category.dto';
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
      return UNEXPECTED_ERROR;
    }
  }

  async getAllArticleCategories(): Promise<AllArticleCategoriesOutput> {
    try {
      const categories = await this.articleCategoryRepository.find();
      return { ok: true, categories };
    } catch (e) {
      return UNEXPECTED_ERROR;
    }
  }

  async updateArticleCategory({
    id,
    ...payload
  }: UpdateArticleCategoryInput): Promise<CoreOutput> {
    try {
      const category = await this.articleCategoryRepository.findOne(id);
      if (!category) return CommonError(ARTICLE_CATEGORY_NOT_FOUND);
      await this.articleCategoryRepository.save({ ...category, ...payload });
      return { ok: true };
    } catch (e) {
      return UNEXPECTED_ERROR;
    }
  }

  async deleteArticleCategory({
    id,
  }: DeleteArticleCategoryInput): Promise<CoreOutput> {
    try {
      const category = await this.articleCategoryRepository.findOne(id);
      if (!category) return CommonError(ARTICLE_CATEGORY_NOT_FOUND);
      await this.articleCategoryRepository.delete(id);
      return { ok: true };
    } catch (e) {
      return UNEXPECTED_ERROR;
    }
  }
}
