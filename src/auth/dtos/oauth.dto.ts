import { CoreOutput } from 'src/common/dtos/output.dto';

export interface OAuthProfile {
  socialId: string;
  email?: string;
}

export class GetOAuthProfileWithAccessTokenOutput extends CoreOutput {
  profile?: OAuthProfile;
}
