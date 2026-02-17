'use client';

import { ClerkProvider } from '@clerk/astro/react';
import { ConvexProvider, ConvexReactClient } from 'convex/react';
import { ReactNode, useEffect, useState } from 'react';

interface Props {
  children: ReactNode;
}

export default function AppProviders({ children }: Props) {
  const [convex, setConvex] = useState<ConvexReactClient | null>(null);

  useEffect(() => {
    import('../lib/convexClient').then((mod) => {
      setConvex(mod.convex);
    });
  }, []);

  if (!convex) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <ClerkProvider>
      <ConvexProvider client={convex}>
        {children}
      </ConvexProvider>
    </ClerkProvider>
  );
}
