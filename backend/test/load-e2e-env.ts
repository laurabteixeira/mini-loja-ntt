import { config } from 'dotenv';
import { existsSync } from 'fs';
import { resolve } from 'path';

export function loadE2eEnv(): void {
  const backendRoot = resolve(__dirname, '..');
  const envPath = resolve(backendRoot, '.env');
  const examplePath = resolve(backendRoot, '.env.example');

  config({ path: existsSync(envPath) ? envPath : examplePath });
}
