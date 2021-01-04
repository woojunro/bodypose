import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { UNEXPECTED_ERROR } from 'src/common/constants/error.constant';
import { Repository } from 'typeorm';
import {
  CreateStudioInput,
  CreateStudioOutput,
} from './dtos/create-studio.dto';
import { Studio } from './entities/studio.entity';

@Injectable()
export class StudiosService {
  constructor(
    @InjectRepository(Studio)
    private readonly studioRepository: Repository<Studio>,
  ) {}

  getStudioById(id: number): Promise<Studio> {
    return this.studioRepository.findOne({ id });
  }

  getStudioBySlug(slug: string): Promise<Studio> {
    return this.studioRepository.findOne({ slug });
  }

  async createStudio(input: CreateStudioInput): Promise<CreateStudioOutput> {
    try {
      // Check duplicate slug
      const studioBySlug = await this.getStudioBySlug(input.slug);
      if (studioBySlug) {
        return {
          ok: false,
          error: 'Studio with that slug already exists',
        };
      }
      // Create studio
      const newStudio = await this.studioRepository.save(
        this.studioRepository.create({ ...input }),
      );
      return {
        ok: true,
        studio: newStudio,
      };
    } catch (e) {
      console.log(e);
      return {
        ok: false,
        error: UNEXPECTED_ERROR,
      };
    }
  }
}
