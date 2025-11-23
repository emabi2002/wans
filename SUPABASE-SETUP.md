# 🚀 THE WANS Platform - Supabase Setup Guide

## Why Supabase for Testing?

Supabase is **perfect** for testing THE WANS platform because it provides:

✅ **Free PostgreSQL Database** - Up to 500MB (plenty for testing)
✅ **Built-in Authentication** - Can integrate with Identity Service
✅ **Storage Buckets** - For film uploads and assets
✅ **Real-time subscriptions** - For live updates
✅ **Automatic backups** - Daily backups
✅ **Easy migration to production** - Scale when ready

**Free Tier Includes:**
- 500MB database space
- 1GB file storage
- 50,000 monthly active users
- 2GB bandwidth

Perfect for testing! 🎉

---

## 📝 Step-by-Step Setup

### Step 1: Create Supabase Project

1. Go to **https://supabase.com**
2. Click **"Start your project"**
3. Sign in with GitHub (use your account: emabi2002)
4. Click **"New Project"**
5. Fill in:
   - **Project Name**: `the-wans-platform`
   - **Database Password**: Create a strong password (save this!)
   - **Region**: Choose closest to PNG (e.g., `Southeast Asia (Singapore)`)
   - **Pricing Plan**: Free

6. Click **"Create new project"**
7. Wait 2 minutes for setup to complete

---

### Step 2: Get Your Database Connection String

1. In your Supabase project dashboard, click **"Project Settings"** (gear icon)
2. Click **"Database"** in the left sidebar
3. Scroll to **"Connection string"**
4. Copy the **"URI"** connection string

It looks like:
```
postgresql://postgres:[YOUR-PASSWORD]@db.xxxxxxxxxxxx.supabase.co:5432/postgres
```

**Important:** Replace `[YOUR-PASSWORD]` with the password you created in Step 1.

---

### Step 3: Update Environment Variables

Open your `.env` file in the `the-wans` folder and update:

```bash
# Replace with your Supabase connection string
DATABASE_URL="postgresql://postgres:YOUR_PASSWORD@db.xxxxxxxxxxxx.supabase.co:5432/postgres"

# Supabase Project Settings
SUPABASE_URL="https://xxxxxxxxxxxx.supabase.co"
SUPABASE_ANON_KEY="your-anon-key"
SUPABASE_SERVICE_ROLE_KEY="your-service-role-key"

# Redis (for testing, use local or Upstash free tier)
REDIS_URL="redis://localhost:6379"

# JWT Secret
JWT_SECRET="your-super-secret-jwt-key-change-this"

# For testing, use these placeholders:
STRIPE_SECRET_KEY="sk_test_..."  # Get from Stripe Dashboard
S3_BUCKET="thewans-test"
CDN_URL="http://localhost:9000"
```

**To get Supabase keys:**
1. In Supabase dashboard, go to **"Project Settings"** → **"API"**
2. Copy **"Project URL"** → Use as `SUPABASE_URL`
3. Copy **"anon public"** → Use as `SUPABASE_ANON_KEY`
4. Copy **"service_role"** → Use as `SUPABASE_SERVICE_ROLE_KEY`

---

### Step 4: Run Database Migrations

Now let's create all the tables in your Supabase database:

```bash
# Navigate to database package
cd the-wans/packages/database

# Generate Prisma client
bunx prisma generate

# Push schema to Supabase (this creates all tables)
bunx prisma db push

# Optional: Seed with sample data
bunx prisma db seed
```

This will create **20+ tables** in your Supabase PostgreSQL:
- users, profiles, sessions, devices
- films, genres, film_assets
- windows, subscriptions, transactions
- playback_logs, watch_history
- And more!

---

### Step 5: Verify Database Setup

1. Go to your Supabase dashboard
2. Click **"Table Editor"** in the left sidebar
3. You should see all tables:
   - ✅ User
   - ✅ Profile
   - ✅ Film
   - ✅ Genre
   - ✅ Window
   - ✅ Subscription
   - ✅ Transaction
   - And 13+ more tables

---

### Step 6: Set Up Supabase Storage (for Film Uploads)

1. In Supabase dashboard, click **"Storage"**
2. Click **"Create a new bucket"**
3. Create these buckets:
   - **Name**: `films` (for master video files)
   - **Public**: No (keep private)
   - Click **"Create bucket"**

4. Create another bucket:
   - **Name**: `assets` (for posters, trailers)
   - **Public**: Yes (for CDN delivery)
   - Click **"Create bucket"**

5. Create policies for uploads:
   - Select `films` bucket → **"Policies"** tab
   - Add policy: Allow authenticated users to upload

---

### Step 7: Optional - Use Supabase Auth (Instead of Custom JWT)

Supabase has built-in authentication. You can either:

**Option A: Keep Custom JWT** (what we built)
- Use the Identity Service as-is
- More flexible and custom

**Option B: Use Supabase Auth** (simpler for testing)
- Replace Identity Service with Supabase Auth
- Less code to maintain
- Built-in email verification, OAuth

For **testing**, I recommend **Option A** (custom JWT) to test all your services.

For **production**, you could migrate to Supabase Auth.

---

## 🧪 Testing Your Setup

### Test 1: Check Database Connection

```bash
cd the-wans/packages/database
bunx prisma studio
```

This opens a web interface at `http://localhost:5555` where you can:
- View all tables
- Add test data
- Query the database

### Test 2: Start Identity Service

```bash
cd the-wans/services/identity
bun run dev
```

Open another terminal and test:
```bash
# Register a user
curl -X POST http://localhost:3001/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "email": "test@thewans.com",
    "name": "Test User",
    "password": "password123"
  }'
```

