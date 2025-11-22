# 🚀 Quick Start with Supabase (5 Minutes)

Perfect for testing THE WANS platform before production!

---

## ⚡ Super Fast Setup (3 Steps)

### 1️⃣ Create Supabase Project (2 min)

1. Go to **https://supabase.com** → Sign in with GitHub
2. Click **"New Project"**
3. Fill in:
   - Name: `the-wans-platform`
   - Password: (create strong password - **save this!**)
   - Region: `Southeast Asia (Singapore)` (closest to PNG)
   - Plan: **Free**
4. Click **"Create new project"** → Wait 2 minutes

---

### 2️⃣ Get Your Credentials (1 min)

In your Supabase dashboard:

**A. Get Database URL:**
1. Settings (⚙️) → **Database** → **Connection String**
2. Copy the **URI** string
3. Replace `[YOUR-PASSWORD]` with your password from Step 1

**B. Get API Keys:**
1. Settings (⚙️) → **API**
2. Copy:
   - **Project URL**
   - **anon public** key
   - **service_role** key (keep secret!)

---

### 3️⃣ Run Setup Script (2 min)

```bash
cd the-wans
./setup-supabase.sh
```

**Or manually create `.env`:**

```bash
# Copy template
cp .env.supabase.example .env

# Edit with your credentials
nano .env
```

Add your Supabase credentials:
```env
DATABASE_URL="postgresql://postgres:YOUR_PASSWORD@db.xxx.supabase.co:5432/postgres"
SUPABASE_URL="https://xxx.supabase.co"
SUPABASE_ANON_KEY="eyJhbGci..."
SUPABASE_SERVICE_ROLE_KEY="eyJhbGci..."
```

---

## ✅ Test Your Setup

```bash
# Test database connection
bun test-supabase-connection.js
```

You should see:
```
🧪 Testing Supabase Connection...

1️⃣  Testing database connection...
   ✅ Connected to Supabase PostgreSQL!

2️⃣  Checking database tables...
   ✅ Found 20+ tables

🎉 All tests passed! Supabase is ready to use.
```

---

## 🎮 Start Testing THE WANS

### Option 1: Start Single Service

```bash
# Terminal 1 - Identity Service
cd services/identity
bun run dev

# Terminal 2 - Web App
cd apps/web
bun run dev
```

Visit: **http://localhost:3000**

### Option 2: Start All Services

```bash
# Start each service in separate terminals
cd services/identity && bun run dev      # Port 3001
cd services/catalog && bun run dev       # Port 3002
cd services/rights && bun run dev        # Port 3003
cd services/payment && bun run dev       # Port 3004
cd services/playback && bun run dev      # Port 3005
cd services/transcoding && bun run dev   # Port 3006

# Frontend apps
cd apps/web && bun run dev               # Port 3000
cd apps/creator && bun run dev           # Port 3010
cd apps/admin && bun run dev             # Port 3020
```

---

## 📊 View Your Data

### Prisma Studio (Visual Database Editor)

```bash
cd packages/database
bunx prisma studio
```

Opens: **http://localhost:5555**

You can:
- ✅ View all tables
- ✅ Add test data
- ✅ Edit records
- ✅ Run queries

### Supabase Dashboard

1. Go to your Supabase project
2. Click **"Table Editor"**
3. See all your tables:
   - User, Profile, Film, Genre
   - Window, Subscription, Transaction
   - And 13+ more!

---

## 🧪 Test API Endpoints

### Register a User

```bash
curl -X POST http://localhost:3001/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "email": "test@thewans.com",
    "name": "Test User",
    "password": "password123"
  }'
```

### Login

```bash
curl -X POST http://localhost:3001/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "test@thewans.com",
    "password": "password123"
  }'
```

Save the `token` from the response!

### Create a Film

```bash
curl -X POST http://localhost:3002/api/films \
  -H "Content-Type: application/json" \
  -H "x-user-id: YOUR_USER_ID" \
  -d '{
    "title": "My First Film",
    "description": "A test film",
    "runtime": 120,
    "genres": ["Action", "Drama"]
  }'
```

---

## 📦 What's Using Supabase?

✅ **PostgreSQL Database** - All data
✅ **Storage** - Film uploads (optional)
✅ **Authentication** - Can replace Identity Service (optional)

---

## 💰 Supabase Free Tier

Perfect for testing:
- ✅ 500MB database (enough for 1000+ films metadata)
- ✅ 1GB file storage
- ✅ 50K monthly active users
- ✅ 2GB bandwidth
- ✅ Automatic daily backups

**Upgrade when ready:**
- **Pro**: $25/month (8GB database, 100GB storage)
- **Team**: $599/month (production-ready)

---

## 🔧 Troubleshooting

### Can't connect to database?

```bash
# Check your DATABASE_URL
echo $DATABASE_URL

# Test Prisma connection
cd packages/database
bunx prisma db pull
```

### Tables not created?

```bash
cd packages/database
bunx prisma db push --force-reset
```

### Need fresh start?

1. Supabase dashboard → Settings → Database
2. Click **"Reset database"**
3. Run setup script again

---

## 📚 Full Documentation

- **Detailed Guide**: `SUPABASE-SETUP.md`
- **Platform Overview**: `README.md`
- **Complete Features**: `IMPLEMENTATION-COMPLETE.md`
- **Architecture**: `docs/architecture.md`

---

## 🎯 Next Steps

### For Testing:
1. ✅ Set up Supabase (you just did!)
2. ⏭️ Add Stripe test keys
3. ⏭️ Upload sample film data
4. ⏭️ Test full user journey

### For Production:
1. ⏭️ Upgrade to Supabase Pro
2. ⏭️ Add custom domain
3. ⏭️ Configure CDN
4. ⏭️ Set up monitoring

---

## 💡 Pro Tips

1. **Use Prisma Studio** for easy data management
2. **Enable Row Level Security** in Supabase for production
3. **Set up backups** before major changes
4. **Monitor query performance** in Supabase dashboard
5. **Use Supabase Storage** for film uploads

---

**🎉 You're ready to test THE WANS platform!**

Questions? Check `SUPABASE-SETUP.md` for detailed instructions.
