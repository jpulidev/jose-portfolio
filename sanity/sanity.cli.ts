import { defineCliConfig } from 'sanity/cli';

export default defineCliConfig({
  api: {
    projectId: 'xom53qc4',
    dataset: 'production',
  },
  deployment: {
    // Studio is deployed separately from the site; the site only reads the API.
    autoUpdates: true,
  },
});
