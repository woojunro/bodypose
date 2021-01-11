import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { UNEXPECTED_ERROR } from 'src/common/constants/error.constant';
import { StudiosService } from 'src/studios/studios.service';
import { User } from 'src/users/entities/user.entity';
import { UsersService } from 'src/users/users.service';
import { FindOneOptions, In, IsNull, Not, Repository } from 'typeorm';
import {
  CreatePhotoConceptInput,
  CreatePhotoConceptOutput,
} from './dtos/create-photo-concept.dto';
import {
  CreateStudioPhotoInput,
  CreateStudioPhotoOutput,
} from './dtos/create-studio-photo.dto';
import {
  GetStudioPhotosInput,
  GetStudioPhotosOutput,
} from './dtos/get-studio-photo.dto';
import {
  BackgroundConcept,
  CostumeConcept,
  ObjectConcept,
  PhotoConceptType,
} from './entities/photo-concept.entity';
import { StudioPhoto } from './entities/studio-photo.entity';

@Injectable()
export class PhotosService {
  constructor(
    @InjectRepository(StudioPhoto)
    private readonly studioPhotoRepository: Repository<StudioPhoto>,
    @InjectRepository(BackgroundConcept)
    private readonly backgroundConceptRepository: Repository<BackgroundConcept>,
    @InjectRepository(CostumeConcept)
    private readonly costumeConceptRepository: Repository<CostumeConcept>,
    @InjectRepository(ObjectConcept)
    private readonly objectConceptRepository: Repository<ObjectConcept>,
    private readonly usersService: UsersService,
    private readonly studiosService: StudiosService,
  ) {}

  /*

  async getStudioPhotos(
    input: GetStudioPhotosInput,
    user: User,
  ): Promise<GetStudioPhotosOutput> {
    const {
      page,
      gender,
      backgroundConceptSlugs,
      costumeConceptSlugs,
      objectConceptSlugs,
    } = input;
    const photosPerPage = 24;

    const [result, count] = await this.studioPhotoRepository.findAndCount({
      relations: ['concepts'],
      join: {
        alias: 'studio_photo',
        innerJoin: { concepts: 'studio_photo.concepts' },
      },
      where: qb => {
        qb.where({
          gender: gender ? gender : Not(IsNull()),
        })
          .andWhere(
            backgroundConceptSlugs.length !== 0
              ? 'concepts.slug IN (:bgSlugs)'
              : '1=1',
            { bgSlugs: backgroundConceptSlugs },
          )
          .andWhere(
            costumeConceptSlugs.length !== 0
              ? 'concepts.slug IN (:costumeSlugs)'
              : '1=1',
            { costumeSlugs: costumeConceptSlugs },
          )
          .andWhere(
            objectConceptSlugs.length !== 0
              ? 'concepts.slug In (:objectSlugs)'
              : '1=1',
            { objectSlugs: objectConceptSlugs },
          );
      },
      order: { id: 'DESC' },
      skip: (page - 1) * photosPerPage,
      take: photosPerPage,
    });

    result.forEach(a => {
      console.log(a.id);
      console.log(a.gender);
      console.log(a.concepts);
    });
    console.log(count);

    return {
      ok: false,
      error: 'TODO',
    };
  }
  */

  getBackgroundConceptBySlug = (
    slug: string,
    options?: FindOneOptions<BackgroundConcept>,
  ): Promise<BackgroundConcept> => {
    return this.backgroundConceptRepository.findOne({ slug }, options);
  };

  getCostumeConceptBySlug = (
    slug: string,
    options?: FindOneOptions<BackgroundConcept>,
  ): Promise<CostumeConcept> => {
    return this.costumeConceptRepository.findOne({ slug }, options);
  };

  getObjectConceptBySlug = (
    slug: string,
    options?: FindOneOptions<BackgroundConcept>,
  ): Promise<ObjectConcept> => {
    return this.objectConceptRepository.findOne({ slug }, options);
  };

