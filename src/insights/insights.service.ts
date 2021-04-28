import { forwardRef, Inject, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import {
  CommonError,
  UNEXPECTED_ERROR,
} from 'src/common/constants/error.constant';
import { CoreOutput } from 'src/common/dtos/output.dto';
import { PhotosService } from 'src/photos/photos.service';
import { User } from 'src/users/entities/user.entity';
import { Repository } from 'typeorm';
import { ExposeOriginalStudioPhotoInput } from './dtos/expose-original-studio-photo.dto';
import { LogOriginalStudioPhotoExposure } from './entities/log-original-studio-photo-exposure.entity';

@Injectable()
export class InsightsService {
  constructor(
    @InjectRepository(LogOriginalStudioPhotoExposure)
    private readonly logOriginalStudioPhotoExposureRepository: Repository<LogOriginalStudioPhotoExposure>,
    @Inject(forwardRef(() => PhotosService))
    private readonly photosService: PhotosService,
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
}
