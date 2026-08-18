/**
 * Curated one-line summaries, keyed by project slug.
 *
 * Why these live in code rather than the CMS: the `works` documents mostly had
 * no summary at all, and the eleven that did carried the technology stack as
 * prose — "Wordpress Site", "Shopify Custom Site" — which the "Built with" row
 * already says, and which tells a reader nothing about the business.
 *
 * Precedence in `normalize.ts` is: the CMS `summary` field first, then these,
 * then the legacy `project` field. So filling in a summary in the Studio always
 * wins, and this becomes dead weight to delete once that is done.
 *
 * Every line here was written after loading the live site and reading what the
 * business actually is — checked 17 August 2026. They describe the client and
 * the nature of the build; what Jose specifically did belongs in the case-study
 * fields, which only he can write.
 *
 * Three could not be verified — holy-shakes, muna and shop-immer no longer load
 * and have no Wayback snapshot — so those say only what is on record. Beamena's
 * line comes from Jose's own `beamenaaboutpage` repo.
 */
export const PROJECT_SUMMARIES: Record<string, string> = {
  // --- Recognisable brands -------------------------------------------------
  dewalt:
    'Shopify storefront for DEWALT Workwear UK — the tool brand’s professional clothing and footwear range.',
  supergoop:
    'Shopify storefront for Supergoop!, the prestige skincare brand built entirely around SPF.',
  doen: 'Shopify storefront for DÔEN, the California womenswear label known for its seasonal collections.',
  insidetracker:
    'Shopify store for InsideTracker’s blood-test and membership products, alongside its personalised health platform.',
  neversecond:
    'Shopify storefront for NEVERSECOND, sports-science nutrition for endurance athletes — gels, drinks and fuel bars.',
  'pets-table':
    'Shopify storefront and headless extensions for Pet’s Table, a Mexican subscription service delivering fresh, portioned dog food.',

  // --- DTC and retail ------------------------------------------------------
  chameleon:
    'Shopify storefront for Chameleon Cold-Brew, Austin’s original handcrafted cold-brew coffee.',
  'vital-plan':
    'Shopify store for Vital Plan’s herbal formulations and supplements, with the education content that sells them.',
  nixit:
    'Shopify storefront for nixit, reusable period care and intimacy essentials.',
  'pika-layers':
    'Shopify storefront for PIKA, sensory-friendly bamboo children’s sleepwear in sizes 0–14.',
  'vision-body':
    'Shopify store for Visionbody’s wireless EMS-EMA training system — a considered-purchase build for fitness hardware.',
  luxat: 'Shopify storefront for LUXAT, a handmade design label.',
  'stitched-icons':
    'Shopify storefront for Stitched Icons, embroidered apparel made in the USA. Design by DBL Media.',
  'shop-immer': 'Shopify storefront for Shop Immer. Design by DBL Media.',
  beamena:
    'WordPress site for Beamena, including the about page built with CSS Grid.',

  // --- Services and B2B ----------------------------------------------------
  'concrete-pump-supply':
    'Shopify store for Concrete Pump Supply, selling concrete pumping parts and equipment to trade buyers.',
  'the-barbera':
    'Shopify storefront and booking front end for The Barbera, a Miami barbershop.',
  kairos:
    'WordPress site for Kairos Realty Advisors, a real-estate advisory firm. Design by DBL Media.',
  'quality-lawyers':
    'WordPress site for Quality Lawyers, a boutique law firm working internationally. Design by Testhink.',
  'the-weaver-adjustment-group':
    'WordPress site for The Weaver Adjustment Group, a public insurance adjusting practice.',
  'avila-bistro':
    'WordPress site for Avila Bistro, a Venezuelan restaurant in Aventura, Florida. Design by DBL Media.',
  // ⚠️ These three could not be verified: the sites no longer load and the
  // Wayback Machine has no snapshot. Written from what is actually on record
  // rather than guessed at — replace them with the real thing in the Studio.
  'holy-shakes': 'WordPress build for Holy Shakes.',
  muna: 'WordPress site for Muna — “Humanizing the World of Work.”',

  // --- Product and platform work -------------------------------------------
  upstart13:
    'Headless front end for [up]start.13, which builds custom production AI systems for enterprise clients — React and a headless CMS.',
};

/** The curated line for a slug, if there is one. */
export function curatedSummary(slug: string): string | null {
  return PROJECT_SUMMARIES[slug] ?? null;
}
