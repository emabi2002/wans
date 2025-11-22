#!/bin/bash

echo "🚀 THE WANS Platform - Supabase Setup Script"
echo "=============================================="
echo ""

# Check if .env exists
if [ -f .env ]; then
    echo "⚠️  .env file already exists!"
    read -p "Do you want to overwrite it? (y/n) " -n 1 -r
    echo
    if [[ ! $REPLY =~ ^[Yy]$ ]]; then
        echo "❌ Setup cancelled"
        exit 1
    fi
fi

echo "📝 Please provide your Supabase credentials:"
echo ""

# Get Supabase URL
read -p "Enter your Supabase Project URL (https://xxx.supabase.co): " SUPABASE_URL

# Get Database Password
read -sp "Enter your Supabase Database Password: " DB_PASSWORD
echo ""

# Get Supabase Keys
read -p "Enter your Supabase Anon Key: " SUPABASE_ANON_KEY
read -p "Enter your Supabase Service Role Key: " SUPABASE_SERVICE_ROLE_KEY

# Extract project reference from URL
PROJECT_REF=$(echo $SUPABASE_URL | sed 's|https://||' | sed 's|.supabase.co||')

# Create DATABASE_URL
DATABASE_URL="postgresql://postgres:${DB_PASSWORD}@db.${PROJECT_REF}.supabase.co:5432/postgres"

echo ""
echo "✅ Creating .env file..."

# Create .env file
cat > .env << ENVFILE
# Supabase Configuration
DATABASE_URL="${DATABASE_URL}"
SUPABASE_URL="${SUPABASE_URL}"
SUPABASE_ANON_KEY="${SUPABASE_ANON_KEY}"
SUPABASE_SERVICE_ROLE_KEY="${SUPABASE_SERVICE_ROLE_KEY}"

# Redis (local for testing)
REDIS_URL="redis://localhost:6379"

# JWT
JWT_SECRET="$(openssl rand -base64 32)"
JWT_EXPIRES_IN="7d"

# Services
NODE_ENV="development"

# Stripe (add your test keys)
STRIPE_SECRET_KEY="sk_test_..."
STRIPE_PUBLIC_KEY="pk_test_..."

# Storage
S3_BUCKET="films"
CDN_URL="${SUPABASE_URL}/storage/v1/object/public"
ENVFILE

echo "✅ .env file created!"
echo ""
echo "🔄 Setting up database schema..."

# Navigate to database package and run migrations
cd packages/database

# Install dependencies if needed
if [ ! -d "node_modules" ]; then
    echo "📦 Installing Prisma..."
    bun install
fi

# Generate Prisma client
echo "⚙️  Generating Prisma client..."
bunx prisma generate

# Push schema to Supabase
echo "📤 Pushing schema to Supabase..."
bunx prisma db push

echo ""
echo "✅ Database schema created!"
echo ""
echo "🎉 Supabase setup complete!"
echo ""
echo "Next steps:"
echo "1. Start Redis: redis-server"
echo "2. Start services: cd services/identity && bun run dev"
echo "3. Start web app: cd apps/web && bun run dev"
echo ""
echo "📚 Read SUPABASE-SETUP.md for detailed instructions"
