import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { UNEXPECTED_ERROR } from 'src/common/constants/error.constant';
import { User } from 'src/users/entities/user.entity';
import { UsersService } from 'src/users/users.service';
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
import {
  ToggleHeartStudioInput,
  ToggleHeartStudioOutput,
} from './dtos/toggle-heart-studio.dto';
import { Catchphrase } from './entities/catchphrase.entity';
import { Studio } from './entities/studio.entity';

@Injectable()
export class StudiosService {
  constructor(
    @InjectRepository(Studio)
    private readonly studioRepository: Repository<Studio>,
    @InjectRepository(Catchphrase)
    private readonly catchphraseRepository: Repository<Catchphrase>,
    private readonly usersService: UsersService,
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
          isHearted: false,
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

  async toggleHeartStudio(
    { id }: User,
    { slug }: ToggleHeartStudioInput,
  ): Promise<ToggleHeartStudioOutput> {
    try {
      const studio = await this.getStudioBySlug(slug);
      if (!studio) {
        return {
          ok: false,
          error: 'Studio not found',
        };
      }
      const user = await this.usersService.getUserById(id, {
        relations: ['heartStudios'],
      });
      if (!user) {
        return {
          ok: false,
          error: 'User not found',
        };
      }
      // If the studio exists in heartStudios, filter it
      // Update heartCount
      let exists = false;
      for (let i = 0; i < user.heartStudios.length; i++) {
        if (user.heartStudios[i].slug === slug) {
          exists = true;
          user.heartStudios.splice(i, 1);
          studio.heartCount -= 1;
          break;
        }
      }
      // If not, push it
      if (!exists) {
        user.heartStudios.push(studio);
        studio.heartCount += 1;
      }
      // Save
      await this.usersService.updateUser(user);
      const updatedStudio = await this.studioRepository.save(studio);
      return {
        ok: true,
        heartCount: updatedStudio.heartCount,
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
