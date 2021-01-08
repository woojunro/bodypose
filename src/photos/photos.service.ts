import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { UNEXPECTED_ERROR } from 'src/common/constants/error.constant';
import { StudiosService } from 'src/studios/studios.service';
import { User } from 'src/users/entities/user.entity';
import { UsersService } from 'src/users/users.service';
import { In, IsNull, Not, Repository } from 'typeorm';
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
import { ConceptType, PhotoConcept } from './entities/photo-concept.entity';
import { StudioPhoto } from './entities/studio-photo.entity';

@Injectable()
export class PhotosService {
  constructor(
    @InjectRepository(StudioPhoto)
    private readonly studioPhotoRepository: Repository<StudioPhoto>,
    @InjectRepository(PhotoConcept)
    private readonly photoConceptRepository: Repository<PhotoConcept>,
    private readonly usersService: UsersService,
    private readonly studiosService: StudiosService,
  ) {}

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

  getPhotoConceptBySlug(slug: string): Promise<PhotoConcept> {
    return this.photoConceptRepository.findOne({ slug });
  }

  async attachPhotoConcept(
    photo: StudioPhoto,
    slug: string,
    conceptType: ConceptType,
  ): Promise<void> {
    const concept = await this.photoConceptRepository.findOne({
      slug,
      conceptType,
    });
    if (!concept) return;
    photo.concepts.push(concept);
  }

  async createPhotoConcept({
    slug,
    conceptType,
  }: CreatePhotoConceptInput): Promise<CreatePhotoConceptOutput> {
    try {
      const concept = await this.photoConceptRepository.findOne({
        slug,
        conceptType,
      });
      if (concept) {
        return {
          ok: false,
          error: `Concept with that slug(${slug}) already exists.`,
        };
      }
      const newConcept = this.photoConceptRepository.create({
        slug,
        conceptType,
      });
      const createdConcept = await this.photoConceptRepository.save(newConcept);
      return {
        ok: true,
        photoConcept: createdConcept,
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
          error: 'Studio not found',
        };
      }
      // Create a photo
      const newPhoto = this.studioPhotoRepository.create({
        studio: studioBySlug,
        gender,
        concepts: [],
      });
      // TODO: Upload the photo and get URL
      newPhoto.thumbnailUrl = `http://www.fmonth.com/${Date.now()}`;
      newPhoto.originalUrl = `http://www.fmonth.com/${Date.now()}`;
      // Attach Concepts
      for (const slug of backgroundConceptSlugs) {
        await this.attachPhotoConcept(newPhoto, slug, ConceptType.BACKGROUND);
      }
      for (const slug of costumeConceptSlugs) {
        await this.attachPhotoConcept(newPhoto, slug, ConceptType.COSTUME);
      }
      for (const slug of objectConceptSlugs) {
        await this.attachPhotoConcept(newPhoto, slug, ConceptType.OBJECT);
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
