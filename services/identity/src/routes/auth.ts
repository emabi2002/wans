import express from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { prisma } from '@the-wans/database';
import { loginSchema, registerSchema } from '@the-wans/shared';
import { createSuccessResponse, createErrorResponse } from '@the-wans/shared';

const router = express.Router();
const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key-change-in-production';
const JWT_EXPIRES_IN = '7d';

// Register
router.post('/register', async (req, res, next) => {
  try {
    const validatedData = registerSchema.parse(req.body);

    // Check if user exists
    const existingUser = await prisma.user.findUnique({
      where: { email: validatedData.email },
    });

    if (existingUser) {
      return res.status(400).json(
        createErrorResponse('USER_EXISTS', 'User with this email already exists')
      );
    }

    // Hash password
    const passwordHash = await bcrypt.hash(validatedData.password, 12);

    // Create user
    const user = await prisma.user.create({
      data: {
        email: validatedData.email,
        name: validatedData.name,
        phone: validatedData.phone,
        passwordHash,
        role: validatedData.role || 'VIEWER',
      },
      select: {
        id: true,
        email: true,
        name: true,
        role: true,
        createdAt: true,
      },
    });

    // Create default profile
    await prisma.profile.create({
      data: {
        userId: user.id,
        name: validatedData.name,
      },
    });

    // Generate JWT
    const token = jwt.sign(
      { userId: user.id, email: user.email, role: user.role },
      JWT_SECRET,
      { expiresIn: JWT_EXPIRES_IN }
    );

    // Create session
    const session = await prisma.session.create({
      data: {
        userId: user.id,
        token,
        expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), // 7 days
      },
    });

    res.status(201).json(
      createSuccessResponse({
        user,
        token,
        sessionId: session.id,
      })
    );
  } catch (error: any) {
    if (error.name === 'ZodError') {
      return res.status(400).json(
        createErrorResponse('VALIDATION_ERROR', 'Invalid input data', error.errors)
      );
    }
    next(error);
  }
});

// Login
router.post('/login', async (req, res, next) => {
  try {
    const validatedData = loginSchema.parse(req.body);

    // Find user
    const user = await prisma.user.findUnique({
      where: { email: validatedData.email },
    });

    if (!user) {
      return res.status(401).json(
        createErrorResponse('INVALID_CREDENTIALS', 'Invalid email or password')
      );
    }

    // Verify password
    const isValidPassword = await bcrypt.compare(
      validatedData.password,
      user.passwordHash
    );

    if (!isValidPassword) {
      return res.status(401).json(
        createErrorResponse('INVALID_CREDENTIALS', 'Invalid email or password')
      );
    }

    // Generate JWT
    const token = jwt.sign(
      { userId: user.id, email: user.email, role: user.role },
      JWT_SECRET,
      { expiresIn: JWT_EXPIRES_IN }
    );

    // Create session
    const session = await prisma.session.create({
      data: {
        userId: user.id,
        token,
        expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
        ipAddress: req.ip,
        userAgent: req.get('user-agent'),
      },
    });

    // Update last login
    await prisma.user.update({
      where: { id: user.id },
      data: { lastLoginAt: new Date() },
    });

    res.json(
      createSuccessResponse({
        user: {
          id: user.id,
          email: user.email,
          name: user.name,
          role: user.role,
        },
        token,
        sessionId: session.id,
      })
    );
  } catch (error: any) {
    if (error.name === 'ZodError') {
      return res.status(400).json(
        createErrorResponse('VALIDATION_ERROR', 'Invalid input data', error.errors)
      );
    }
    next(error);
  }
});

// Logout
router.post('/logout', async (req, res, next) => {
  try {
    const token = req.headers.authorization?.replace('Bearer ', '');

    if (!token) {
      return res.status(401).json(
        createErrorResponse('UNAUTHORIZED', 'No token provided')
      );
    }

    // Delete session
    await prisma.session.deleteMany({
      where: { token },
    });

    res.json(createSuccessResponse({ message: 'Logged out successfully' }));
  } catch (error) {
    next(error);
  }
});

// Verify token
router.get('/verify', async (req, res, next) => {
  try {
    const token = req.headers.authorization?.replace('Bearer ', '');

    if (!token) {
      return res.status(401).json(
        createErrorResponse('UNAUTHORIZED', 'No token provided')
      );
    }

    // Verify JWT
    const decoded = jwt.verify(token, JWT_SECRET) as any;

    // Check session
    const session = await prisma.session.findUnique({
      where: { token },
      include: { user: true },
    });

    if (!session || session.expiresAt < new Date()) {
      return res.status(401).json(
        createErrorResponse('UNAUTHORIZED', 'Invalid or expired token')
      );
    }

    res.json(
      createSuccessResponse({
        user: {
          id: session.user.id,
          email: session.user.email,
          name: session.user.name,
          role: session.user.role,
        },
      })
    );
  } catch (error: any) {
    if (error.name === 'JsonWebTokenError') {
      return res.status(401).json(
        createErrorResponse('UNAUTHORIZED', 'Invalid token')
      );
    }
    next(error);
  }
});

export default router;
