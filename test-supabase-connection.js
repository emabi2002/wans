#!/usr/bin/env bun

/**
 * Test Supabase Connection
 * Run with: bun test-supabase-connection.js
 */

import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function testConnection() {
  console.log('🧪 Testing Supabase Connection...\n');

  try {
    // Test 1: Database Connection
    console.log('1️⃣  Testing database connection...');
    await prisma.$connect();
    console.log('   ✅ Connected to Supabase PostgreSQL!\n');

    // Test 2: Query Tables
    console.log('2️⃣  Checking database tables...');
    const tables = await prisma.$queryRaw`
      SELECT table_name 
      FROM information_schema.tables 
      WHERE table_schema = 'public'
      ORDER BY table_name;
    `;
    console.log(`   ✅ Found ${tables.length} tables:\n`);
    tables.forEach((table, i) => {
      console.log(`      ${i + 1}. ${table.table_name}`);
    });
    console.log('');

    // Test 3: Create Test User
    console.log('3️⃣  Creating test user...');
    const testUser = await prisma.user.create({
      data: {
        email: 'test@thewans.com',
        name: 'Test User',
        passwordHash: 'hashed_password_here',
        role: 'VIEWER',
      },
    });
    console.log(`   ✅ Created user: ${testUser.email} (ID: ${testUser.id})\n`);

    // Test 4: Create Test Profile
    console.log('4️⃣  Creating test profile...');
    const testProfile = await prisma.profile.create({
      data: {
        userId: testUser.id,
        name: 'My Profile',
      },
    });
    console.log(`   ✅ Created profile: ${testProfile.name} (ID: ${testProfile.id})\n`);

    // Test 5: Query User with Profile
    console.log('5️⃣  Querying user with profile...');
    const userWithProfile = await prisma.user.findUnique({
      where: { id: testUser.id },
      include: { profiles: true },
    });
    console.log(`   ✅ User: ${userWithProfile.name}`);
    console.log(`      Profiles: ${userWithProfile.profiles.length}\n`);

    // Test 6: Clean Up
    console.log('6️⃣  Cleaning up test data...');
    await prisma.profile.delete({ where: { id: testProfile.id } });
    await prisma.user.delete({ where: { id: testUser.id } });
    console.log('   ✅ Test data removed\n');

    console.log('🎉 All tests passed! Supabase is ready to use.\n');
    console.log('Next steps:');
    console.log('  1. Start Identity Service: cd services/identity && bun run dev');
    console.log('  2. Start Web App: cd apps/web && bun run dev');
    console.log('  3. Visit: http://localhost:3000\n');

  } catch (error) {
    console.error('❌ Error:', error.message);
    console.error('\nTroubleshooting:');
    console.error('  1. Check DATABASE_URL in .env file');
    console.error('  2. Verify Supabase project is active');
    console.error('  3. Run: bunx prisma db push');
    process.exit(1);
  } finally {
    await prisma.$disconnect();
  }
}

testConnection();
