import { PortableText, type PortableTextBlock } from '@portabletext/react';

/**
 * Renders Portable Text from the CMS.
 *
 * Styling is explicit rather than relying on a typography plugin, so link and
 * heading colours come from the same tokens as the rest of the page and stay
 * contrast-checked in both themes.
 */
export function Prose({ value }: { value: PortableTextBlock[] }) {
  return (
    <div className="space-y-4">
      <PortableText
        value={value}
        components={{
          block: {
            normal: ({ children }) => <p>{children}</p>,
            h2: ({ children }) => (
              <h3 className="mt-8 text-xl font-semibold tracking-tight">
                {children}
              </h3>
            ),
            h3: ({ children }) => (
              <h4 className="mt-6 text-lg font-semibold tracking-tight">
                {children}
              </h4>
            ),
            blockquote: ({ children }) => (
              <blockquote
                className="border-l-2 pl-4 italic"
                style={{ borderColor: 'var(--accent)' }}
              >
                {children}
              </blockquote>
            ),
          },
          list: {
            bullet: ({ children }) => (
              <ul className="list-disc space-y-2 pl-5">{children}</ul>
            ),
            number: ({ children }) => (
              <ol className="list-decimal space-y-2 pl-5">{children}</ol>
            ),
          },
          marks: {
            link: ({ children, value }) => {
              const href = String(value?.href ?? '');
              const isExternal = /^https?:\/\//i.test(href);
              return (
                <a
                  href={href}
                  className="underline"
                  style={{ color: 'var(--accent)' }}
                  {...(isExternal
                    ? { target: '_blank', rel: 'noopener noreferrer' }
                    : {})}
                >
                  {children}
                </a>
              );
            },
            code: ({ children }) => (
              <code
                className="rounded px-1 py-0.5 text-[0.9em]"
                style={{ background: 'var(--surface)' }}
              >
                {children}
              </code>
            ),
          },
        }}
      />
    </div>
  );
}
