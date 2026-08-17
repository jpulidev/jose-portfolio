/**
 * Lighthouse CI gate.
 *
 * A JS config rather than JSON so these notes can live next to the thresholds —
 * LHCI reads every key in the assertions object as an audit name, so `"//"`
 * comment keys fail as unknown audits.
 */
module.exports = {
  ci: {
    collect: {
      startServerCommand: 'npm run start',
      startServerReadyPattern: 'Ready in',
      url: [
        'http://localhost:3000/',
        'http://localhost:3000/projects',
        'http://localhost:3000/about',
        'http://localhost:3000/cv',
        'http://localhost:3000/contact',
        'http://localhost:3000/projects/kairos',
      ],
      numberOfRuns: 3,
      settings: { preset: 'desktop', chromeFlags: '--no-sandbox' },
    },
    assert: {
      assertions: {
        'categories:performance': ['error', { minScore: 0.95 }],
        'categories:accessibility': ['error', { minScore: 1 }],
        'categories:best-practices': ['error', { minScore: 0.95 }],
        'categories:seo': ['error', { minScore: 1 }],

        // Individual audits for the defects the old site actually shipped.
        'meta-description': 'error',
        'document-title': 'error',
        'html-has-lang': 'error',
        'image-alt': 'error',
        'link-name': 'error',
        'color-contrast': 'error',
        'is-crawlable': 'error',
        'errors-in-console': 'error',
        // The old hero was a 127KB JPEG with no width/height.
        'unsized-images': 'error',

        // Real, but owned by later work — warn so they stay visible without
        // blocking. The JS baseline is the App Router runtime, not app code.
        'unused-javascript': 'warn',
        'legacy-javascript': 'warn',
        'total-byte-weight': 'warn',
        'uses-long-cache-ttl': 'warn',
      },
    },
    upload: { target: 'filesystem', outputDir: '.lighthouseci' },
  },
};
