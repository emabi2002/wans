# THE WANS - OTT/VOD Streaming Platform

A comprehensive hybrid Web2.5 + Web3 streaming platform built for Papua New Guinea and global distribution.

## 🎯 Overview

THE WANS is a full-featured OTT/VOD platform supporting:

- **Multiple Monetization Models**: SVOD, AVOD, TVOD, PPV, PVOD
- **Film Window Lifecycle Management**: Festival, Cinema, PVOD, TVOD, SVOD, AVOD
- **Multi-Platform Support**: Web, Mobile (responsive), Smart TV-ready
- **Web3 Integration**: OmniFlix (Cosmos), Vuele (Polkadot), Flux Network, Akash Network
- **DRM Support**: Widevine, FairPlay, PlayReady
- **Video Pipeline**: Transcoding, HLS/DASH packaging, CDN delivery
- **Creator Tools**: Upload portal, analytics, royalty tracking
- **Admin Console**: Content management, window configuration, analytics

## 🏗️ Architecture

### Monorepo Structure

```
the-wans/
├── apps/
│   ├── web/              # Main streaming web app (Next.js)
│   ├── admin/            # Admin console
│   └── creator/          # Creator portal
├── services/
│   ├── identity/         # Authentication & user management
│   ├── catalog/          # Film catalog & metadata
│   ├── rights/           # Window & rights management
│   ├── payment/          # Billing & transactions
│   ├── playback/         # DRM & streaming sessions
│   ├── transcoding/      # Video processing pipeline
│   ├── recommendation/   # Personalization engine
│   ├── advertising/      # AVOD ad serving
│   ├── royalty/          # Revenue distribution
│   └── notification/     # Email/SMS alerts
├── packages/
│   ├── database/         # Prisma schema & client
│   ├── shared/           # Common types & utilities
│   └── ui/               # Shared UI components
├── infrastructure/
│   ├── docker/           # Container configurations
│   ├── flux/             # Flux Network deployment
│   ├── akash/            # Akash Network deployment
│   └── ci-cd/            # GitHub Actions workflows
└── scripts/              # Utility scripts

```

## 🚀 Quick Start

### Prerequisites

- **Bun** >= 1.0.0
- **Node.js** >= 20.0.0
- **PostgreSQL** >= 14
- **Redis** >= 6.0
- **Docker** & **Docker Compose** (for deployment)
- **FFmpeg** (for transcoding)

### Installation

1. **Clone the repository**

```bash
git clone <repository-url>
cd the-wans
```

2. **Install dependencies**

```bash
bun install
```

3. **Set up environment variables**

Create `.env` files in each service:

```bash
# Root .env
DATABASE_URL="postgresql://user:password@localhost:5432/thewans"
REDIS_URL="redis://localhost:6379"

# services/identity/.env
JWT_SECRET="your-secret-key-change-in-production"
PORT=3001

# services/catalog/.env
PORT=3002

# Add more as needed...
```

4. **Run database migrations**

```bash
bun run db:migrate
```

5. **Start development servers**

```bash
# Start all services
bun run dev

# Or start individually
cd apps/web && bun run dev
cd services/identity && bun run dev
```

## 📦 Services

### Identity Service (Port 3001)

Handles authentication, user management, and sessions.

**Endpoints:**
- `POST /api/auth/register` - User registration
- `POST /api/auth/login` - User login
- `POST /api/auth/logout` - User logout
- `GET /api/auth/verify` - Verify JWT token
- `GET /api/profile` - Get user profiles
- `POST /api/profile` - Create profile

### Catalog Service (Port 3002)

Manages film metadata, genres, and content discovery.

**Endpoints:**
- `GET /api/films` - List all films (paginated)
- `GET /api/films/:id` - Get film details
- `POST /api/films` - Create film (creator/admin)
- `PATCH /api/films/:id` - Update film
- `DELETE /api/films/:id` - Delete film
- `GET /api/genres` - List all genres

### Rights Service (Port 3003)

Controls content availability through window management.

**Endpoints:**
- `GET /api/windows/:filmId` - Get film windows
- `POST /api/windows` - Create window
- `PATCH /api/windows/:id` - Update window
- `GET /api/availability/:filmId` - Check film availability

### Payment Service (Port 3004)

Handles subscriptions, transactions, and billing.

**Endpoints:**
- `POST /api/subscriptions` - Create subscription
- `POST /api/transactions` - Process payment
- `GET /api/subscriptions/:userId` - Get user subscriptions
- `POST /api/coupons/validate` - Validate coupon

### Playback Service (Port 3005)

Issues DRM tokens and manages streaming sessions.

**Endpoints:**
- `POST /api/playback/start` - Start playback session
- `GET /api/playback/token/:filmId` - Get DRM token
- `POST /api/playback/stop` - End playback session

## 🎨 Frontend Applications

### Web App (Port 3000)

Netflix-style streaming interface with:
- Home page with featured content
- Browse by genre
- Film details page
- Video player with HLS support
- My List functionality
- Search
- Multi-profile support

