#!/bin/bash

echo "🚀 THE WANS - Deploy to Supabase"
echo "================================="
echo ""

# Check if DATABASE_URL is set
if [ -z "$DATABASE_URL" ]; then
    echo "❌ DATABASE_URL not found in environment"
    echo ""
    echo "Please set it first:"
    echo "export DATABASE_URL='postgresql://postgres:w%40%4091836%21%21@db.yvnkyjnwvylrweyzvibs.supabase.co:5432/postgres'"
    echo ""
    echo "Or use connection pooler:"
    echo "export DATABASE_URL='your-pooler-connection-string'"
    exit 1
fi

echo "📦 Installing dependencies..."
cd packages/database
bun install

echo ""
echo "⚙️  Generating Prisma client..."
bunx prisma generate

echo ""
echo "🗄️  Creating database tables..."
bunx prisma db push

echo ""
echo "✅ Database setup complete!"
echo ""
echo "🧪 Testing connection..."
cd ../..
bun test-supabase-connection.js

echo ""
echo "🎉 All done! You can now start the services:"
echo "   cd services/identity && bun run dev"
echo "   cd apps/web && bun run dev"