You should get a success response with a JWT token!

### Test 3: Check Supabase Dashboard

1. Go to Supabase → **"Table Editor"** → **"User"** table
2. You should see your test user!

---

## 🚀 Full System Test with Supabase

### Start All Services

```bash
# Terminal 1 - Identity Service
cd the-wans/services/identity
DATABASE_URL="your-supabase-url" bun run dev

# Terminal 2 - Catalog Service
cd the-wans/services/catalog
DATABASE_URL="your-supabase-url" bun run dev

# Terminal 3 - Rights Service
cd the-wans/services/rights
DATABASE_URL="your-supabase-url" bun run dev

# Terminal 4 - Payment Service
cd the-wans/services/payment
DATABASE_URL="your-supabase-url" bun run dev

# Terminal 5 - Web App
cd the-wans/apps/web
bun run dev
```

Now visit: **http://localhost:3000**

---

## 📦 Alternative: Use Docker with Supabase

If you prefer Docker, update `docker-compose.yml`:

```yaml
# Comment out the local PostgreSQL service
# postgres:
#   image: postgres:15-alpine
#   ...

# Update all services to use Supabase
services:
  identity-service:
    environment:
      DATABASE_URL: ${DATABASE_URL}  # Your Supabase URL
```

Then:
```bash
cd the-wans
echo "DATABASE_URL=postgresql://postgres:password@db.xxx.supabase.co:5432/postgres" > .env
docker-compose up -d
```

---

## 💡 Supabase Features You Can Use

### 1. **Database** ✅ Primary
- PostgreSQL 15
- Row Level Security (RLS)
- Real-time subscriptions
- Database webhooks

### 2. **Storage** ✅ For Film Files
- S3-compatible API
- CDN delivery
- Image transformations
- Video streaming

**Update transcoding service:**
```typescript
// Instead of AWS S3, use Supabase Storage
import { createClient } from '@supabase/supabase-js'

const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
)

// Upload transcoded video
const { data, error } = await supabase.storage
  .from('films')
  .upload(`${filmId}/1080p.mp4`, videoFile)
```

### 3. **Authentication** (Optional)
- Email/password
- OAuth (Google, GitHub, etc.)
- Magic links
- Phone auth

### 4. **Edge Functions** (Optional)
- Deploy serverless functions
- Process webhooks
- Run background jobs

### 5. **Realtime** (Optional)
- Live viewer counts
- Real-time notifications
- Chat features

---

## 🔄 Migration Path

### Phase 1: Testing (Now)
```
✅ Supabase PostgreSQL (Free)
✅ Local Redis
✅ Local file storage
✅ Stripe Test Mode
```

### Phase 2: Pre-Production
```
✅ Supabase Pro ($25/month)
✅ Upstash Redis (Free)
✅ Supabase Storage
✅ Stripe Test Mode
```

### Phase 3: Production
```
✅ Supabase Pro + Add-ons
✅ Redis Cloud
✅ CDN (Cloudflare)
✅ Stripe Live Mode
```

---

## 📊 Supabase vs Self-Hosted PostgreSQL

| Feature | Supabase (Free) | Self-Hosted |
|---------|----------------|-------------|
| Setup Time | 2 minutes | 30+ minutes |
| Cost | Free | $5-20/month |
| Backups | Automatic | Manual |
| Scaling | Easy | Complex |
| Storage | 500MB | Unlimited |
| Best For | Testing | Production |

---

## 🛠️ Troubleshooting

### Connection Error?
```bash
# Test connection
bunx prisma db push
```

If error:
1. Check your DATABASE_URL is correct
2. Verify password has no special characters (or URL-encode them)
3. Check Supabase project is "Active" (green status)

### Tables Not Created?
```bash
# Force push schema
bunx prisma db push --force-reset
```

### Need to Reset Database?
1. Supabase dashboard → Settings → Database
2. Scroll to "Reset database password"
3. Or create a new project

---

## 📝 Quick Reference

### Supabase URLs:
- **Dashboard**: https://app.supabase.com
- **Documentation**: https://supabase.com/docs
- **Status**: https://status.supabase.com

### Connection Info:
```bash
# Database URL
postgresql://postgres:[PASSWORD]@db.[PROJECT-REF].supabase.co:5432/postgres

# Supabase URL
https://[PROJECT-REF].supabase.co

# Storage URL
https://[PROJECT-REF].supabase.co/storage/v1
```

### Useful Commands:
```bash
# View database in browser
bunx prisma studio

# Push schema changes
bunx prisma db push

# Generate Prisma client
bunx prisma generate

# Check connection
bunx prisma db pull
```

---

## 🎯 Next Steps After Supabase Setup

1. ✅ Set up Supabase project
2. ✅ Connect database
3. ✅ Run migrations
4. ⏭️ Set up Redis (Upstash free tier)
5. ⏭️ Configure Stripe test keys
6. ⏭️ Test all services
7. ⏭️ Add sample film data
8. ⏭️ Test full user flow

---

## 💰 Supabase Pricing (When You're Ready)

| Plan | Price | Database | Storage | Bandwidth |
|------|-------|----------|---------|-----------|
| **Free** | $0 | 500MB | 1GB | 2GB |
| **Pro** | $25/mo | 8GB | 100GB | 250GB |
| **Team** | $599/mo | 32GB | 200GB | Unlimited |

For testing: **Free** is perfect
For 1K-10K users: **Pro** is ideal
For 10K+ users: **Team** or custom

---

**🎉 You're all set! Supabase is the perfect testing environment for THE WANS platform.**

Need help? Check the docs or reach out!
