// Convex client setup - runs only in browser
import { ConvexReactClient } from 'convex/react';

// Production URL from Convex deployment
const CONVEX_URL = 'https://efficient-antelope-653.convex.cloud';

export const convex = new ConvexReactClient(CONVEX_URL);