  async attachPhotoConcept(
    photo: StudioPhoto,
    slug: string,
    conceptType: PhotoConceptType,
  ): Promise<void> {
    try {
      let concept;
      switch (conceptType) {
        case PhotoConceptType.BACKGROUND:
          concept = await this.getBackgroundConceptBySlug(slug);
          if (concept) {
            photo.backgroundConcepts.push(concept);
          }
          break;
        case PhotoConceptType.COSTUME:
          concept = await this.getCostumeConceptBySlug(slug);
          if (concept) {
            photo.costumeConcepts.push(concept);
          }
          break;
        case PhotoConceptType.OBJECT:
          concept = await this.getCostumeConceptBySlug(slug);
          if (concept) {
            photo.objectConcepts.push(concept);
          }
          break;
        default:
          return;
      }
    } catch (e) {
      return;
    }
  }

  async createPhotoConcept({
    slug,
    conceptType,
  }: CreatePhotoConceptInput): Promise<CreatePhotoConceptOutput> {
    try {
      let concept;
      switch (conceptType) {
        case PhotoConceptType.BACKGROUND:
          concept = await this.getBackgroundConceptBySlug(slug);
          break;
        case PhotoConceptType.COSTUME:
          concept = await this.getCostumeConceptBySlug(slug);
          break;
        case PhotoConceptType.OBJECT:
          concept = await this.getObjectConceptBySlug(slug);
          break;
        default:
          throw new InternalServerErrorException();
      }
      if (concept) {
        return {
          ok: false,
          error: `Concept with that slug(${slug}) already exists.`,
        };
      }
      switch (conceptType) {
        case PhotoConceptType.BACKGROUND:
          concept = await this.backgroundConceptRepository.save(
            this.backgroundConceptRepository.create({ slug }),
          );
          break;
        case PhotoConceptType.COSTUME:
          concept = await this.costumeConceptRepository.save(
            this.costumeConceptRepository.create({ slug }),
          );
          break;
        case PhotoConceptType.OBJECT:
          concept = await this.objectConceptRepository.save(
            this.objectConceptRepository.create({ slug }),
          );
          break;
        default:
          throw new InternalServerErrorException();
      }
      return {
        ok: true,
        photoConcept: concept,
      };
    } catch (e) {
      console.log(e);
      return {
        ok: false,
        error: UNEXPECTED_ERROR,
      };
    }
  }

  async createStudioPhoto(
    input: CreateStudioPhotoInput,
  ): Promise<CreateStudioPhotoOutput> {
    try {
      const {
        studioSlug,
        gender,
        backgroundConceptSlugs,
        costumeConceptSlugs,
        objectConceptSlugs,
      } = input;
      // Get studio by slug
      const studioBySlug = await this.studiosService.getStudioBySlug(
        studioSlug,
      );
      if (!studioBySlug) {
        return {
          ok: false,
          error: `Studio with that slug(${studioSlug}) not found`,
        };
      }
      // Create a photo
      const newPhoto = this.studioPhotoRepository.create({
        studio: studioBySlug,
        gender,
        backgroundConcepts: [],
        costumeConcepts: [],
        objectConcepts: [],
      });
      // TODO: Upload the photo and get URL
      newPhoto.thumbnailUrl = `http://www.fmonth.com/${Date.now()}`;
      newPhoto.originalUrl = `http://www.fmonth.com/${Date.now()}`;
      // Attach Concepts
      for (const slug of backgroundConceptSlugs) {
        await this.attachPhotoConcept(
          newPhoto,
          slug,
          PhotoConceptType.BACKGROUND,
        );
      }
      for (const slug of costumeConceptSlugs) {
        await this.attachPhotoConcept(newPhoto, slug, PhotoConceptType.COSTUME);
      }
      for (const slug of objectConceptSlugs) {
        await this.attachPhotoConcept(newPhoto, slug, PhotoConceptType.OBJECT);
      }
      // Save
      const createdPhoto = await this.studioPhotoRepository.save(newPhoto);
      return {
        ok: true,
        studioPhoto: createdPhoto,
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
