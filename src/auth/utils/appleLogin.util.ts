import jwt from 'jsonwebtoken';
import got from 'got';
import { GetOAuthProfileWithAccessTokenOutput } from '../dtos/oauth.dto';

export const getAppleProfileWithAccessToken = async (
  accessToken: string,
  privateKey: string,
  keyId: string,
  teamId: string,
  clientId: string,
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
      header: {
        kid: keyId,
        alg: 'ES256',
      },
      algorithm: 'ES256',
    },
  );

  const url = 'https://appleid.apple.com/auth/token';
  const headers = { 'Content-Type': 'application/x-www-form-urlencoded' };
  const payload = {
    client_id: clientId,
    client_secret: clientSecret,
    code: accessToken,
    grant_type: 'authorization_code',
    redirect_url: 'https://example.com/redirect',
  };

  const response = await got.post(url, {
    headers,
    json: payload,
    responseType: 'json',
  });

  console.log(response.body);

  return {
    ok: false,
    error: 'TEST',
  };
};