### Creator Portal (Port 3010)

Dashboard for content creators:
- Upload master files
- Set metadata & tags
- Configure windows & pricing
- Track revenue & analytics
- Manage promotional assets

### Admin Console (Port 3020)

Platform management:
- Approve content submissions
- Configure global settings
- Monitor transcoding pipeline
- User management
- System analytics

## 🎬 Video Pipeline

1. **Upload**: Creator uploads master file to S3-compatible storage
2. **Transcoding**: FFmpeg workers create multi-bitrate versions
   - Resolutions: 240p, 360p, 480p, 720p, 1080p, 1440p, 4K
   - Formats: HLS, DASH
3. **Encryption**: Apply DRM (Widevine/FairPlay/PlayReady)
4. **CDN Distribution**: Upload to CDN for global delivery
5. **Thumbnails**: Generate preview thumbnails
6. **Manifest**: Create adaptive streaming manifests

## 🔐 Window Management

THE WANS supports sophisticated release window strategies:

| Window Type | Description | Pricing Model |
|------------|-------------|--------------|
| **Festival** | Film festival exclusive | Free/Ticketed |
| **Cinema** | Theatrical release | N/A |
| **Collector** | Limited NFT editions | Premium |
| **PVOD** | Premium early access | Fixed price |
| **PPV** | Pay-per-view events | Per-view |
| **TVOD** | Rental (48h default) | Rental fee |
| **SVOD** | Subscription access | Monthly/Annual |
| **AVOD** | Ad-supported free | Ad revenue |

## 🌐 Web3 Integrations

### OmniFlix (Cosmos)
- Tokenize select films
- Create NFT editions
- On-chain royalty metadata
- Fan engagement passes

### Vuele (Polkadot)
- Collector window releases
- Festival access passes
- Purchase receipts
- Entitlement mapping

### Flux Network
- Decentralized hosting for frontend
- BFF service deployment
- Geographic distribution

### Akash Network
- Transcoding worker clusters
- API service scaling
- Cost-effective compute

## 💳 Payment Integration

### Supported Providers

- **Stripe** (International)
- **BSP Papua New Guinea**
- **Digicel Mobile Money**
- **Vodafone Cash**

### Subscription Plans

- **Basic**: 1 stream, 1 profile, HD
- **Standard**: 2 streams, 3 profiles, Full HD
- **Premium**: 4 streams, 5 profiles, 4K

## 📊 Royalty Distribution

Automated revenue sharing based on configurable rules:

```
Default Split:
- Producer: 70%
- Distributor: 20%
- Platform: 10%
```

Reports generated per:
- Title
- Window type
- Territory
- Time period

## 🚢 Deployment

### Docker Deployment

```bash
# Build all services
docker-compose build

# Start platform
docker-compose up -d

# View logs
docker-compose logs -f
```

### Flux Network Deployment

```bash
cd infrastructure/flux
./deploy.sh
```

### Akash Network Deployment

```bash
cd infrastructure/akash
./deploy.sh
```

## 🧪 Testing

```bash
# Run all tests
bun run test

# Test specific service
cd services/identity && bun run test

# E2E tests
cd apps/web && bun run test:e2e
```

## 📝 API Documentation

Full API documentation available at:
- Swagger UI: `http://localhost:8000/docs`
- Postman Collection: `./docs/postman-collection.json`

## 🔧 Development Tools

- **Prisma Studio**: `bun run db:studio`
- **Database migrations**: `bun run db:migrate`
- **Linting**: `bun run lint`
- **Type checking**: `bun run type-check`

## 🌍 Environment Variables

### Required

```env
DATABASE_URL=postgresql://...
REDIS_URL=redis://...
JWT_SECRET=...
S3_ACCESS_KEY=...
S3_SECRET_KEY=...
S3_BUCKET=...
CDN_URL=...
```

### Optional (Web3)

```env
OMNIFLIX_API_KEY=...
VUELE_API_KEY=...
FLUX_NODE_URL=...
AKASH_RPC_URL=...
```

## 📚 Documentation

- [Architecture Guide](./docs/architecture.md)
- [API Reference](./docs/api-reference.md)
- [Database Schema](./docs/database-schema.md)
- [Deployment Guide](./docs/deployment.md)
- [Creator Handbook](./docs/creator-handbook.md)
- [Admin Guide](./docs/admin-guide.md)

## 🤝 Contributing

1. Fork the repository
2. Create feature branch (`git checkout -b feature/amazing-feature`)
3. Commit changes (`git commit -m 'Add amazing feature'`)
4. Push to branch (`git push origin feature/amazing-feature`)
5. Open Pull Request

## 📄 License

Proprietary - All Rights Reserved

## 🆘 Support

- Documentation: https://docs.thewans.com
- Email: support@thewans.com
- Discord: https://discord.gg/thewans

---

**Built with ❤️ for Papua New Guinea and the Pacific Region**
