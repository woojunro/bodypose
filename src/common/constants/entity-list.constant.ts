import { RefreshToken } from 'src/auth/entities/refresh-token.entity';
import { LogOriginalStudioPhotoExposure } from 'src/insights/entities/log-original-studio-photo-exposure.entity';
import { LogStudioInfoView } from 'src/insights/entities/log-studio-info-view.entity';
import { Notice } from 'src/notices/entity/notice.entity';
import {
  BackgroundConcept,
  CostumeConcept,
  ObjectConcept,
} from 'src/photos/entities/photo-concept.entity';
import { ReviewPhoto } from 'src/photos/entities/review-photo.entity';
import { StudioPhoto } from 'src/photos/entities/studio-photo.entity';
import { UsersHeartStudioPhotos } from 'src/photos/entities/users-heart-studio-photos.entity';
import { AdditionalProduct } from 'src/studios/entities/additional-product.entity';
import { Branch } from 'src/studios/entities/branch.entity';
import { Catchphrase } from 'src/studios/entities/catchphrase.entity';
import { HairMakeupProduct } from 'src/studios/entities/hair-makeup-product.entity';
import { HairMakeupShop } from 'src/studios/entities/hair-makeup-shop.entity';
import { StudioProduct } from 'src/studios/entities/studio-product.entity';
import { Studio } from 'src/studios/entities/studio.entity';
import { UsersHeartStudios } from 'src/studios/entities/users-heart-studios.entity';
import { UsersReportStudioReviews } from 'src/studios/entities/users-report-studio-reviews.entity';
import { UsersReviewStudios } from 'src/studios/entities/users-review-studios.entity';
import { PasswordReset } from 'src/users/entities/password-reset.entity';
import { SocialAccount } from 'src/users/entities/social-account.entity';
import { UserProfile } from 'src/users/entities/user-profile.entity';
import { User } from 'src/users/entities/user.entity';
import { Verification } from 'src/users/entities/verification.entity';

export const LOG_ENTITIES = [LogOriginalStudioPhotoExposure, LogStudioInfoView];

export const ENTITY_LIST = [
  User,
  RefreshToken,
  UserProfile,
  SocialAccount,
  Verification,
  Studio,
  Branch,
  Catchphrase,
  StudioPhoto,
  BackgroundConcept,
  CostumeConcept,
  ObjectConcept,
  StudioProduct,
  HairMakeupShop,
  HairMakeupProduct,
  AdditionalProduct,
  UsersReviewStudios,
  ReviewPhoto,
  PasswordReset,
  Notice,
  UsersHeartStudios,
  UsersHeartStudioPhotos,
  UsersReportStudioReviews,
  ...LOG_ENTITIES,
];
