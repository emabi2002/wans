# THE WANS Platform Architecture

## System Overview

THE WANS is built as a microservices-based platform with a clear separation between frontend applications and backend services. The architecture follows these principles:

1. **Service Independence**: Each microservice is independently deployable
2. **Data Isolation**: Each service has its own bounded context
3. **API-First**: All communication happens through well-defined APIs
4. **Scalability**: Services can scale independently based on load
5. **Resilience**: Failures in one service don't cascade to others

## Architecture Diagram

```
┌─────────────────────────────────────────────────────────────────────┐
│                         FRONTEND LAYER                              │
├─────────────────────────────────────────────────────────────────────┤
│                                                                     │
│  ┌──────────────┐    ┌──────────────┐    ┌──────────────┐         │
│  │   Web App    │    │   Creator    │    │    Admin     │         │
│  │  (Next.js)   │    │   Portal     │    │   Console    │         │
│  │  Port 3000   │    │  Port 3010   │    │  Port 3020   │         │
│  └──────────────┘    └──────────────┘    └──────────────┘         │
│                                                                     │
└─────────────────────────────────────────────────────────────────────┘
                              │
                              │ HTTP/REST
                              ▼
┌─────────────────────────────────────────────────────────────────────┐
│                      API GATEWAY / LOAD BALANCER                    │
└─────────────────────────────────────────────────────────────────────┘
                              │
                ┌─────────────┼─────────────┐
                │             │             │
                ▼             ▼             ▼
┌─────────────────────────────────────────────────────────────────────┐
│                       MICROSERVICES LAYER                           │
├─────────────────────────────────────────────────────────────────────┤
│                                                                     │
│  ┌───────────┐  ┌───────────┐  ┌───────────┐  ┌───────────┐      │
│  │ Identity  │  │  Catalog  │  │  Rights   │  │  Payment  │      │
│  │ Service   │  │  Service  │  │  Service  │  │  Service  │      │
│  │ :3001     │  │  :3002    │  │  :3003    │  │  :3004    │      │
│  └───────────┘  └───────────┘  └───────────┘  └───────────┘      │
│                                                                     │
│  ┌───────────┐  ┌───────────┐  ┌───────────┐  ┌───────────┐      │
│  │ Playback  │  │Transcoding│  │Recommend- │  │Advertising│      │
│  │ Service   │  │  Service  │  │   ation   │  │  Service  │      │
│  │ :3005     │  │  :3006    │  │  :3007    │  │  :3008    │      │
│  └───────────┘  └───────────┘  └───────────┘  └───────────┘      │
│                                                                     │
│  ┌───────────┐  ┌───────────┐                                     │
│  │  Royalty  │  │Notification│                                     │
│  │  Service  │  │  Service  │                                     │
│  │  :3009    │  │  :3010    │                                     │
│  └───────────┘  └───────────┘                                     │
│                                                                     │
└─────────────────────────────────────────────────────────────────────┘
                              │
                ┌─────────────┼─────────────┐
                │             │             │
                ▼             ▼             ▼
┌─────────────────────────────────────────────────────────────────────┐
│                         DATA LAYER                                  │
├─────────────────────────────────────────────────────────────────────┤
│                                                                     │
│  ┌──────────────┐    ┌──────────────┐    ┌──────────────┐         │
│  │  PostgreSQL  │    │    Redis     │    │    MinIO     │         │
│  │  (Primary)   │    │   (Cache)    │    │ (S3 Storage) │         │
│  │  Port 5432   │    │  Port 6379   │    │  Port 9000   │         │
│  └──────────────┘    └──────────────┘    └──────────────┘         │
│                                                                     │
└─────────────────────────────────────────────────────────────────────┘
                              │
                              ▼
┌─────────────────────────────────────────────────────────────────────┐
│                     EXTERNAL INTEGRATIONS                           │
├─────────────────────────────────────────────────────────────────────┤
│                                                                     │
│  ┌──────────┐  ┌──────────┐  ┌──────────┐  ┌──────────┐           │
│  │ OmniFlix │  │  Vuele   │  │   Flux   │  │  Akash   │           │
│  │ (Cosmos) │  │(Polkadot)│  │ Network  │  │ Network  │           │
│  └──────────┘  └──────────┘  └──────────┘  └──────────┘           │
│                                                                     │
│  ┌──────────┐  ┌──────────┐  ┌──────────┐  ┌──────────┐           │
│  │  Stripe  │  │   BSP    │  │ Digicel  │  │ Vodafone │           │
│  └──────────┘  └──────────┘  └──────────┘  └──────────┘           │
│                                                                     │
└─────────────────────────────────────────────────────────────────────┘
```

