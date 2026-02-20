import path from 'path';
import { defineConfig, loadEnv, type Plugin } from 'vite';
import react from '@vitejs/plugin-react';

const dsRoot = path.resolve(__dirname, 'node_modules/mtr-design-system');

function mtrDesignSystemResolver(): Plugin {
  return {
    name: 'mtr-design-system-resolver',
    enforce: 'pre',
    resolveId(source, importer) {
      if (importer && importer.includes('mtr-design-system') && source.startsWith('@/')) {
        return path.join(dsRoot, source.slice(2));
      }
      return null;
    },
  };
}

export default defineConfig(({ mode }) => {
    const env = loadEnv(mode, '.', '');
    return {
      server: {
        port: 3000,
        host: 'localhost',
      },
      plugins: [mtrDesignSystemResolver(), react()],
      define: {
        'process.env.API_KEY': JSON.stringify(env.GEMINI_API_KEY),
        'process.env.GEMINI_API_KEY': JSON.stringify(env.GEMINI_API_KEY)
      },
      optimizeDeps: {
        exclude: ['mtr-design-system'],
      },
      resolve: {
        alias: [
          { find: 'next/link', replacement: path.resolve(__dirname, 'shims/next-link.tsx') },
          { find: '@/styles', replacement: path.resolve(dsRoot, 'styles') },
          { find: '@/components', replacement: path.resolve(dsRoot, 'components') },
        ]
      }
    };
});
