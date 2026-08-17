import { describe, expect, it } from 'vitest';
import { renderToStaticMarkup } from 'react-dom/server';
import type { PortableTextBlock } from '@portabletext/react';
import { Prose } from './Prose';

/**
 * Renders the Portable Text path with real block structures.
 *
 * Without this, a fault here would stay invisible until someone wrote their
 * first case study in the Studio — the CMS currently has no rich text at all,
 * so every project page takes the empty branch.
 */

const para = (text: string): PortableTextBlock =>
  ({
    _type: 'block',
    style: 'normal',
    children: [{ _type: 'span', text, marks: [] }],
  }) as unknown as PortableTextBlock;

function render(value: PortableTextBlock[]) {
  return renderToStaticMarkup(<Prose value={value} />);
}

describe('Prose', () => {
  it('renders a paragraph', () => {
    const html = render([para('The storefront took nine seconds to load.')]);
    expect(html).toContain('<p>');
    expect(html).toContain('The storefront took nine seconds to load.');
  });

  it('renders headings at h3/h4, keeping the page h1/h2 hierarchy intact', () => {
    const html = render([
      {
        _type: 'block',
        style: 'h2',
        children: [{ _type: 'span', text: 'Why Liquid', marks: [] }],
      } as unknown as PortableTextBlock,
    ]);
    // The page already owns h1 and h2, so CMS "h2" renders one level down.
    expect(html).toContain('<h3');
    expect(html).toContain('Why Liquid');
  });

  it('renders bullet lists', () => {
    const html = render([
      {
        _type: 'block',
        style: 'normal',
        listItem: 'bullet',
        level: 1,
        children: [{ _type: 'span', text: 'Cut the bundle', marks: [] }],
      } as unknown as PortableTextBlock,
    ]);
    expect(html).toContain('<ul');
    expect(html).toContain('<li>');
    expect(html).toContain('Cut the bundle');
  });

  it('opens external links safely', () => {
    const html = render([
      {
        _type: 'block',
        style: 'normal',
        markDefs: [{ _key: 'k1', _type: 'link', href: 'https://shopify.com' }],
        children: [{ _type: 'span', text: 'Shopify', marks: ['k1'] }],
      } as unknown as PortableTextBlock,
    ]);
    expect(html).toContain('href="https://shopify.com"');
    expect(html).toContain('target="_blank"');
    expect(html).toContain('rel="noopener noreferrer"');
  });

  it('does not add target=_blank to internal links', () => {
    const html = render([
      {
        _type: 'block',
        style: 'normal',
        markDefs: [{ _key: 'k1', _type: 'link', href: '/projects' }],
        children: [{ _type: 'span', text: 'my projects', marks: ['k1'] }],
      } as unknown as PortableTextBlock,
    ]);
    expect(html).toContain('href="/projects"');
    expect(html).not.toContain('target="_blank"');
  });

  it('renders an empty array without throwing', () => {
    expect(() => render([])).not.toThrow();
  });
});
