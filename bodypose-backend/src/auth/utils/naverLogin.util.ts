import got from 'got';
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
