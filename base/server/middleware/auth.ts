import { defineEventHandler, getHeader, H3Event } from 'h3'
import jwt from 'jsonwebtoken'

const publicPaths = [
    '/api/auth/login',
    '/api/auth/login-check',
    '/api/courses',
    '/api/environment',
    '/api/exams',
    '/api/institutions',
    '/api/programs',
    '/api/support',
    '/api/impairments',
    '/api/verifiable-presentation',
    '/api/_',
    '/api/images',
];

const protectedPaths = [
    '/api/support/add',
    '/api/support/add-check',
];

// Function to verify JWT
const verifyToken = (event: H3Event) => {
  const config = useRuntimeConfig();

  if (config.public.appType === 'registration') {
    // This app uses legacy digid test log in and needs to issue credentials
    // without JWT authentication.
    return;
  }

  if (config.public.appType === 'portal') {
    // This app only issues credentials with authorization code flow.
    return;
  }
  
  if (!event.path.startsWith('/api')) {
    // Pages have their own middleware.
    return;
  }

  if (publicPaths.some(p => event.path.startsWith(p)) && !protectedPaths.some(p => event.path.startsWith(p))) {
    // Endpoints for static insensitive data and logging in
    return;
  }

  const authHeader = getHeader(event, 'authorization');

  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    throw createError({
        statusCode: 401,
        statusMessage: 'Unauthorized',
    });
  }

  const token = authHeader.split(' ')[1];

  try {
    return jwt.verify(token, process.env.JWT_SECRET || 'wrong-key');
  } catch (err) {
    throw createError({
        statusCode: 403,
        statusMessage: 'Forbidden',
    })
  }
}

// Middleware to protect routes
export default defineEventHandler(async (event) => {
  event.context.auth = verifyToken(event);
})
