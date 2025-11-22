export const TERRITORIES = {
  GLOBAL: 'GLOBAL',
  PNG: 'PNG',
  AU: 'AU',
  NZ: 'NZ',
  US: 'US',
  UK: 'UK',
} as const;

export const CURRENCIES = {
  USD: 'USD',
  PGK: 'PGK',
  AUD: 'AUD',
  NZD: 'NZD',
  GBP: 'GBP',
} as const;

export const VIDEO_RESOLUTIONS = [
  '240p',
  '360p',
  '480p',
  '720p',
  '1080p',
  '1440p',
  '2160p',
] as const;

export const PLAYBACK_FORMATS = {
  HLS: 'application/x-mpegURL',
  DASH: 'application/dash+xml',
  MP4: 'video/mp4',
} as const;

export const MAX_CONCURRENT_STREAMS = {
  BASIC: 1,
  STANDARD: 2,
  PREMIUM: 4,
} as const;

export const MAX_PROFILES = {
  BASIC: 1,
  STANDARD: 3,
  PREMIUM: 5,
} as const;

export const DEFAULT_RENTAL_DURATION = 48; // hours

export const SESSION_DURATION = 24 * 60 * 60 * 1000; // 24 hours in ms

export const API_ENDPOINTS = {
  IDENTITY: '/api/identity',
  CATALOG: '/api/catalog',
  RIGHTS: '/api/rights',
  PAYMENT: '/api/payment',
  PLAYBACK: '/api/playback',
  RECOMMENDATION: '/api/recommendation',
  ADVERTISING: '/api/advertising',
  ROYALTY: '/api/royalty',
  NOTIFICATION: '/api/notification',
} as const;

export const ERROR_CODES = {
  UNAUTHORIZED: 'UNAUTHORIZED',
  FORBIDDEN: 'FORBIDDEN',
  NOT_FOUND: 'NOT_FOUND',
  VALIDATION_ERROR: 'VALIDATION_ERROR',
  PAYMENT_FAILED: 'PAYMENT_FAILED',
  SUBSCRIPTION_EXPIRED: 'SUBSCRIPTION_EXPIRED',
  CONCURRENT_STREAMS_EXCEEDED: 'CONCURRENT_STREAMS_EXCEEDED',
  GEO_RESTRICTED: 'GEO_RESTRICTED',
  WINDOW_EXPIRED: 'WINDOW_EXPIRED',
  DRM_ERROR: 'DRM_ERROR',
  TRANSCODING_FAILED: 'TRANSCODING_FAILED',
} as const;

export const WEBHOOK_EVENTS = {
  PAYMENT_COMPLETED: 'payment.completed',
  PAYMENT_FAILED: 'payment.failed',
  SUBSCRIPTION_CREATED: 'subscription.created',
  SUBSCRIPTION_UPDATED: 'subscription.updated',
  SUBSCRIPTION_CANCELLED: 'subscription.cancelled',
  FILM_PUBLISHED: 'film.published',
  TRANSCODING_COMPLETED: 'transcoding.completed',
  TRANSCODING_FAILED: 'transcoding.failed',
} as const;

export const AD_POSITIONS = {
  PRE_ROLL: 'PRE_ROLL',
  MID_ROLL: 'MID_ROLL',
  POST_ROLL: 'POST_ROLL',
} as const;

export const NOTIFICATION_TYPES = {
  PAYMENT_CONFIRMATION: 'PAYMENT_CONFIRMATION',
  SUBSCRIPTION_EXPIRY: 'SUBSCRIPTION_EXPIRY',
  NEW_RELEASE: 'NEW_RELEASE',
  PROMOTION: 'PROMOTION',
  SYSTEM: 'SYSTEM',
} as const;
