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
import { UploadsService } from 'src/uploads/uploads.service';
import { Role, User } from 'src/users/entities/user.entity';
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
  GetMyHeartStudioPhotosInput,
} from './dtos/get-studio-photo.dto';
import {
  HeartStudioPhotoInput,
  HeartStudioPhotoOutput,
} from './dtos/heart-studio-photo.dto';
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
import { UsersHeartStudioPhotos } from './entities/users-heart-studio-photos.entity';

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
    @InjectRepository(UsersHeartStudioPhotos)
    private readonly usersHeartStudioPhotosRepository: Repository<UsersHeartStudioPhotos>,
    @Inject(forwardRef(() => UsersService))
    private readonly usersService: UsersService,
    @Inject(forwardRef(() => StudiosService))
    private readonly studiosService: StudiosService,
    @Inject(forwardRef(() => UploadsService))
    private readonly uploadsService: UploadsService,
  ) {}

  async getAllStudioPhotos(
    user: User,
    input: GetAllStudioPhotosInput,
  ): Promise<GetAllStudioPhotosOutput> {
    try {
      const {
        take,
        page,
        gender,
        backgroundConceptSlugs,
        costumeConceptSlugs,
        objectConceptSlugs,
      } = input;

      let query = this.studioPhotoRepository.createQueryBuilder('photo');
      query = query.leftJoinAndSelect('photo.studio', 'studio');

      if (backgroundConceptSlugs.length !== 0) {
        query = query.leftJoin('photo.backgroundConcepts', 'backgroundConcept');
      }
      if (costumeConceptSlugs.length !== 0) {
        query = query.leftJoin('photo.costumeConcepts', 'costumeConcept');
      }
      if (objectConceptSlugs.length !== 0) {
        query = query.leftJoin('photo.objectConcepts', 'objectConcept');
      }

      const [photos, count] = await query
        .where({ gender: gender ? gender : Not(IsNull()) })
        .andWhere('studio.coverPhotoUrl IS NOT NULL')
        .andWhere(
          backgroundConceptSlugs.length !== 0
            ? 'backgroundConcept.slug IN (:bgSlugs)'
            : '1=1',
          { bgSlugs: backgroundConceptSlugs },
        )
        .andWhere(
          costumeConceptSlugs.length !== 0
            ? 'costumeConcept.slug IN (:costumeSlugs)'
            : '1=1',
          { costumeSlugs: costumeConceptSlugs },
        )
        .andWhere(
          objectConceptSlugs.length !== 0
            ? 'objectConcept.slug IN (:objectSlugs)'
            : '1=1',
          { objectSlugs: objectConceptSlugs },
        )
        .orderBy('photo.substr', 'ASC')
        .addOrderBy('photo.id', 'DESC')
        .skip((page - 1) * take)
        .take(take)
        .getManyAndCount();

      let heartPhotos: UsersHeartStudioPhotos[] = [];
      if (user) {
        const photoIds = photos.map(photo => photo.id);
        const query = this.usersHeartStudioPhotosRepository
          .createQueryBuilder('heart')
          .select(['heart.id'])
          .leftJoin('heart.user', 'user')
          .leftJoin('heart.studioPhoto', 'photo')
          .addSelect(['photo.id'])
          .where('user.id = :id', { id: user.id });

        if (photoIds.length > 0) {
          heartPhotos = await query
            .andWhere('photo.id IN (:photoIds)', { photoIds })
            .getMany();
        }
      }

      // return
      return {
        ok: true,
        totalPages: Math.ceil(count / take),
        photos: photos.map(photo => ({
          ...photo,
          isHearted: heartPhotos.some(
            heart => heart.studioPhoto.id === photo.id,
          ),
        })),
      };
    } catch (e) {
      console.log(e);
      return UNEXPECTED_ERROR;
    }
  }

  async getStudioPhotos(
    user: User,
    { studioSlug, gender, page }: GetStudioPhotosInput,
  ): Promise<GetStudioPhotosOutput> {
    try {
      const photosPerPage = 24;
      const [photos, count] = await this.studioPhotoRepository
        .createQueryBuilder('photo')
        .leftJoinAndSelect('photo.studio', 'studio')
        .where({ gender: gender ? gender : Not(IsNull()) })
        .andWhere(
          user && user.role === Role.ADMIN
            ? '1=1'
            : 'studio.coverPhotoUrl IS NOT NULL',
        )
        .andWhere('studio.slug = :slug', { slug: studioSlug })
        .orderBy('photo.id', 'DESC')
        .take(photosPerPage)
        .skip((page - 1) * photosPerPage)
        .getManyAndCount();

      let heartPhotos: UsersHeartStudioPhotos[] = [];
      if (user) {
        const photoIds = photos.map(photo => photo.id);
        const query = this.usersHeartStudioPhotosRepository
          .createQueryBuilder('heart')
          .select(['heart.id'])
          .leftJoin('heart.user', 'user')
          .leftJoin('heart.studioPhoto', 'photo')
          .addSelect(['photo.id'])
          .where('user.id = :id', { id: user.id });

        if (photoIds.length > 0) {
          heartPhotos = await query
            .andWhere('photo.id IN (:photoIds)', { photoIds })
            .getMany();
        }
      }

      return {
        ok: true,
        photos: photos.map(photo => ({
          ...photo,
          isHearted: heartPhotos.some(
            heart => heart.studioPhoto.id === photo.id,
          ),
        })),
        totalPages: Math.ceil(count / photosPerPage),
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
      // Delete photos in storage
      const thumbnailPhoto = photo.thumbnailUrl.substring(
        photo.thumbnailUrl.indexOf('studio-photos'),
      );
      const originalPhoto = photo.originalUrl.substring(
        photo.originalUrl.indexOf('studio-photos'),
      );
      await this.uploadsService.deleteFile(thumbnailPhoto);
      await this.uploadsService.deleteFile(originalPhoto);
      return { ok: true };
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
      const photo = await this.studioPhotoRepository.findOne(
        { id },
        { select: ['id'] },
      );
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
      return { ok: true };
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

  async heartStudioPhoto(
    user: User,
    { id }: HeartStudioPhotoInput,
  ): Promise<HeartStudioPhotoOutput> {
    try {
      const photo = await this.studioPhotoRepository.findOne(
        { id },
        { select: ['id', 'heartCount'] },
      );
      if (!photo) {
        return {
          ok: false,
          error: 'STUDIO_PHOTO_NOT_FOUND',
        };
      }
      const isAlreadyHearted = await this.usersHeartStudioPhotosRepository.findOne(
        {
          user: { id: user.id },
          studioPhoto: { id: photo.id },
        },
      );
      if (isAlreadyHearted) {
        return {
          ok: false,
          error: 'ALREADY_HEARTED',
        };
      }
      await this.usersHeartStudioPhotosRepository.save(
        this.usersHeartStudioPhotosRepository.create({
          user: { id: user.id },
          studioPhoto: { id: photo.id },
        }),
      );
      photo.heartCount++;
      await this.studioPhotoRepository.save(photo);
      return { ok: true, id };
    } catch (e) {
      console.log(e);
      return UNEXPECTED_ERROR;
    }
  }

  async disheartStudioPhoto(
    user: User,
    { id }: HeartStudioPhotoInput,
  ): Promise<HeartStudioPhotoOutput> {
    try {
      const photo = await this.studioPhotoRepository.findOne(
        { id },
        { select: ['id', 'heartCount'] },
      );
      if (!photo) {
        return {
          ok: false,
          error: 'STUDIO_PHOTO_NOT_FOUND',
        };
      }
      const heart = await this.usersHeartStudioPhotosRepository.findOne({
        user: { id: user.id },
        studioPhoto: { id: photo.id },
      });
      if (!heart) {
        return {
          ok: false,
          error: 'ALREADY_DISHEARTED',
        };
      }
      await this.usersHeartStudioPhotosRepository.delete({ id: heart.id });
      photo.heartCount--;
      await this.studioPhotoRepository.save(photo);
      return { ok: true, id };
    } catch (e) {
      console.log(e);
      return UNEXPECTED_ERROR;
    }
  }

  async getMyHeartStudioPhotos(
    user: User,
    { page }: GetMyHeartStudioPhotosInput,
  ): Promise<GetStudioPhotosOutput> {
    try {
      const photosPerPage = 24;
      const [hearts, count] = await this.usersHeartStudioPhotosRepository
        .createQueryBuilder('heart')
        .select(['heart.id', 'heart.heartAt'])
        .leftJoin('heart.user', 'user')
        .leftJoinAndSelect('heart.studioPhoto', 'photo')
        .leftJoinAndSelect('photo.studio', 'studio')
        .where('user.id = :id', { id: user.id })
        .andWhere('studio.coverPhotoUrl IS NOT NULL')
        .orderBy('heart.heartAt', 'DESC')
        .skip((page - 1) * photosPerPage)
        .take(photosPerPage)
        .getManyAndCount();

      return {
        ok: true,
        totalPages: Math.ceil(count / photosPerPage),
        photos: hearts.map(heart => ({
          ...heart.studioPhoto,
          isHearted: true,
        })),
      };
    } catch (e) {
      console.log(e);
      return UNEXPECTED_ERROR;
    }
  }
}
