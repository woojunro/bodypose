import { CookieOptions } from 'express';

const two_hours_in_ms = 2 * 60 * 60 * 1000;
const ninety_days_in_ms = 90 * 24 * 60 * 60 * 1000;

export const ACCESS_TOKEN_COOKIE_OPTIONS: CookieOptions = {
  expires: new Date(Date.now() + two_hours_in_ms), // 2 hours
  httpOnly: true,
  sameSite: 'lax',
};

export const REFRESH_TOKEN_COOKIE_OPTIONS: CookieOptions = {
  expires: new Date(Date.now() + ninety_days_in_ms),
  httpOnly: true,
  path: '/auth/refresh',
  sameSite: 'lax',
};
