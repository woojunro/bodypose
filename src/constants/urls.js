const DEV_SERVER_URL = 'http://localhost:8080';
const PROD_SERVER_URL = 'https://api.bodypose.co.kr';
const isDevUrl = true;
export const BASE_URL = isDevUrl ? DEV_SERVER_URL : PROD_SERVER_URL;
export const HTTP_PROTOCOL = isDevUrl ? 'http' : 'https';

export const HOMESCREEN_AD_URL = [
  'https://storage.googleapis.com/bodypose-storage/ads/big%20door.png',
];

export const KAKAO_LOGIN_SCRIPT_URL =
  'https://developers.kakao.com/sdk/js/kakao.js';
export const NAVER_LOGIN_SCRIPT_URL =
  'https://static.nid.naver.com/js/naveridlogin_js_sdk_2.0.2.js';
export const NAVER_LOGIN_CALLBACK_URL = `${HTTP_PROTOCOL}://${window.location.host}/login/naver/callback`;
