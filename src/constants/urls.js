const DEV_SERVER_URL = 'http://localhost:8080';
const PROD_SERVER_URL = 'https://api.bodypose.co.kr';
const isDevUrl = false;
export const BASE_URL = isDevUrl ? DEV_SERVER_URL : PROD_SERVER_URL;

export const HOMESCREEN_AD_URL =
  'https://storage.googleapis.com/bodypose-storage/ads/big%20door.png';
