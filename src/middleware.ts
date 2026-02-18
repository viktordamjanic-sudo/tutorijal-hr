import { clerkMiddleware, createRouteMatcher } from '@clerk/astro/server';

const isProtectedRoute = createRouteMatcher([
  '/profil(.*)',
  '/dashboard(.*)',
  '/api/protected(.*)',
]);

export const onRequest = clerkMiddleware((auth, context, next) => {
  const authObject = auth();
  
  if (isProtectedRoute(context.request)) {
    if (!authObject.userId) {
      return new Response(null, {
        status: 302,
        headers: {
          'Location': '/sign-in',
        },
      });
    }
  }
  
  return next();
});
