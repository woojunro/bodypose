import { Notice } from 'src/notices/entity/notice.entity';
import {
  BackgroundConcept,
  CostumeConcept,
  ObjectConcept,
} from 'src/photos/entities/photo-concept.entity';
import { ReviewPhoto } from 'src/photos/entities/review-photo.entity';
import { StudioPhoto } from 'src/photos/entities/studio-photo.entity';
import { UsersClickStudioPhotos } from 'src/photos/entities/users-click-studio-photos.entity';
import { UsersHeartStudioPhotos } from 'src/photos/entities/users-heart-studio-photos.entity';
import { AdditionalProduct } from 'src/studios/entities/additional-product.entity';
import { Branch } from 'src/studios/entities/branch.entity';
import { Catchphrase } from 'src/studios/entities/catchphrase.entity';
import { HairMakeupProduct } from 'src/studios/entities/hair-makeup-product.entity';
import { HairMakeupShop } from 'src/studios/entities/hair-makeup-shop.entity';
import { StudioProduct } from 'src/studios/entities/studio-product.entity';
import { Studio } from 'src/studios/entities/studio.entity';
import { UsersClickStudios } from 'src/studios/entities/users-click-studios.entity';
import { UsersHeartStudios } from 'src/studios/entities/users-heart-studios.entity';
import { UsersReviewStudios } from 'src/studios/entities/users-review-studios.entity';
import { PasswordReset } from 'src/users/entities/password_reset.entity';
import { User } from 'src/users/entities/user.entity';
import { Verification } from 'src/users/entities/verification.entity';

export const ENTITY_LIST = [
  User,
  Verification,
  Studio,
  Branch,
  Catchphrase,
  UsersClickStudios,
  StudioPhoto,
  BackgroundConcept,
  CostumeConcept,
  ObjectConcept,
  UsersClickStudioPhotos,
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
];
