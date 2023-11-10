import { defineConfig } from 'vitest/config';

export default defineConfig({
  test: {
    globals: true,
    root: './',
    include: ['**/*.e2e-spec.ts', '**/*.spec.ts'],
    coverage: {
      provider: 'istanbul',
      reporter: ['text', 'json', 'html', 'lcov'],
      reportsDirectory: './coverage'
    }
  },
  plugins: [
    {
      name: 'setup-database',
      config: () => ({
        test: {
          setupFiles: ['./test/setup-database.ts']
        }
      })
    }
  ]
});
