import { createEnv } from '@t3-oss/env-nextjs';
import { z } from 'zod';

// the type of environment that the app is running in
const envType = createEnv({
  client: {
    NEXT_PUBLIC_VERCEL_ENV: z
      .enum(['development', 'preview', 'production'])
      .default('development'),
  },
  runtimeEnv: {
    NEXT_PUBLIC_VERCEL_ENV: process.env.NEXT_PUBLIC_VERCEL_ENV,
  },
});

export default envType;
