import { defineProject } from '@bemedev/dev-utils/vitest-extended';

export default defineProject({
  test: {
    name: '__tests__/core',
    logHeapUsage: true,
    globals: true,
    typecheck: { enabled: true, ignoreSourceErrors: false },
    env: { NODE_ENV: 'test' },
  },
});
