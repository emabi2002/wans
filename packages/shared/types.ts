export enum UserRole {
  VIEWER = 'VIEWER',
  CREATOR = 'CREATOR',
  ADMIN = 'ADMIN',
  SUPER_ADMIN = 'SUPER_ADMIN',
}

export enum WindowType {
  FESTIVAL = 'FESTIVAL',
  CINEMA = 'CINEMA',
  PVOD = 'PVOD',
  PPV = 'PPV',
  TVOD = 'TVOD',
  SVOD = 'SVOD',
  AVOD = 'AVOD',
  COLLECTOR = 'COLLECTOR',
}

export enum TransactionStatus {
  PENDING = 'PENDING',
  COMPLETED = 'COMPLETED',
  FAILED = 'FAILED',
  REFUNDED = 'REFUNDED',
}

export enum FilmStatus {
  DRAFT = 'DRAFT',
  PENDING_APPROVAL = 'PENDING_APPROVAL',
  APPROVED = 'APPROVED',
  PUBLISHED = 'PUBLISHED',
  ARCHIVED = 'ARCHIVED',
}

export enum TranscodingStatus {
  PENDING = 'PENDING',
  PROCESSING = 'PROCESSING',
  COMPLETED = 'COMPLETED',
  FAILED = 'FAILED',
}

export interface ApiResponse<T = any> {
  success: boolean;
  data?: T;
  error?: {
    code: string;
    message: string;
    details?: any;
  };
  meta?: {
    page?: number;
    limit?: number;
    total?: number;
  };
}

export interface PaginationParams {
  page?: number;
  limit?: number;
  sortBy?: string;
  sortOrder?: 'asc' | 'desc';
}

export interface JWTPayload {
  userId: string;
  email: string;
  role: UserRole;
  sessionId?: string;
}

export interface DRMToken {
  token: string;
  licenseUrl: string;
  expiresAt: number;
}

export interface PlaybackSession {
  sessionId: string;
  filmId: string;
  userId: string;
  deviceId: string;
  startTime: Date;
  drmToken?: DRMToken;
}

export interface FilmMetadata {
  id: string;
  title: string;
  description: string;
  posterUrl?: string;
  backdropUrl?: string;
  trailerUrl?: string;
  runtime: number;
  releaseYear?: number;
  rating?: string;
  genres: string[];
}

export interface WindowAvailability {
  windowType: WindowType;
  isAvailable: boolean;
  price?: number;
  currency?: string;
  startDate: Date;
  endDate?: Date;
  rentalDuration?: number;
}

export interface RoyaltyDistribution {
  filmId: string;
  totalRevenue: number;
  producerAmount: number;
  distributorAmount: number;
  platformAmount: number;
  period: {
    start: Date;
    end: Date;
  };
}

export interface TranscodingConfig {
  resolutions: string[];
  format: 'hls' | 'dash' | 'both';
  encryption: boolean;
  thumbnails: boolean;
}

export interface BlockchainConfig {
  omniflix?: {
    apiUrl: string;
    apiKey: string;
  };
  vuele?: {
    apiUrl: string;
    apiKey: string;
  };
  flux?: {
    apiUrl: string;
    nodeUrl: string;
  };
  akash?: {
    apiUrl: string;
    rpcUrl: string;
  };
}

export interface PaymentConfig {
  stripe?: {
    publicKey: string;
    secretKey: string;
    webhookSecret: string;
  };
  png?: {
    bsp?: { apiKey: string; merchantId: string };
    digicel?: { apiKey: string; merchantId: string };
    vodafone?: { apiKey: string; merchantId: string };
  };
}
