import { OAuth2Client } from 'google-auth-library';
import { GetOAuthProfileWithAccessTokenOutput } from '../dtos/oauth.dto';

export const getGoogleProfileWithAccessToken = async (
  clientId: string,
  accessToken: string,
): Promise<GetOAuthProfileWithAccessTokenOutput> => {
  try {
    const client = new OAuth2Client(clientId);
    const ticket = await client.verifyIdToken({
      idToken: accessToken,
      audience: clientId,
    });
    const payload = ticket.getPayload();
    if (payload.sub) {
      return {
        ok: true,
        profile: {
          socialId: payload.sub,
          email: payload.email,
        },
      };
    } else {
      return {
        ok: false,
        error: 'INVALID_TOKEN',
      };
    }
  } catch (e) {
    console.log(e);
    return {
      ok: false,
      error: 'GOOGLE_SERVER_ERROR',
    };
  }
};
