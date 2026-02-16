'use client';

import { ConvexProvider, ConvexReactClient } from 'convex/react';
import { ReactNode, useEffect, useState } from 'react';

interface Props {
  children: ReactNode;
}

export default function ConvexProviderWrapper({ children }: Props) {
  const [convex, setConvex] = useState<ConvexReactClient | null>(null);

  useEffect(() => {
    // Dynamic import to avoid SSR issues
    import('../lib/convexClient').then((mod) => {
      setConvex(mod.convex);
    });
  }, []);

  if (!convex) {
    return <div className="animate-pulse">Učitavanje...</div>;
  }

  return (
    <ConvexProvider client={convex}>
      {children}
    </ConvexProvider>
  );
}
