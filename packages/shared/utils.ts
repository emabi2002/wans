import type { ApiResponse } from './types';

export const createSuccessResponse = <T>(data: T, meta?: any): ApiResponse<T> => ({
  success: true,
  data,
  meta,
});

export const createErrorResponse = (
  code: string,
  message: string,
  details?: any
): ApiResponse => ({
  success: false,
  error: {
    code,
    message,
    details,
  },
});

export const slugify = (text: string): string => {
  return text
    .toLowerCase()
    .replace(/[^\w\s-]/g, '')
    .replace(/[\s_-]+/g, '-')
    .replace(/^-+|-+$/g, '');
};

export const formatCurrency = (amount: number, currency: string): string => {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency,
  }).format(amount);
};

export const formatDuration = (minutes: number): string => {
  const hours = Math.floor(minutes / 60);
  const mins = minutes % 60;

  if (hours === 0) return `${mins}m`;
  if (mins === 0) return `${hours}h`;
  return `${hours}h ${mins}m`;
};

export const calculateRoyalties = (
  totalRevenue: number,
  producerPercentage: number,
  distributorPercentage: number,
  platformPercentage: number
) => {
  return {
    producer: (totalRevenue * producerPercentage) / 100,
    distributor: (totalRevenue * distributorPercentage) / 100,
    platform: (totalRevenue * platformPercentage) / 100,
  };
};

export const isWindowActive = (
  startDate: Date,
  endDate?: Date | null
): boolean => {
  const now = new Date();
  if (now < startDate) return false;
  if (endDate && now > endDate) return false;
  return true;
};

export const generateSessionId = (): string => {
  return `session_${Date.now()}_${Math.random().toString(36).substring(2, 15)}`;
};

export const sanitizeFilename = (filename: string): string => {
  return filename
    .replace(/[^a-z0-9.-]/gi, '_')
    .replace(/_+/g, '_')
    .toLowerCase();
};

export const parseTerritory = (userCountry?: string): string => {
  if (!userCountry) return 'GLOBAL';
  return userCountry.toUpperCase();
};

export const calculateExpiryDate = (
  hours: number,
  from: Date = new Date()
): Date => {
  const expiry = new Date(from);
  expiry.setHours(expiry.getHours() + hours);
  return expiry;
};

export const generateHLSManifestUrl = (
  filmId: string,
  quality?: string
): string => {
  const baseUrl = process.env.CDN_URL || '';
  const qualityPath = quality ? `/${quality}` : '';
  return `${baseUrl}/streams/${filmId}${qualityPath}/master.m3u8`;
};

export const generateDRMLicenseUrl = (filmId: string, provider: string): string => {
  const baseUrl = process.env.DRM_LICENSE_URL || '';
  return `${baseUrl}/${provider}/license/${filmId}`;
};
