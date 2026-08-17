/**
 * Turning messy CMS strings into stable URL slugs and clean display names.
 *
 * Pure functions with no Sanity dependency, so they are cheap to unit test.
 */

/**
 * URL-safe slug from arbitrary text.
 *
 * Apostrophes are dropped rather than turned into separators, so "Pet's Table"
 * becomes `pets-table` and not `pet-s-table`.
 */
export function slugify(input: string): string {
  return (
    input
      .normalize('NFKD')
      // Strip combining accents left behind by NFKD.
      .replace(/[\u0300-\u036f]/g, '')
      // Apostrophes (straight and curly) vanish instead of becoming separators,
      // so "Pet's Table" is pets-table rather than pet-s-table.
      .replace(/[\u0027\u2019]/g, '')
      .replace(/[^a-zA-Z0-9]+/g, '-')
      .replace(/^-+|-+$/g, '')
      .toLowerCase()
  );
}

export type ParsedName = {
  /** The project name with any credit parenthetical removed. */
  name: string;
  /** Who designed it, when the source name credited someone. */
  designCredit: string | null;
};

/**
 * Splits a raw `works.name` into a display name and a design credit.
 *
 * Several entries embed the credit in the name itself — "Kairos (Design by DBL
 * Media)" — which makes for long, noisy slugs and repeats the same parenthetical
 * across headings. Pulling it out gives clean URLs (`/projects/kairos`) and lets
 * the credit be rendered as its own field.
 */
export function parseProjectName(raw: string | null | undefined): ParsedName {
  const trimmed = (raw ?? '').trim();
  const match = trimmed.match(/\((?:Design(?:ed)? by\s+)?([^)]+)\)/i);
  const name = trimmed.replace(/\s*\([^)]*\)/g, '').trim();
  return {
    name: name || trimmed,
    designCredit: match ? match[1].trim() : null,
  };
}

/**
 * Normalises a tag name for comparison, so near-duplicate CMS entries collapse.
 *
 * The dataset holds separate documents for "React" and "React.js", and for
 * "Node" and "Node.js". Comparing on this key merges them.
 */
export function tagKey(name: string): string {
  return slugify(name.replace(/\.js$/i, ''));
}
