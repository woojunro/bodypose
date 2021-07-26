import got from 'got';
import * as jwt from 'jsonwebtoken';
import { CommonError } from 'src/common/constants/error.constant';
import { GetOAuthProfileWithAccessTokenOutput } from '../dtos/oauth.dto';

export const getAppleProfileWithAccessToken = async (
  accessToken: string,
  clientId: string,
  teamId: string,
  keyId: string,
  privateKey: string,
): Promise<GetOAuthProfileWithAccessTokenOutput> => {
  const nowInSeconds = Math.floor(Date.now() / 1000);
  const clientSecret = jwt.sign(
    {
      iss: teamId,
      iat: nowInSeconds,
      exp: nowInSeconds + 3600, // 1 hour
      aud: 'https://appleid.apple.com',
      sub: clientId,
    },
    privateKey,
    {
      algorithm: 'ES256',
      header: {
        kid: keyId,
        alg: 'ES256',
      },
    },
  );

  const url = 'https://appleid.apple.com/auth/token';
  const form = {
    client_id: clientId,
    client_secret: clientSecret,
    code: accessToken,
    grant_type: 'authorization_code',
    redirect_uri: 'https://bodypose.co.kr/redirect',
  };

  try {
    const response = await got.post(url, {
      form,
    });
    const { id_token: idToken } = JSON.parse(response.body);
    const userInfo = jwt.decode(idToken);
    if (
      userInfo['iss'] === 'https://appleid.apple.com' &&
      userInfo['aud'] === clientId
    ) {
      return {
        ok: true,
        profile: {
          socialId: userInfo['sub'],
          email: userInfo['email'],
        },
      };
    } else {
      throw new Error();
    }
  } catch (e) {
    return CommonError('APPLE_LOGIN_ERROR');
  }
};
