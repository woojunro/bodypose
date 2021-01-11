import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { UNEXPECTED_ERROR } from 'src/common/constants/error.constant';
import { CoreOutput } from 'src/common/dtos/output.dto';
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
  StudioPhotoWithIsHearted,
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

  async getStudioPhotos(
    input: GetStudioPhotosInput,
    user: User,
  ): Promise<GetStudioPhotosOutput> {
    try {
      const {
        page,
        gender,
        backgroundConceptSlugs,
        costumeConceptSlugs,
        objectConceptSlugs,
      } = input;
      const photosPerPage = 24;

      const [photos, count] = await this.studioPhotoRepository.findAndCount({
        relations: [
          'studio',
          'backgroundConcepts',
          'costumeConcepts',
          'objectConcepts',
        ],
        join: {
          alias: 'photo',
          innerJoin: {
            backgroundConcepts: 'photo.backgroundConcepts',
            costumeConcepts: 'photo.costumeConcepts',
            objectConcepts: 'photo.objectConcepts',
          },
        },
        where: qb => {
          qb.where({
            gender: gender ? gender : Not(IsNull()),
          })
            .andWhere(
              backgroundConceptSlugs.length !== 0
                ? 'backgroundConcepts.slug IN (:bgSlugs)'
                : '1=1',
              { bgSlugs: backgroundConceptSlugs },
            )
            .andWhere(
              costumeConceptSlugs.length !== 0
                ? 'costumeConcepts.slug IN (:costumeSlugs)'
                : '1=1',
              { costumeSlugs: costumeConceptSlugs },
            )
            .andWhere(
              objectConceptSlugs.length !== 0
                ? 'objectConcepts.slug IN (:objectSlugs)'
                : '1=1',
              { objectSlugs: objectConceptSlugs },
            );
        },
        order: { id: 'DESC' },
        skip: (page - 1) * photosPerPage,
        take: photosPerPage,
      });
      // Attach isHearted
      let heartStudioPhotos: StudioPhoto[] = [];
      if (user) {
        const userById = await this.usersService.getUserById(user.id, {
          relations: ['heartStudioPhotos'],
        });
        if (userById) {
          heartStudioPhotos = userById.heartStudioPhotos;
        }
      }
      const photosWithIsHearted: StudioPhotoWithIsHearted[] = photos.map(
        photo => ({
          ...photo,
          isHearted: heartStudioPhotos.some(p => p.id === photo.id),
        }),
      );
      // return
      return {
        ok: true,
        photos: photosWithIsHearted,
        totalPages: Math.ceil(count / photosPerPage),
      };
    } catch (e) {
      console.log(e);
      return {
        ok: false,
        error: UNEXPECTED_ERROR,
      };
    }
  }

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
  ): Promise<CoreOutput> {
    try {
      let concept;
      const conceptNotFoundReturn: CoreOutput = {
        ok: false,
        error: `Concept with slug(${slug}) not found`,
      };

      switch (conceptType) {
        case PhotoConceptType.BACKGROUND:
          concept = await this.getBackgroundConceptBySlug(slug);
          if (!concept) {
            return conceptNotFoundReturn;
          }
          photo.backgroundConcepts.push(concept);
          break;
        case PhotoConceptType.COSTUME:
          concept = await this.getCostumeConceptBySlug(slug);
          if (!concept) {
            return conceptNotFoundReturn;
          }
          photo.costumeConcepts.push(concept);
          break;
        case PhotoConceptType.OBJECT:
          concept = await this.getObjectConceptBySlug(slug);
          if (!concept) {
            return conceptNotFoundReturn;
          }
          photo.objectConcepts.push(concept);
          break;
        default:
          return;
      }
      return { ok: true };
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
        const { ok, error } = await this.attachPhotoConcept(
          newPhoto,
          slug,
          PhotoConceptType.BACKGROUND,
        );
        if (!ok) {
          return { ok, error };
        }
      }
      for (const slug of costumeConceptSlugs) {
        const { ok, error } = await this.attachPhotoConcept(
          newPhoto,
          slug,
          PhotoConceptType.COSTUME,
        );
        if (!ok) {
          return { ok, error };
        }
      }
      for (const slug of objectConceptSlugs) {
        const { ok, error } = await this.attachPhotoConcept(
          newPhoto,
          slug,
          PhotoConceptType.OBJECT,
        );
        if (!ok) {
          return { ok, error };
        }
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
