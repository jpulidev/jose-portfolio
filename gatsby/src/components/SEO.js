import { graphql, useStaticQuery } from 'gatsby';
import React from 'react';
import { Helmet } from 'react-helmet';

/**
 * Page metadata.
 *
 * Pass the page title as the `title` PROP, never as a `<title>` child. Titles
 * used to be passed as children while this component also rendered its own
 * `<title>{title}</title>` with `title` undefined — the empty one won, so the
 * home page shipped an empty <title>, og:title and og:description. React
 * repaired the title on hydration, which hid the bug in the browser while
 * crawlers that don't run JS (LinkedIn, WhatsApp, Slack, X) saw nothing.
 *
 * The full title string is now built here in JS, so an empty one is not
 * representable.
 */
/**
 * Turns a page path into the exact path the canonical tag should declare.
 *
 * Two things have to hold or the tag does more harm than none at all:
 *
 *  - Trailing slash. Gatsby serves directory URLs with one. A pathname that
 *    arrives without it would declare a canonical that disagrees with the URL
 *    actually being served — a self-inflicted duplicate-content signal.
 *  - Percent-encoding. Some generated paths contain spaces ("Headless CMS"),
 *    and a canonical with a raw space is not a valid URL. Each segment is
 *    decoded before being re-encoded, so this is correct whether the path
 *    arrives raw (as it does during SSR) or already encoded (as
 *    location.pathname gives it in the browser) — no double-encoding either way.
 */
function canonicalPath(path) {
  if (!path) return '/';
  const encoded = path
    .split('/')
    .map((segment) => {
      try {
        return encodeURIComponent(decodeURIComponent(segment));
      } catch (e) {
        // Malformed percent-sequence — encode as-is rather than throw.
        return encodeURIComponent(segment);
      }
    })
    .join('/');
  return encoded.endsWith('/') ? encoded : `${encoded}/`;
}

export default function SEO({
  children,
  pathname,
  location,
  description,
  title,
  image,
}) {
  const { site } = useStaticQuery(graphql`
    query {
      site {
        siteMetadata {
          title
          defaultTitle
          siteUrl
          description
          twitter
          image
        }
      }
    }
  `);

  const meta = site.siteMetadata;

  // A page title always resolves to a non-empty string.
  const fullTitle = title ? `${title} — ${meta.title}` : meta.defaultTitle;
  const metaDescription = description || meta.description;

  // Social crawlers reject relative paths, so every URL here is absolute.
  const path = pathname || (location && location.pathname);
  const canonical = `${meta.siteUrl}${canonicalPath(path)}`;
  const socialImage = `${meta.siteUrl}${image || meta.image}`;

  return (
    <Helmet>
      <html lang="en" />
      <title>{fullTitle}</title>
      <link rel="canonical" href={canonical} />
      {/* Fav icons */}
      <link rel="icon" type="image/svg+xml" href="/faviconjose.ico" />
      <link rel="alternate icon" href="/faviconjose.ico" />
      {/* Metatags */}
      <meta name="viewport" content="width=device-width,initial-scale=1.0" />
      <meta charSet="utf-8" />
      <meta name="description" content={metaDescription} />
      {/* Open graph */}
      <meta property="og:type" content="website" />
      <meta property="og:url" content={canonical} />
      <meta property="og:image" content={socialImage} />
      <meta property="og:title" content={fullTitle} key="ogtitle" />
      <meta
        property="og:site_name"
        content={meta.title}
        key="ogsitename"
      />
      <meta property="og:description" content={metaDescription} key="ogdesc" />
      {/* Twitter / X */}
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:creator" content={meta.twitter} />
      <meta name="twitter:title" content={fullTitle} />
      <meta name="twitter:description" content={metaDescription} />
      <meta name="twitter:image" content={socialImage} />
      {children}
    </Helmet>
  );
}
