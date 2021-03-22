import got from 'got';
import { CoreOutput } from 'src/common/dtos/output.dto';
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
      error: 'KAKAO_SERVER_ERROR',
    };
  }
};

export const unlinkKakaoUser = async (
  kakaoUserId: string,
  adminKey: string,
): Promise<CoreOutput> => {
  try {
    const response = await got.post('https://kapi.kakao.com/v1/user/unlink', {
      headers: {
        Authorization: `KakaoAK ${adminKey}`,
      },
      form: {
        target_id_type: 'user_id',
        target_id: Number(kakaoUserId),
      },
    });
    const { id } = JSON.parse(response.body);
    if (id.toString() === kakaoUserId) {
      return { ok: true };
    } else {
      return {
        ok: false,
        error: 'KAKAO_SERVER_ERROR',
      };
    }
  } catch (e) {
    console.log(e);
    return {
      ok: false,
      error: 'KAKAO_SERVER_ERROR',
    };
  }
};
