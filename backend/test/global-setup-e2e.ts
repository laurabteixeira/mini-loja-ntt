import { execSync } from 'child_process';
import { resolve } from 'path';
import { loadE2eEnv } from './load-e2e-env';

export default async function globalSetup() {
  loadE2eEnv();

  const backendRoot = resolve(__dirname, '..');

  execSync('npx prisma migrate deploy', {
    cwd: backendRoot,
    env: process.env,
    stdio: 'inherit',
  });
}
