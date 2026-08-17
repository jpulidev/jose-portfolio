import { createClient } from 'next-sanity';

/**
 * The dataset is public for reads, so no token is needed at build time and none
 * is ever shipped to the browser. Project id and dataset are public identifiers;
 * they are overridable by env var so a fork or a staging dataset needs no code
 * change.
 */
export const projectId =
  process.env.NEXT_PUBLIC_SANITY_PROJECT_ID ?? 'xom53qc4';
export const dataset = process.env.NEXT_PUBLIC_SANITY_DATASET ?? 'production';
export const apiVersion =
  process.env.NEXT_PUBLIC_SANITY_API_VERSION ?? '2024-10-01';

export const sanityClient = createClient({
  projectId,
  dataset,
  apiVersion,
  // Served from Sanity's CDN; content is fetched at build time and revalidated.
  useCdn: true,
});
