const DEV_SERVER_URL = 'http://localhost:8080';
const PROD_SERVER_URL = 'https://api.bodypose.co.kr';
const isDevUrl = false;
const BASE_URL = isDevUrl ? DEV_SERVER_URL : PROD_SERVER_URL;

export const CONTACT_BODYPOSE_URL = 'https://pf.kakao.com/_xbxoHEs';
export const CONTACT_STUDIO_KAKAO_ID_PREFIX =
  'https://bodypose.co.kr/kakaoLink/';
export const CONTACT_STUDIO_KAKAO_PHONE_PREFIX =
  'https://bodypose.co.kr/kakaoPhone/';

export const NOTICE_URL = 'https://bodypose.co.kr/notices/13';
export const PRIVACY_URL = 'https://bodypose.co.kr/notices/14';

const API_URLS = {
  GRAPHQL: `${BASE_URL}/graphql`,
  PARTNERS_LOGIN: `${BASE_URL}/auth/login/partners`,
  REFRESH_ACCESS_TOKEN: `${BASE_URL}/auth/refresh`,
  LOGOUT: `${BASE_URL}/auth/logout`,
  UPLOAD_STUDIO_COVER: `${BASE_URL}/uploads/studio-cover`,
  UPLOAD_STUDIO_LOGO: `${BASE_URL}/uploads/studio-logo`,
  UPLOAD_STUDIO_PHOTO: `${BASE_URL}/uploads/studio-photo`,
};

export default API_URLS;
