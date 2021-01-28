import {
  forwardRef,
  Inject,
  Injectable,
  InternalServerErrorException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { UNEXPECTED_ERROR } from 'src/common/constants/error.constant';
import { CoreOutput } from 'src/common/dtos/output.dto';
import { StudiosService } from 'src/studios/studios.service';
import { GetMyHeartStudioPhotosOutput } from 'src/users/dtos/get-user.dto';
import { User } from 'src/users/entities/user.entity';
import { UsersService } from 'src/users/users.service';
import { FindOneOptions, IsNull, Not, Repository } from 'typeorm';
import {
  ClickStudioPhotoInput,
  ClickStudioPhotoOutput,
} from './dtos/click-studio-photo.dto';
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
  DeleteStudioPhotoInput,
  DeleteStudioPhotoOutput,
} from './dtos/delete-studio-photo.dto';
import { GetAllPhotoConceptsOutput } from './dtos/get-photo-concept.dto';
import {
  GetAllStudioPhotosInput,
  GetAllStudioPhotosOutput,
  GetStudioPhotosInput,
  GetStudioPhotosOutput,
} from './dtos/get-studio-photo.dto';
import {
  ToggleHeartStudioPhotoInput,
  ToggleHeartStudioPhotoOutput,
} from './dtos/toggle-heart-studio-photo.dto';
import {
  UpdatePhotoConceptInput,
  UpdatePhotoConceptOutput,
} from './dtos/update-photo-concept.dto';
import {
  UpdateStudioPhotoInput,
  UpdateStudioPhotoOutput,
} from './dtos/update-studio-photo.dto';
import {
  BackgroundConcept,
  CostumeConcept,
  ObjectConcept,
  PhotoConceptType,
} from './entities/photo-concept.entity';
import { ReviewPhoto } from './entities/review-photo.entity';
import { StudioPhoto } from './entities/studio-photo.entity';
import { UsersClickStudioPhotos } from './entities/users-click-studio-photos.entity';

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
    @InjectRepository(UsersClickStudioPhotos)
    private readonly usersClickStudioPhotosRepository: Repository<UsersClickStudioPhotos>,
    @InjectRepository(ReviewPhoto)
    private readonly reviewPhotoRepository: Repository<ReviewPhoto>,
    @Inject(forwardRef(() => UsersService))
    private readonly usersService: UsersService,
    @Inject(forwardRef(() => StudiosService))
    private readonly studiosService: StudiosService,
  ) {}

  async getAllStudioPhotos(
    input: GetAllStudioPhotosInput,
  ): Promise<GetAllStudioPhotosOutput> {
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
        join: {
          alias: 'photo',
          innerJoinAndSelect: {
            backgroundConcepts: 'photo.backgroundConcepts',
            costumeConcepts: 'photo.costumeConcepts',
            objectConcepts: 'photo.objectConcepts',
            studio: 'photo.studio',
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
      // return
      return {
        ok: true,
        photos,
        totalPages: Math.ceil(count / photosPerPage),
      };
    } catch (e) {
      console.log(e);
      return UNEXPECTED_ERROR;
    }
  }

  async getStudioPhotos({
    studioSlug,
    gender,
    page,
  }: GetStudioPhotosInput): Promise<GetStudioPhotosOutput> {
    try {
      const photosPerPage = 24;
      const [photos, count] = await this.studioPhotoRepository
        .createQueryBuilder('photo')
        .leftJoinAndSelect('photo.studio', 'studio')
        .leftJoinAndSelect('photo.backgroundConcepts', 'backgroundConcept')
        .leftJoinAndSelect('photo.costumeConcepts', 'costumeConcept')
        .leftJoinAndSelect('photo.objectConcepts', 'objectConcept')
        .where({ gender: gender ? gender : Not(IsNull()) })
        .andWhere('studio.slug = :slug', { slug: studioSlug })
        .orderBy('photo.id', 'DESC')
        .take(photosPerPage)
        .skip((page - 1) * photosPerPage)
        .getManyAndCount();
      return {
        ok: true,
        photos,
        totalPages: Math.ceil(count / photosPerPage),
      };
    } catch (e) {
      console.log(e);
      return UNEXPECTED_ERROR;
    }
  }

  async getHeartStudioPhotosByUserId(
    id: number,
    page: number,
  ): Promise<GetMyHeartStudioPhotosOutput> {
    try {
      const photosPerPage = 24;
      const [studioPhotos, count] = await this.studioPhotoRepository
        .createQueryBuilder('studio_photo')
        .leftJoin('studio_photo.heartUsers', 'heartUser')
        .leftJoinAndSelect(
          'studio_photo.backgroundConcepts',
          'backgroundConcept',
        )
        .leftJoinAndSelect('studio_photo.costumeConcepts', 'costumeConcept')
        .leftJoinAndSelect('studio_photo.objectConcepts', 'objectConcept')
        .leftJoinAndSelect('studio_photo.studio', 'studio')
        .where('heartUser.id = :id', { id })
        .orderBy('photo.id', 'DESC')
        .skip((page - 1) * photosPerPage)
        .take(photosPerPage)
        .getManyAndCount();
      return {
        ok: true,
        totalPages: Math.ceil(count / photosPerPage),
        studioPhotos,
      };
    } catch (e) {
      console.log(e);
      return UNEXPECTED_ERROR;
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

  createAndSavePhotoConcept(
    name: string,
    slug: string,
    conceptType: PhotoConceptType,
  ) {
    switch (conceptType) {
      case PhotoConceptType.BACKGROUND:
        return this.backgroundConceptRepository.save(
          this.backgroundConceptRepository.create({ name, slug }),
        );
      case PhotoConceptType.COSTUME:
        return this.costumeConceptRepository.save(
          this.costumeConceptRepository.create({ name, slug }),
        );
      case PhotoConceptType.OBJECT:
        return this.objectConceptRepository.save(
          this.objectConceptRepository.create({ name, slug }),
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
          return UNEXPECTED_ERROR;
      }
      return { ok: true };
    } catch (e) {
      return UNEXPECTED_ERROR;
    }
  }

  async getAllPhotoConcepts(): Promise<GetAllPhotoConceptsOutput> {
    try {
      const backgroundConcepts = await this.backgroundConceptRepository.find();
      const costumeConcepts = await this.costumeConceptRepository.find();
      const objectConcepts = await this.objectConceptRepository.find();
      return {
        ok: true,
        backgroundConcepts,
        costumeConcepts,
        objectConcepts,
      };
    } catch (e) {
      console.log(e);
      return UNEXPECTED_ERROR;
    }
  }

  async createPhotoConcept({
    name,
    slug,
    conceptType,
  }: CreatePhotoConceptInput): Promise<CreatePhotoConceptOutput> {
    try {
      const concept = await this.getPhotoConceptBySlug(slug, conceptType);
      if (concept) {
        return {
          ok: false,
          error: `DUPLICATE_${conceptType.toString()}_CONCEPT`,
        };
      }
      const { id } = await this.createAndSavePhotoConcept(
        name,
        slug,
        conceptType,
      );
      return {
        ok: true,
        id,
      };
    } catch (e) {
      console.log(e);
      return UNEXPECTED_ERROR;
    }
  }

  async updatePhotoConcept({
    slug,
    conceptType,
    payload: { name },
  }: UpdatePhotoConceptInput): Promise<UpdatePhotoConceptOutput> {
    try {
      const concept = await this.getPhotoConceptBySlug(slug, conceptType);
      if (!concept) {
        return {
          ok: false,
          error: 'CONCEPT_NOT_FOUND',
        };
      }
      concept.name = name;
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
      return UNEXPECTED_ERROR;
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
          error: 'CONCEPT_NOT_FOUND',
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
      return UNEXPECTED_ERROR;
    }
  }

  async createStudioPhoto(
    input: CreateStudioPhotoInput,
  ): Promise<CreateStudioPhotoOutput> {
    try {
      const {
        studioSlug,
        gender,
        thumbnailUrl,
        originalUrl,
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
          error: 'STUDIO_NOT_FOUND',
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
      newPhoto.thumbnailUrl = thumbnailUrl;
      newPhoto.originalUrl = originalUrl;
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
      return UNEXPECTED_ERROR;
    }
  }

  async updateStudioPhoto({
    id,
    payload: {
      gender,
      backgroundConceptSlugs,
      costumeConceptSlugs,
      objectConceptSlugs,
    },
  }: UpdateStudioPhotoInput): Promise<UpdateStudioPhotoOutput> {
    try {
      const photo = await this.studioPhotoRepository.findOne(
        { id },
        {
          relations: [
            'backgroundConcepts',
            'costumeConcepts',
            'objectConcepts',
          ],
        },
      );
      if (!photo) {
        return {
          ok: false,
          error: 'STUDIO_PHOTO_NOT_FOUND',
        };
      }
      if (gender) {
        photo.gender = gender;
      }
      if (backgroundConceptSlugs) {
        photo.backgroundConcepts = [];
        for (const slug of backgroundConceptSlugs) {
          const { ok, error } = await this.attachPhotoConcept(
            photo,
            slug,
            PhotoConceptType.BACKGROUND,
          );
          if (!ok) {
            return { ok, error };
          }
        }
      }
      if (costumeConceptSlugs) {
        photo.costumeConcepts = [];
        for (const slug of costumeConceptSlugs) {
          const { ok, error } = await this.attachPhotoConcept(
            photo,
            slug,
            PhotoConceptType.COSTUME,
          );
          if (!ok) {
            return { ok, error };
          }
        }
      }
      if (objectConceptSlugs) {
        photo.objectConcepts = [];
        for (const slug of objectConceptSlugs) {
          const { ok, error } = await this.attachPhotoConcept(
            photo,
            slug,
            PhotoConceptType.OBJECT,
          );
          if (!ok) {
            return { ok, error };
          }
        }
      }
      const studioPhoto = await this.studioPhotoRepository.save(photo);
      return {
        ok: true,
        studioPhoto,
      };
    } catch (e) {
      console.log(e);
      return UNEXPECTED_ERROR;
    }
  }

  async deleteStudioPhoto({
    id,
    studioSlug,
  }: DeleteStudioPhotoInput): Promise<DeleteStudioPhotoOutput> {
    try {
      const photo = await this.studioPhotoRepository.findOne(
        { id },
        { relations: ['studio'] },
      );
      if (!photo) {
        return {
          ok: false,
          error: 'PHOTO_NOT_FOUND',
        };
      }
      if (photo.studio.slug !== studioSlug) {
        return {
          ok: false,
          error: 'INVALID_STUDIO_SLUG',
        };
      }
      await this.studioPhotoRepository.delete({ id });
      return { ok: true };
    } catch (e) {
      console.log(e);
      return UNEXPECTED_ERROR;
    }
  }

  async toggleHeartStudioPhoto(
    user: User,
    { id }: ToggleHeartStudioPhotoInput,
  ): Promise<ToggleHeartStudioPhotoOutput> {
    try {
      const photo = await this.studioPhotoRepository.findOne({ id });
      if (!photo) {
        return {
          ok: false,
          error: 'STUDIO_PHOTO_NOT_FOUND',
        };
      }
      // Find if the user already likes the photo
      const isPhotoAlreadyHearted = await this.studioPhotoRepository
        .createQueryBuilder('photo')
        .leftJoin('photo.heartUsers', 'user')
        .where({ id })
        .andWhere('user.id = :id', { id: user.id })
        .getOne();
      // Heart or Unheart the photo
      const relationQuery = this.studioPhotoRepository
        .createQueryBuilder('photo')
        .relation('heartUsers')
        .of(photo);
      if (isPhotoAlreadyHearted) {
        // Unheart
        await relationQuery.remove({ id: user.id });
        photo.heartCount--;
      } else {
        // Heart
        await relationQuery.add({ id: user.id });
        photo.heartCount++;
      }
      await this.studioPhotoRepository.save(photo);
      return {
        ok: true,
      };
    } catch (e) {
      console.log(e);
      return UNEXPECTED_ERROR;
    }
  }

  async clickStudioPhoto(
    { id }: ClickStudioPhotoInput,
    user: User,
  ): Promise<ClickStudioPhotoOutput> {
    try {
      const photo = await this.studioPhotoRepository.findOne({ id });
      if (!photo) {
        return {
          ok: false,
          error: 'PHOTO_NOT_FOUND',
        };
      }
      // Create and Save UsersClickStudioPhotos
      const newClick = this.usersClickStudioPhotosRepository.create();
      newClick.studioPhoto = photo;
      newClick.user = user ? user : null;
      this.usersClickStudioPhotosRepository.save(newClick);
      // Check if the user hearts the photo
      if (!user) {
        return {
          ok: true,
          isHearted: false,
        };
      }
      const isPhotoHearted = await this.studioPhotoRepository
        .createQueryBuilder('photo')
        .leftJoin('photo.heartUsers', 'heartUser')
        .where({ id })
        .andWhere('heartUser.id = :id', {
          id: user.id,
        })
        .getOne();
      return {
        ok: true,
        isHearted: isPhotoHearted ? true : false,
      };
    } catch (e) {
      console.log(e);
      return UNEXPECTED_ERROR;
    }
  }

  async createReviewPhoto(url: string): Promise<ReviewPhoto> {
    return this.reviewPhotoRepository.save(
      this.reviewPhotoRepository.create({ url }),
    );
  }
}
