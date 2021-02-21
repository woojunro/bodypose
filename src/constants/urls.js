const DEV_SERVER_URL = 'http://localhost:8080';
const PROD_SERVER_URL = 'https://api.bodypose.co.kr';
const isDevUrl = true;
export const BASE_URL = isDevUrl ? DEV_SERVER_URL : PROD_SERVER_URL;
