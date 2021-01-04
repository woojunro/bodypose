import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { UNEXPECTED_ERROR } from 'src/common/constants/error.constant';
import { Repository } from 'typeorm';
import {
  CreateStudioInput,
  CreateStudioOutput,
} from './dtos/create-studio.dto';
import {
  ReadAllStudiosOutput,
  ReadStudioInput,
  ReadStudioOutput,
} from './dtos/read-studio.dto';
import { Catchphrase } from './entities/catchphrase.entity';
import { Studio } from './entities/studio.entity';

@Injectable()
export class StudiosService {
  constructor(
    @InjectRepository(Studio)
    private readonly studioRepository: Repository<Studio>,
    @InjectRepository(Catchphrase)
    private readonly catchphraseRepository: Repository<Catchphrase>,
  ) {}

  getStudioById(id: number): Promise<Studio> {
    return this.studioRepository.findOne(
      { id },
      { relations: ['catchphrases'] },
    );
  }

  getStudioBySlug(slug: string): Promise<Studio> {
    return this.studioRepository.findOne(
      { slug },
      { relations: ['catchphrases'] },
    );
  }

  async createStudio({
    catchphrases,
    ...input
  }: CreateStudioInput): Promise<CreateStudioOutput> {
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
      const newStudio = this.studioRepository.create({ ...input });
      // Add catchphrases
      if (catchphrases) {
        const catchphraseArray: Catchphrase[] = [];
        for (let i = 0; i < catchphrases.length || i < 2; i++) {
          const newCatchphrase = this.catchphraseRepository.create();
          newCatchphrase.phrase = catchphrases[i];
          await this.catchphraseRepository.save(newCatchphrase);
          catchphraseArray.push(newCatchphrase);
        }
        newStudio.catchphrases = catchphraseArray;
      }
      // Save
      const savedStudio = await this.studioRepository.save(newStudio);
      return {
        ok: true,
        studio: savedStudio,
      };
    } catch (e) {
      console.log(e);
      return {
        ok: false,
        error: UNEXPECTED_ERROR,
      };
    }
  }

  async readStudio({ slug }: ReadStudioInput): Promise<ReadStudioOutput> {
    try {
      const studio = await this.getStudioBySlug(slug);
      if (!studio) {
        return {
          ok: false,
          error: 'Studio not found',
        };
      }
      return {
        ok: true,
        studio,
      };
    } catch (e) {
      console.log(e);
      return {
        ok: false,
        error: UNEXPECTED_ERROR,
      };
    }
  }

  async readAllStudios(): Promise<ReadAllStudiosOutput> {
    try {
      const studios = await this.studioRepository.find({
        relations: ['catchphrases'],
      });
      if (!studios) {
        throw new InternalServerErrorException();
      }
      return {
        ok: true,
        studios: studios.map(studio => ({
          name: studio.name,
          slug: studio.slug,
          catchphrases: studio.catchphrases,
          address: studio.address,
        })),
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