## Service Details

### 1. Identity Service

**Responsibilities:**
- User authentication (JWT-based)
- User registration and profile management
- Session management
- MFA support (future)
- Wallet-based authentication (Web3)

**Database Tables:**
- users
- profiles
- sessions
- devices

**APIs:**
- `POST /api/auth/register`
- `POST /api/auth/login`
- `POST /api/auth/logout`
- `GET /api/auth/verify`
- `GET /api/profile`
- `POST /api/profile`

### 2. Catalog Service

**Responsibilities:**
- Film metadata management
- Genre classification
- Content search and filtering
- Film recommendations (basic)
- Asset management (posters, trailers)

**Database Tables:**
- films
- genres
- film_genres
- film_assets

**APIs:**
- `GET /api/films` - List films
- `GET /api/films/:id` - Get film details
- `POST /api/films` - Create film
- `PATCH /api/films/:id` - Update film
- `GET /api/genres` - List genres

### 3. Rights & Window Management Service

**Responsibilities:**
- Define release windows (Festival, Cinema, PVOD, etc.)
- Territory management
- Availability checking
- Window lifecycle automation
- Pricing configuration per window

**Database Tables:**
- windows

**Window Types:**
1. **Festival**: Film festival exclusives
2. **Cinema**: Theatrical releases
3. **Collector**: NFT/blockchain editions
4. **PVOD**: Premium video on demand
5. **PPV**: Pay-per-view events
6. **TVOD**: Transactional (rental)
7. **SVOD**: Subscription
8. **AVOD**: Ad-supported

**APIs:**
- `GET /api/windows/film/:filmId`
- `POST /api/windows`
- `PATCH /api/windows/:id`
- `GET /api/availability/:filmId`
- `POST /api/availability/bulk`

### 4. Payment & Billing Service

**Responsibilities:**
- Process payments (Stripe, PNG providers)
- Subscription management
- Transaction recording
- Coupon/promo code validation
- Invoice generation
- Payment webhooks

**Database Tables:**
- subscriptions
- subscription_plans
- transactions
- coupons

**APIs:**
- `POST /api/subscriptions`
- `POST /api/transactions`
- `GET /api/subscriptions/:userId`
- `POST /api/coupons/validate`
- `POST /api/webhooks/stripe`

### 5. Playback & DRM Service

**Responsibilities:**
- Issue DRM licenses
- Manage concurrent stream limits
- Generate playback tokens
- Session tracking
- Bandwidth/quality adaptation

**Database Tables:**
- playback_logs
- devices

**APIs:**
- `POST /api/playback/start`
- `GET /api/playback/token/:filmId`
- `POST /api/playback/heartbeat`
- `POST /api/playback/stop`

### 6. Transcoding Pipeline Service

**Responsibilities:**
- Video encoding (FFmpeg)
- Multi-bitrate generation
- HLS/DASH packaging
- DRM encryption
- Thumbnail generation
- Job queue management

**Database Tables:**
- transcoding_jobs

**Workflow:**
1. Receive master file upload event
2. Create transcoding job
3. Spawn FFmpeg workers (Akash)
4. Generate resolutions: 240p → 4K
5. Package as HLS/DASH
6. Apply DRM
7. Upload to CDN
8. Update job status

**APIs:**
- `POST /api/transcode/start`
- `GET /api/transcode/status/:jobId`
- `POST /api/transcode/webhook`

### 7. Recommendation Engine

**Responsibilities:**
- Personalized film suggestions
- "Because you watched..." logic
- Trending content
- Continue watching
- Genre-based recommendations

**Database Tables:**
- recommendations
- watch_history

**APIs:**
- `GET /api/recommend/for-you`
- `GET /api/recommend/similar/:filmId`
- `GET /api/recommend/trending`

### 8. Advertising Service (AVOD)

**Responsibilities:**
- Ad campaign management
- Ad serving (pre-roll, mid-roll, post-roll)
- Impression tracking
- Click-through recording
- Geo-targeting

**Database Tables:**
- ad_campaigns
- ad_impressions

**APIs:**
- `POST /api/ads/campaigns`
- `GET /api/ads/serve/:filmId`
- `POST /api/ads/impression`
- `POST /api/ads/click`

### 9. Royalty & Revenue Service

**Responsibilities:**
- Calculate revenue splits
- Track earnings per film
- Generate royalty reports
- Blockchain notarization (optional)
- Payment scheduling

**Database Tables:**
- royalty_rules

