import { ImageResponse } from 'next/og';
import { site, yearsOfExperience } from '@/lib/site';

/**
 * The site-wide social share card.
 *
 * The old site pointed og:image at a 204x132 PNG via a relative path, so
 * platforms either cropped it to a thumbnail or dropped it entirely. This is
 * generated at the size link previews actually want.
 *
 * Phase 3 will give this the real visual identity; right now it is correct
 * rather than decorated.
 */
export const alt = site.defaultTitle;
export const size = { width: 1200, height: 630 };
export const contentType = 'image/png';

export default async function Image() {
  return new ImageResponse(
    <div
      style={{
        height: '100%',
        width: '100%',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        background: '#0e1316',
        color: '#e8eef1',
        padding: '80px',
        fontFamily: 'sans-serif',
      }}
    >
      <div
        style={{
          fontSize: 28,
          letterSpacing: '0.18em',
          textTransform: 'uppercase',
          color: '#5fc9d1',
        }}
      >
        Shopify Developer · Tech Lead
      </div>
      <div
        style={{
          fontSize: 76,
          fontWeight: 700,
          marginTop: 24,
          letterSpacing: '-0.02em',
        }}
      >
        {site.name}
      </div>
      {/* Satori requires an explicit display on any element with more than
       * one child, so this is a flex column rather than a text block. */}
      <div
        style={{
          display: 'flex',
          flexDirection: 'column',
          gap: 6,
          fontSize: 34,
          marginTop: 28,
          color: '#a3b3bc',
        }}
      >
        <div>Storefronts, Shopify Plus and headless commerce.</div>
        {/* One interpolated string, not an expression plus a text node —
         * Satori counts those as two children. */}
        <div>{`${yearsOfExperience()} years, shipped.`}</div>
      </div>
      <div style={{ fontSize: 26, marginTop: 'auto', color: '#a3b3bc' }}>
        jpulidev.com
      </div>
    </div>,
    size,
  );
}
