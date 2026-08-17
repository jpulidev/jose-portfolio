import { defineConfig } from 'sanity';
import { structureTool } from 'sanity/structure';
import { visionTool } from '@sanity/vision';
import { schemaTypes } from './schemas';

/**
 * Studio configuration.
 *
 * Replaces the 2020-era `sanity.json` + `config/` + `parts` setup, which the
 * modern Studio no longer supports at all. Same project and dataset, so all
 * existing content is untouched — only the editing interface changed.
 */
export default defineConfig({
  name: 'default',
  title: 'jpulidev.com',

  projectId: 'xom53qc4',
  dataset: 'production',

  plugins: [structureTool(), visionTool()],

  schema: {
    types: schemaTypes,
  },
});
