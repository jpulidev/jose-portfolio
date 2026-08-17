import type { Metadata } from 'next';
import { absoluteUrl, site } from './site';

/**
 * Social cards below roughly this width get cropped to a thumbnail or dropped
 * outright by the major platforms, so anything smaller falls back to the
 * generated site card rather than shipping a broken preview. Some project
 * screenshots in the CMS are only 573px wide.
 */
const MIN_SOCIAL_IMAGE_WIDTH = 600;

/** The generated 1200x630 card from app/opengraph-image.tsx. */
const DEFAULT_SOCIAL_IMAGE = '/opengraph-image';

/**
 * Builds page metadata.
 *
 * The old site's empty-title bug is structurally impossible here: the composed
 * string is returned as data, not rendered as a `<title>` child that something
 * else can shadow with an empty one, and Next resolves it on the server so
 * crawlers that don't run JavaScript see it too.
 */
export function pageMetadata({
  title,
  description,
  path,
  image,
  imageWidth,
  routeImage = false,
}: {
  /** Page title without the site suffix. Pass null for the home page. */
  title: string | null;
  description: string;
  /** Site-relative path, used for the canonical URL. */
  path: string;
  /** Page-specific social image. Ignored if narrower than the minimum. */
  image?: string;
  imageWidth?: number;
  /**
   * Set when the route has its own `opengraph-image` file. The `images` key is
   * then omitted entirely so Next's file convention supplies it — setting it
   * here would override the generated card.
   */
  routeImage?: boolean;
}): Metadata {
  // og:title and twitter:title need the full string. The `title` field itself
  // stays bare so the root layout's template appends the site name exactly
  // once — suffixing here as well produced "About — Jose Pulido — Jose Pulido".
  const fullTitle = title ? `${title} — ${site.name}` : site.defaultTitle;
  const canonical = absoluteUrl(path);

  const usePageImage =
    Boolean(image) && (imageWidth ?? 0) >= MIN_SOCIAL_IMAGE_WIDTH;
  // Otherwise set explicitly: the app/opengraph-image.tsx file convention only
  // reaches pages that don't define their own `openGraph`, so /about and
  // /projects were shipping no og:image at all when this was left to cascade.
  const socialImage = usePageImage ? image! : DEFAULT_SOCIAL_IMAGE;
  const images = routeImage ? undefined : [socialImage];

  return {
    // `absolute` bypasses the layout template for the home page, whose title is
    // already the complete string.
    title: title ? title : { absolute: site.defaultTitle },
    description,
    alternates: { canonical },
    openGraph: {
      type: 'website',
      siteName: site.name,
      title: fullTitle,
      description,
      url: canonical,
      locale: 'en_US',
      ...(images ? { images } : {}),
    },
    twitter: {
      card: 'summary_large_image',
      title: fullTitle,
      description,
      creator: '@jpulidev',
      ...(images ? { images } : {}),
    },
  };
}

/** Search engines truncate around here, so there is no value past it. */
const MAX_DESCRIPTION = 200;
/** Below this a description wastes the slot and is worth padding out. */
const MIN_USEFUL_DESCRIPTION = 120;

/**
 * Builds a meta description from a lead sentence plus optional extras.
 *
 * Extras are appended only while the result is still short — a good summary
 * needs no padding, and the earlier version appended unconditionally, which
 * pushed richer summaries past 200 characters once real copy replaced stubs like
 * "Wordpress Site, Real Estate site."
 *
 * Anything still too long is trimmed at a word boundary rather than mid-word.
 */
export function composeDescription(lead: string, ...extras: string[]): string {
  let out = lead.trim();
  for (const extra of extras) {
    const next = extra.trim();
    if (!next) continue;
    if (out.length >= MIN_USEFUL_DESCRIPTION) break;
    out = `${out} ${next}`;
  }
  if (out.length <= MAX_DESCRIPTION) return out;
  const cut = out.slice(0, MAX_DESCRIPTION - 1);
  const lastSpace = cut.lastIndexOf(' ');
  return `${(lastSpace > 60 ? cut.slice(0, lastSpace) : cut).replace(/[,;:.\s]+$/, '')}…`;
}
