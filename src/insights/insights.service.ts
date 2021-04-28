import { forwardRef, Inject, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import {
  CommonError,
  UNEXPECTED_ERROR,
} from 'src/common/constants/error.constant';
import { CoreOutput } from 'src/common/dtos/output.dto';
import { PhotosService } from 'src/photos/photos.service';
import { StudiosService } from 'src/studios/studios.service';
import { User } from 'src/users/entities/user.entity';
import { Repository } from 'typeorm';
import { ExposeOriginalStudioPhotoInput } from './dtos/expose-original-studio-photo.dto';
import { ViewStudioInfoInput } from './dtos/view-studio-info.dto';
import { LogOriginalStudioPhotoExposure } from './entities/log-original-studio-photo-exposure.entity';
import { LogStudioInfoView } from './entities/log-studio-info-view.entity';

@Injectable()
export class InsightsService {
  constructor(
    @InjectRepository(LogOriginalStudioPhotoExposure)
    private readonly logOriginalStudioPhotoExposureRepository: Repository<LogOriginalStudioPhotoExposure>,
    @InjectRepository(LogStudioInfoView)
    private readonly logStudioInfoViewRepository: Repository<LogStudioInfoView>,
    @Inject(forwardRef(() => PhotosService))
    private readonly photosService: PhotosService,
    @Inject(forwardRef(() => StudiosService))
    private readonly studiosService: StudiosService,
  ) {}

  async exposeOriginalStudioPhoto(
    user: User,
    { studioPhotoId }: ExposeOriginalStudioPhotoInput,
  ): Promise<CoreOutput> {
    try {
      // Check if studioPhoto with the studioPhotoId exists
      const doesStudioPhotoExist = await this.photosService.checkIfStudioPhotoExists(
        studioPhotoId,
      );
      if (!doesStudioPhotoExist) return CommonError('STUDIO_PHOTO_NOT_FOUND');
      const newLog = this.logOriginalStudioPhotoExposureRepository.create({
        user: user ? { id: user.id } : null,
        studioPhoto: { id: studioPhotoId },
      });
      await this.logOriginalStudioPhotoExposureRepository.insert(newLog);
      // TODO: Increment studioPhoto's clickCount?
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
      // TODO: Increment counts
      return { ok: true };
    } catch (e) {
      console.log(e);
      return UNEXPECTED_ERROR;
    }
  }
}
