import type {NextConfig} from 'next';
import path from 'node:path';
import {fileURLToPath} from 'node:url';

const rootDir = path.dirname(fileURLToPath(import.meta.url));
const repoName = 'test_repo';

const nextConfig: NextConfig = {
  output: 'export',
  basePath: `/${repoName}`,
  assetPrefix: `/${repoName}/`,
  trailingSlash: true,
  images: {
    unoptimized: true,
  },
  turbopack: {
    root: rootDir,
  },
};

export default nextConfig;