**Split Calculation:**
```typescript
totalRevenue = SUM(transactions)
producerAmount = totalRevenue * producerPercentage / 100
distributorAmount = totalRevenue * distributorPercentage / 100
platformAmount = totalRevenue * platformPercentage / 100
```

**APIs:**
- `GET /api/royalty/film/:filmId`
- `GET /api/royalty/creator/:creatorId`
- `POST /api/royalty/calculate`
- `GET /api/royalty/report`

### 10. Notification Service

**Responsibilities:**
- Email notifications
- SMS alerts
- Push notifications (future)
- Event-driven messaging
- Template management

**Database Tables:**
- notifications

**Notification Types:**
- Payment confirmations
- Subscription expiry warnings
- New film releases
- Promotions
- System alerts

**APIs:**
- `POST /api/notify/send`
- `GET /api/notify/user/:userId`
- `PATCH /api/notify/:id/read`

## Data Flow Examples

### 1. User Watches a Film

```
1. User clicks "Play" → Web App
2. Web App → Playback Service: Request playback token
3. Playback Service → Rights Service: Check availability
4. Rights Service → Returns available windows
5. Playback Service → Checks user entitlement
6. Playback Service → Generates DRM token
7. Web App receives token & manifest URL
8. Video player loads HLS stream
9. Playback Service logs session
```

### 2. Creator Uploads Film

```
1. Creator uploads file → Creator Portal
2. Creator Portal → Catalog Service: Create film record
3. Catalog Service → Database: Insert film
4. Creator Portal → Transcoding Service: Start job
5. Transcoding Service → Akash workers: Process video
6. Workers generate multi-bitrate files
7. Workers upload to MinIO/S3
8. Transcoding Service → Updates job status
9. Creator receives notification
```

### 3. User Purchases TVOD

```
1. User clicks "Rent" → Web App
2. Web App → Payment Service: Create transaction
3. Payment Service → Stripe: Process payment
4. Stripe → Webhook: Payment success
5. Payment Service → Updates transaction
6. Payment Service → Notification Service: Send receipt
7. Rights Service: Grant 48h access
8. User can now watch film
```

## Deployment Architecture

### Development

- All services run locally
- Docker Compose for dependencies (Postgres, Redis, MinIO)
- Hot reload enabled
- Local S3 storage

### Staging

- Services deployed to Kubernetes cluster
- Managed PostgreSQL (Supabase)
- Managed Redis
- S3 for storage
- CDN for streaming

### Production

- **Frontend**: Flux Network (decentralized)
- **Services**: Akash Network + Traditional cloud
- **Database**: Multi-region PostgreSQL
- **Cache**: Redis Cluster
- **Storage**: Multi-CDN (Cloudflare + decentralized)
- **Transcoding**: Akash workers

## Security Considerations

1. **Authentication**: JWT with short expiry + refresh tokens
2. **Authorization**: Role-based access control (RBAC)
3. **DRM**: Widevine L3, FairPlay, PlayReady
4. **API Security**: Rate limiting, CORS, helmet
5. **Data Encryption**: At rest (database) and in transit (TLS)
6. **Payment Security**: PCI DSS compliance via Stripe
7. **Secret Management**: Environment variables, vault
8. **Audit Logging**: All critical operations logged

## Scalability Strategy

### Horizontal Scaling

- All services are stateless
- Can add more instances as needed
- Load balancer distributes traffic

### Vertical Scaling

- Increase resources for heavy services (Transcoding)
- Database read replicas
- Cache layer (Redis)

### Caching Strategy

1. **Film metadata**: 1 hour TTL
2. **User sessions**: Session duration
3. **Availability checks**: 5 minutes TTL
4. **DRM tokens**: Token expiry
5. **CDN**: 1 year for video assets

## Monitoring & Observability

1. **Logs**: Centralized logging (ELK stack)
2. **Metrics**: Prometheus + Grafana
3. **Tracing**: Jaeger for distributed tracing
4. **Alerts**: PagerDuty integration
5. **Health Checks**: `/health` endpoint on all services
6. **Uptime Monitoring**: StatusPage

## Future Enhancements

1. **WebRTC**: Live streaming support
2. **AI/ML**: Advanced recommendations
3. **Offline Downloads**: Mobile app support
4. **Multi-language**: i18n support
5. **Social Features**: Comments, ratings, sharing
6. **Live Events**: Real-time PPV events
7. **Analytics Dashboard**: Creator insights
8. **A/B Testing**: Feature flags
9. **GraphQL**: Unified API gateway
10. **Blockchain Payments**: Direct crypto payments
