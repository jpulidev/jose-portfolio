import { defineConfig, devices } from '@playwright/test';

/**
 * Browser checks for the two defects the old site actually shipped: horizontal
 * overflow on every page below 400px, and colour pairs that fail WCAG AA.
 *
 * Uses the system Chrome (`channel: 'chrome'`) rather than downloading a
 * browser, so a fresh clone needs no extra 150MB step.
 */
export default defineConfig({
  testDir: './e2e',
  fullyParallel: true,
  reporter: process.env.CI ? 'github' : 'list',
  use: {
    baseURL: 'http://localhost:3000',
    channel: 'chrome',
  },
  projects: [
    {
      name: 'desktop',
      use: { ...devices['Desktop Chrome'], channel: 'chrome' },
    },
  ],
  webServer: {
    command: 'npm run build && npm run start',
    url: 'http://localhost:3000',
    reuseExistingServer: true,
    timeout: 180_000,
  },
});
