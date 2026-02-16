'use client';

import { ConvexProvider } from 'convex/react';
import { convex } from '../lib/convexClient';
import { ReactNode } from 'react';

interface Props {
  children: ReactNode;
}

export default function ConvexWrapper({ children }: Props) {
  return (
    <ConvexProvider client={convex}>
      {children}
    </ConvexProvider>
  );
}
