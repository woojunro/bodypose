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
import {
  ContactStudioInput,
  StudioContactType,
} from './dtos/contact-studio.dto';
import { ExposeOriginalStudioPhotoInput } from './dtos/expose-original-studio-photo.dto';
import { ViewStudioInfoInput } from './dtos/view-studio-info.dto';
import { LogOriginalStudioPhoto } from './entities/log-original-studio-photo.entity';
import { LogStudioContact } from './entities/log-studio-contact.entity';
import { LogStudioInfoView } from './entities/log-studio-info-view.entity';
import { LogStudioReservation } from './entities/log-studio-reservation.entity';

@Injectable()
export class InsightsService {
  constructor(
    @InjectRepository(LogOriginalStudioPhoto)
    private readonly logOriginalStudioPhotoRepository: Repository<LogOriginalStudioPhoto>,
    @InjectRepository(LogStudioInfoView)
    private readonly logStudioInfoViewRepository: Repository<LogStudioInfoView>,
    @InjectRepository(LogStudioContact)
    private readonly logStudioContactRepository: Repository<LogStudioContact>,
    @InjectRepository(LogStudioReservation)
    private readonly logStudioReservationRepository: Repository<LogStudioReservation>,
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
      const photo = await this.photosService.getStudioPhoto(studioPhotoId);
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
}
