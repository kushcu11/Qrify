import { config } from 'dotenv';
config();

import '@/ai/flows/enhance-redirect-flow.ts';
import '@/ai/flows/generate-qr-code-flow.ts';
import '@/ai/flows/validate-redirect-url-flow.ts';