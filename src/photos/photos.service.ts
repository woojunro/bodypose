import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { UNEXPECTED_ERROR } from 'src/common/constants/error.constant';
import { CoreOutput } from 'src/common/dtos/output.dto';
import { StudiosService } from 'src/studios/studios.service';
import { User } from 'src/users/entities/user.entity';
import { UsersService } from 'src/users/users.service';
import { FindOneOptions, IsNull, Not, Repository } from 'typeorm';
import {
  CreatePhotoConceptInput,
  CreatePhotoConceptOutput,
} from './dtos/create-photo-concept.dto';
import {
  CreateStudioPhotoInput,
  CreateStudioPhotoOutput,
} from './dtos/create-studio-photo.dto';
import {
  DeletePhotoConceptInput,
  DeletePhotoConceptOutput,
} from './dtos/delete-photo-concept.dto';
import {
  GetStudioPhotosInput,
  GetStudioPhotosOutput,
  StudioPhotoWithIsHearted,
} from './dtos/get-studio-photo.dto';
import {
  UpdatePhotoConceptInput,
  UpdatePhotoConceptOutput,
} from './dtos/update-photo-concept.dto';
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

  getPhotoConceptBySlug(
    slug: string,
    conceptType: PhotoConceptType,
    findOptions?: FindOneOptions<
      BackgroundConcept | CostumeConcept | ObjectConcept
    >,
  ): Promise<BackgroundConcept | CostumeConcept | ObjectConcept> {
    switch (conceptType) {
      case PhotoConceptType.BACKGROUND:
        return this.getBackgroundConceptBySlug(slug, findOptions);
      case PhotoConceptType.COSTUME:
        return this.getCostumeConceptBySlug(slug, findOptions);
      case PhotoConceptType.OBJECT:
        return this.getObjectConceptBySlug(slug, findOptions);
      default:
        return null;
    }
  }

  createAndSavePhotoConcept(slug: string, conceptType: PhotoConceptType) {
    switch (conceptType) {
      case PhotoConceptType.BACKGROUND:
        return this.backgroundConceptRepository.save(
          this.backgroundConceptRepository.create({ slug }),
        );
      case PhotoConceptType.COSTUME:
        return this.costumeConceptRepository.save(
          this.costumeConceptRepository.create({ slug }),
        );
      case PhotoConceptType.OBJECT:
        return this.objectConceptRepository.save(
          this.objectConceptRepository.create({ slug }),
        );
      default:
        throw new InternalServerErrorException();
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
      const concept = await this.getPhotoConceptBySlug(slug, conceptType);
      if (concept) {
        return {
          ok: false,
          error: `Concept with that slug(${slug}) already exists.`,
        };
      }
      const photoConcept = await this.createAndSavePhotoConcept(
        slug,
        conceptType,
      );
      return {
        ok: true,
        photoConcept,
      };
    } catch (e) {
      console.log(e);
      return {
        ok: false,
        error: UNEXPECTED_ERROR,
      };
    }
  }

  async updatePhotoConcept({
    slug,
    conceptType,
    payload: { slug: updatedSlug },
  }: UpdatePhotoConceptInput): Promise<UpdatePhotoConceptOutput> {
    try {
      const concept = await this.getPhotoConceptBySlug(slug, conceptType);
      if (!concept) {
        return {
          ok: false,
          error: `Concept with slug(${slug}) not found`,
        };
      }
      concept.slug = updatedSlug;
      let updatedConcept;
      switch (conceptType) {
        case PhotoConceptType.BACKGROUND:
          updatedConcept = await this.backgroundConceptRepository.save(concept);
          break;
        case PhotoConceptType.COSTUME:
          updatedConcept = await this.costumeConceptRepository.save(concept);
          break;
        case PhotoConceptType.OBJECT:
          updatedConcept = await this.objectConceptRepository.save(concept);
          break;
        default:
          throw new InternalServerErrorException();
      }
      return {
        ok: true,
        photoConcept: updatedConcept,
      };
    } catch (e) {
      console.log(e);
      return {
        ok: false,
        error: UNEXPECTED_ERROR,
      };
    }
  }

  async deletePhotoConcept({
    slug,
    conceptType,
  }: DeletePhotoConceptInput): Promise<DeletePhotoConceptOutput> {
    try {
      const concept = await this.getPhotoConceptBySlug(slug, conceptType);
      if (!concept) {
        return {
          ok: false,
          error: `Concept with slug(${slug}) not found`,
        };
      }
      switch (conceptType) {
        case PhotoConceptType.BACKGROUND:
          await this.backgroundConceptRepository.delete({ id: concept.id });
          break;
        case PhotoConceptType.COSTUME:
          await this.costumeConceptRepository.delete({ id: concept.id });
          break;
        case PhotoConceptType.OBJECT:
          await this.objectConceptRepository.delete({ id: concept.id });
          break;
        default:
          throw new InternalServerErrorException();
      }
      return { ok: true };
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
