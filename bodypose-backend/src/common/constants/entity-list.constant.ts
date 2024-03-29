import { RefreshToken } from 'src/auth/entities/refresh-token.entity';
import { Notice } from 'src/notices/entity/notice.entity';
import { PartnersNotice } from 'src/notices/entity/partners-notice.entity';
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
import { StudioInfo } from 'src/studios/entities/studio-info.entity';
import { StudioProduct } from 'src/studios/entities/studio-product.entity';
import { Studio } from 'src/studios/entities/studio.entity';
import { UsersHeartStudios } from 'src/studios/entities/users-heart-studios.entity';
import { UsersReportStudioReviews } from 'src/studios/entities/users-report-studio-reviews.entity';
import { UsersReviewStudios } from 'src/studios/entities/users-review-studios.entity';
import { Partner } from 'src/users/entities/partner.entity';
import { PasswordReset } from 'src/users/entities/password-reset.entity';
import { UserOauth } from 'src/users/entities/user-oauth.entity';
import { UserProfile } from 'src/users/entities/user-profile.entity';
import { User } from 'src/users/entities/user.entity';
import { Verification } from 'src/users/entities/verification.entity';
import MAGAZINE_ENTITIES from 'src/magazine/entities/entities';
import INSIGHTS_ENTITIES from 'src/insights/entities/entities';

export const USERS_SERVICE_ENTITIES = [
  User,
  UserOauth,
  UserProfile,
  Verification,
  PasswordReset,
  Partner,
];

export const AUTH_SERVICE_ENTITIES = [RefreshToken];

export const STUDIOS_SERVICE_ENTITIES = [
  Studio,
  StudioInfo,
  Branch,
  Catchphrase,
  StudioProduct,
  HairMakeupShop,
  HairMakeupProduct,
  AdditionalProduct,
  UsersHeartStudios,
  UsersReviewStudios,
  UsersReportStudioReviews,
];

export const PHOTOS_SERVICE_ENTITIES = [
  StudioPhoto,
  BackgroundConcept,
  CostumeConcept,
  ObjectConcept,
  ReviewPhoto,
  UsersHeartStudioPhotos,
];

export const NOTICES_SERVICE_ENTITIES = [Notice, PartnersNotice];

export const ENTITY_LIST = [
  ...USERS_SERVICE_ENTITIES,
  ...AUTH_SERVICE_ENTITIES,
  ...STUDIOS_SERVICE_ENTITIES,
  ...PHOTOS_SERVICE_ENTITIES,
  ...NOTICES_SERVICE_ENTITIES,
  ...INSIGHTS_ENTITIES,
  ...MAGAZINE_ENTITIES,
];
