import { forwardRef, Inject, Injectable } from '@nestjs/common';
import { InjectConnection, InjectRepository } from '@nestjs/typeorm';
import {
  CommonError,
  UNEXPECTED_ERROR,
} from 'src/common/constants/error.constant';
import { CoreOutput } from 'src/common/dtos/output.dto';
import { MagazineService } from 'src/magazine/magazine.service';
import { PhotosService } from 'src/photos/photos.service';
import { StudiosService } from 'src/studios/studios.service';
import { User } from 'src/users/entities/user.entity';
import { Connection, Repository } from 'typeorm';
import {
  ContactStudioInput,
  StudioContactType,
} from './dtos/contact-studio.dto';
import { ExposeOriginalStudioPhotoInput } from './dtos/expose-original-studio-photo.dto';
import { GetStatsInput, GetStatsOutput, Stat, StatType } from './dtos/stat.dto';
import { ViewArticleInput } from './dtos/view-article.dto';
import { ViewStudioInfoInput } from './dtos/view-studio-info.dto';
import { LogArticleView } from './entities/log-article-view.entity';
import { LogOriginalStudioPhoto } from './entities/log-original-studio-photo.entity';
import { LogStudioContact } from './entities/log-studio-contact.entity';
import { LogStudioInfoView } from './entities/log-studio-info-view.entity';
import { LogStudioReservation } from './entities/log-studio-reservation.entity';
import { getWeeklyStatsSQLQuery } from './utils/weekly-stats-query.util';

@Injectable()
export class InsightsService {
  constructor(
    @InjectConnection()
    private readonly connection: Connection,

    @InjectRepository(LogOriginalStudioPhoto)
    private readonly logOriginalStudioPhotoRepository: Repository<LogOriginalStudioPhoto>,

    @InjectRepository(LogStudioInfoView)
    private readonly logStudioInfoViewRepository: Repository<LogStudioInfoView>,

    @InjectRepository(LogStudioContact)
    private readonly logStudioContactRepository: Repository<LogStudioContact>,

    @InjectRepository(LogStudioReservation)
    private readonly logStudioReservationRepository: Repository<LogStudioReservation>,

    @InjectRepository(LogArticleView)
    private readonly logArticleViewRepository: Repository<LogArticleView>,

    @Inject(forwardRef(() => PhotosService))
    private readonly photosService: PhotosService,

    @Inject(forwardRef(() => StudiosService))
    private readonly studiosService: StudiosService,

    @Inject(MagazineService)
    private readonly magazineService: MagazineService,
  ) {}

  async getWeeklyStats(
    user: User,
    { studioSlug, type }: GetStatsInput,
  ): Promise<GetStatsOutput> {
    // authorization
    const studio = await this.studiosService.checkIfStudioExistsBySlug(
      studioSlug,
    );
    if (!studio) return CommonError('STUDIO_NOT_FOUND');
    const valid = await this.studiosService.checkIfUserIsAdminOrOwner(
      studio.id,
      user,
    );
    if (!valid) return CommonError('INVALID');

    // execute query
    let repo: Repository<any>;
    switch (type) {
      case StatType.ORIGINAL_PHOTO_VIEW:
        repo = this.logOriginalStudioPhotoRepository;
        break;
      case StatType.STUDIO_CONTACT:
        repo = this.logStudioContactRepository;
        break;
      case StatType.STUDIO_INFO_VIEW:
        repo = this.logStudioInfoViewRepository;
        break;
      case StatType.STUDIO_RESERVATION:
        repo = this.logStudioReservationRepository;
        break;
      default:
        throw new Error('Invalid stat type');
    }

    const tableName = repo.metadata.tableName;
    const query = getWeeklyStatsSQLQuery(tableName);
    const queryResult = await this.connection.query(query, [studio.id]);

    const stats: Stat[] = queryResult.map(row => ({
      datetime: new Date(row.week_beginning),
      count: Number(row.count),
    }));

    return { ok: true, stats };
  }

  async exposeOriginalStudioPhoto(
    user: User,
    { studioPhotoId }: ExposeOriginalStudioPhotoInput,
  ): Promise<CoreOutput> {
    try {
      const photo = await this.photosService.checkIfStudioPhotoExists(
        studioPhotoId,
      );
      if (!photo) return CommonError('STUDIO_PHOTO_NOT_FOUND');
      const newLog = this.logOriginalStudioPhotoRepository.create({
        user: user ? { id: user.id } : null,
        studioPhoto: { id: photo.id },
        studio: { id: photo.studio.id },
      });
      await this.logOriginalStudioPhotoRepository.insert(newLog);
      return { ok: true };
    } catch (e) {
      console.log(e);
      return UNEXPECTED_ERROR;
    }
  }

  async viewStudioInfo(
    user: User,
    { source, studioId }: ViewStudioInfoInput,
  ): Promise<CoreOutput> {
    try {
      // Check if studio with the studioId exists
      const doesStudioExist = await this.studiosService.checkIfStudioExistsById(
        studioId,
      );
      if (!doesStudioExist) return CommonError('STUDIO_NOT_FOUND');
      const newLog = this.logStudioInfoViewRepository.create({
        source,
        user: user ? { id: user.id } : null,
        studio: { id: studioId },
      });
      await this.logStudioInfoViewRepository.insert(newLog);
      return { ok: true };
    } catch (e) {
      console.log(e);
      return UNEXPECTED_ERROR;
    }
  }

  async contactStudio(
    user: User,
    { contactType, studioId }: ContactStudioInput,
  ): Promise<CoreOutput> {
    try {
      const doesStudioExist = await this.studiosService.checkIfStudioExistsById(
        studioId,
      );
      if (!doesStudioExist) return CommonError('STUDIO_NOT_FOUND');
      const newLog = {
        user: user ? { id: user.id } : null,
        studio: { id: studioId },
      };
      switch (contactType) {
        case StudioContactType.CONTACT:
          await this.logStudioContactRepository.insert(newLog);
          break;
        case StudioContactType.RESERVATION:
          await this.logStudioReservationRepository.insert(newLog);
          break;
        default:
          break;
      }
      return { ok: true };
    } catch (e) {
      console.log(e);
      return UNEXPECTED_ERROR;
    }
  }

  async viewArticle(
    user: User,
    { articleId, source }: ViewArticleInput,
  ): Promise<CoreOutput> {
    const newLog = this.logArticleViewRepository.create({
      user,
      article: { id: articleId },
      source,
    });
    await this.logArticleViewRepository.insert(newLog);
    await this.magazineService.incrementArticleViewCount(articleId);
    return { ok: true };
  }
}
