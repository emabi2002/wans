import { z } from 'zod';
import { UserRole, WindowType, FilmStatus } from './types';

export const loginSchema = z.object({
  email: z.string().email('Invalid email address'),
  password: z.string().min(8, 'Password must be at least 8 characters'),
});

export const registerSchema = z.object({
  email: z.string().email('Invalid email address'),
  name: z.string().min(2, 'Name must be at least 2 characters'),
  phone: z.string().optional(),
  password: z.string().min(8, 'Password must be at least 8 characters'),
  role: z.nativeEnum(UserRole).optional(),
});

export const createProfileSchema = z.object({
  name: z.string().min(1, 'Profile name is required'),
  isKids: z.boolean().default(false),
  pin: z.string().length(4).optional(),
});

export const createFilmSchema = z.object({
  title: z.string().min(1, 'Title is required'),
  description: z.string().min(10, 'Description must be at least 10 characters'),
  longDescription: z.string().optional(),
  language: z.string().default('en'),
  subtitles: z.array(z.string()).default([]),
  runtime: z.number().positive('Runtime must be positive'),
  releaseYear: z.number().min(1900).max(new Date().getFullYear() + 5).optional(),
  rating: z.string().optional(),
  version: z.string().default('standard'),
  genres: z.array(z.string()).min(1, 'At least one genre is required'),
});

export const createWindowSchema = z.object({
  filmId: z.string(),
  windowType: z.nativeEnum(WindowType),
  startDate: z.coerce.date(),
  endDate: z.coerce.date().optional(),
  territories: z.array(z.string()).default(['GLOBAL']),
  price: z.number().positive().optional(),
  currency: z.string().default('USD'),
  rentalDuration: z.number().positive().optional(),
  drmEnabled: z.boolean().default(true),
  maxStreams: z.number().positive().default(1),
});

export const updateFilmStatusSchema = z.object({
  status: z.nativeEnum(FilmStatus),
});

export const createSubscriptionSchema = z.object({
  planId: z.string(),
  paymentMethodId: z.string(),
});

export const createTransactionSchema = z.object({
  filmId: z.string().optional(),
  windowType: z.nativeEnum(WindowType).optional(),
  amount: z.number().positive(),
  currency: z.string().default('USD'),
  paymentProvider: z.string(),
  paymentMethodId: z.string(),
});

export const paginationSchema = z.object({
  page: z.coerce.number().positive().default(1),
  limit: z.coerce.number().positive().max(100).default(20),
  sortBy: z.string().optional(),
  sortOrder: z.enum(['asc', 'desc']).default('desc'),
});

export const searchFilmsSchema = z.object({
  query: z.string().min(1).optional(),
  genres: z.array(z.string()).optional(),
  year: z.coerce.number().optional(),
  rating: z.string().optional(),
  language: z.string().optional(),
}).merge(paginationSchema);

export const playbackRequestSchema = z.object({
  filmId: z.string(),
  deviceId: z.string(),
  quality: z.string().optional(),
});

export const royaltyRuleSchema = z.object({
  filmId: z.string(),
  producerPercentage: z.number().min(0).max(100),
  distributorPercentage: z.number().min(0).max(100),
  platformPercentage: z.number().min(0).max(100),
}).refine(
  (data) =>
    data.producerPercentage + data.distributorPercentage + data.platformPercentage === 100,
  { message: 'Percentages must sum to 100' }
);

export const createAdCampaignSchema = z.object({
  name: z.string().min(1),
  advertiserId: z.string(),
  videoUrl: z.string().url(),
  clickUrl: z.string().url().optional(),
  duration: z.number().positive(),
  territories: z.array(z.string()).default(['GLOBAL']),
  startDate: z.coerce.date(),
  endDate: z.coerce.date().optional(),
  budget: z.number().positive().optional(),
  cpm: z.number().positive().optional(),
});

export const createCouponSchema = z.object({
  code: z.string().min(3).max(20).toUpperCase(),
  description: z.string().optional(),
  discountType: z.enum(['PERCENTAGE', 'FIXED']),
  discountValue: z.number().positive(),
  maxUses: z.number().positive().optional(),
  validFrom: z.coerce.date(),
  validUntil: z.coerce.date().optional(),
  applicableTo: z.array(z.string()).default([]),
});

export const transcodingJobSchema = z.object({
  filmId: z.string(),
  inputPath: z.string(),
  resolution: z.array(z.string()).default(['240p', '360p', '480p', '720p', '1080p']),
  format: z.enum(['hls', 'dash', 'both']).default('hls'),
});
