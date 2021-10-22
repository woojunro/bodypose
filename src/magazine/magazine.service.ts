import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import {
  CommonError,
  UNEXPECTED_ERROR,
} from 'src/common/constants/error.constant';
import { CoreOutput } from 'src/common/dtos/output.dto';
import { Repository } from 'typeorm';
import {
  ARTICLE_CATEGORY_NOT_FOUND,
  EDITOR_NOT_FOUND,
  NO_ARTICLE_CATEGORIES,
} from './constants/error.constant';
import { AllArticleCategoriesOutput } from './dtos/all-article-categories.dto';
import { AllEditorsOutput } from './dtos/all-editors.dto';
import { CreateArticleCategoryInput } from './dtos/create-article-category.dto';
import { CreateArticleInput } from './dtos/create-article.dto';
import { CreateEditorInput } from './dtos/create-editor.dto';
import { DeleteArticleCategoryInput } from './dtos/delete-article-category.dto';
import { DeleteEditorInput } from './dtos/delete-editor.dto';
import { UpdateArticleCategoryInput } from './dtos/update-article-category.dto';
import { UpdateEditorInput } from './dtos/update-editor.dto';
import { ArticleCategory } from './entities/article-category.entity';
import { Article } from './entities/article.entity';
import { Editor } from './entities/editor.entity';

@Injectable()
export class MagazineService {
  constructor(
    @InjectRepository(ArticleCategory)
    private readonly articleCategoryRepository: Repository<ArticleCategory>,

    @InjectRepository(Editor)
    private readonly editorRepository: Repository<Editor>,

    @InjectRepository(Article)
    private readonly articleRepository: Repository<Article>,
  ) {}

  // ArticleCategory CRUD
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

  // Editor CRUD
  async createEditor({
    name,
    logoUrl,
  }: CreateEditorInput): Promise<CoreOutput> {
    try {
      const newEditor = this.editorRepository.create({
        name,
        logoUrl,
      });
      await this.editorRepository.save(newEditor);
      return { ok: true };
    } catch (e) {
      return UNEXPECTED_ERROR;
    }
  }

  async getAllEditors(): Promise<AllEditorsOutput> {
    try {
      const editors = await this.editorRepository.find();
      return { ok: true, editors };
    } catch (e) {
      return UNEXPECTED_ERROR;
    }
  }

  async updateEditor({
    id,
    ...payload
  }: UpdateEditorInput): Promise<CoreOutput> {
    try {
      const editor = await this.editorRepository.findOne(id);
      if (!editor) return CommonError(EDITOR_NOT_FOUND);
      await this.editorRepository.save({ ...editor, ...payload });
      return { ok: true };
    } catch (e) {
      return UNEXPECTED_ERROR;
    }
  }

  async deleteEditor({ id }: DeleteEditorInput): Promise<CoreOutput> {
    try {
      const editor = await this.editorRepository.findOne(id);
      if (!editor) return CommonError(EDITOR_NOT_FOUND);
      await this.editorRepository.delete(id);
      return { ok: true };
    } catch (e) {
      return UNEXPECTED_ERROR;
    }
  }

  // Article CRUD
  async createArticle({
    title,
    thumbnailUrl,
    content,
    authorId,
    categoryIds,
  }: CreateArticleInput): Promise<CoreOutput> {
    try {
      const newArticle = this.articleRepository.create({
        title,
        thumbnailUrl,
        content,
      });
      // Find author
      const author = await this.editorRepository.findOne(authorId);
      if (!author) return CommonError(EDITOR_NOT_FOUND);
      newArticle.author = author;
      // Find categories and attach them to newArticle
      const categories = await this.articleCategoryRepository.findByIds(
        categoryIds,
      );
      if (categories.length === 0) return CommonError(NO_ARTICLE_CATEGORIES);
      newArticle.categories = categories;
      // Save
      await this.articleRepository.save(newArticle);
      return { ok: true };
    } catch (e) {
      console.log(e);
      return UNEXPECTED_ERROR;
    }
  }
}
