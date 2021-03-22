import got from 'got';
import { Gender } from 'src/users/entities/user.entity';
import { GetOAuthProfileWithAccessTokenOutput } from '../dtos/oauth.dto';

export const getNaverProfileWithAccessToken = async (
  accessToken: string,
): Promise<GetOAuthProfileWithAccessTokenOutput> => {
  try {
    const response = await got.get('https://openapi.naver.com/v1/nid/me', {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    });
    const { response: profile } = JSON.parse(response.body);
    return {
      ok: true,
      profile: {
        socialId: profile.id,
        nickname: profile.nickname,
        profileImageUrl: profile.profile_image,
        gender:
          profile.gender === 'M'
            ? Gender.MALE
            : profile.gender === 'F'
            ? Gender.FEMALE
            : null,
        email: profile.email,
      },
    };
  } catch (e) {
    console.log(e);
    return {
      ok: false,
      error: 'NAVER_SERVER_ERROR',
    };
  }
};
