import got from 'got';
import { GetOAuthProfileWithAccessTokenOutput } from '../dtos/oauth.dto';

export const getKakaoProfileWithAccessToken = async (
  accessToken: string,
): Promise<GetOAuthProfileWithAccessTokenOutput> => {
  try {
    const response = await got.post('https://kapi.kakao.com/v2/user/me', {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    });
    const { id, kakao_account } = JSON.parse(response.body);
    if (!id) {
      return {
        ok: false,
        error: 'Invalid Token',
      };
    }
    return {
      ok: true,
      profile: {
        socialId: id.toString(),
        email: kakao_account.email,
        gender: kakao_account.gender,
        nickname: kakao_account.profile.nickname,
        profileImageUrl: kakao_account.profile.profile_image,
      },
    };
  } catch (e) {
    console.log(e);
    return {
      ok: false,
      error: 'KAKAO SERVER ERROR',
    };
  }
};
