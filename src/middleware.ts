import { clerkMiddleware, createRouteMatcher } from '@clerk/astro/server';

const isProtectedRoute = createRouteMatcher([
  '/dashboard(.*)',
  '/api/protected(.*)',
]);

export const onRequest = clerkMiddleware(async (auth, context, next) => {
  // Protect specific routes
  if (isProtectedRoute(context.request)) {
    const authObject = auth();
    if (!authObject.userId) {
      return new Response(null, {
        status: 302,
        headers: { 'Location': '/sign-in' },
      });
    }
  }
  
  return next();
});
