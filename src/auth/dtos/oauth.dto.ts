import { CoreOutput } from 'src/common/dtos/output.dto';
import { Gender } from 'src/users/entities/user.entity';

export interface OAuthProfile {
  socialId: string;
  email?: string;
  nickname?: string;
  gender?: Gender;
  profileImageUrl?: string;
}

export class GetOAuthProfileWithAccessTokenOutput extends CoreOutput {
  profile?: OAuthProfile;
}
