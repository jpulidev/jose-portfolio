import { ImageResponse } from 'next/og';
import { getProjectBySlug, getProjects } from '@/lib/sanity/data';
import { site } from '@/lib/site';

/**
 * A share card per project.
 *
 * Previously these pages fell back to the site-wide card whenever the project
 * screenshot was too small to render as one — several are only 573px wide. This
 * generates a proper 1200x630 card from the project's own details instead, so
 * sharing a case study previews the case study.
 */
export const alt = 'Project by Jose Pulido';
export const size = { width: 1200, height: 630 };
export const contentType = 'image/png';

export async function generateStaticParams() {
  const projects = await getProjects();
  return projects.map((project) => ({ slug: project.slug }));
}

export default async function Image({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const project = await getProjectBySlug(slug);

  const name = project?.name ?? 'Project';
  const summary = project?.summary ?? '';
  const tags = project?.tags.slice(0, 4).join('  ·  ') ?? '';

  return new ImageResponse(
    // Satori needs an explicit display on any element with more than one
    // child, and counts an interpolated value plus adjacent text as two.
    <div
      style={{
        height: '100%',
        width: '100%',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'space-between',
        background: '#0b0f0d',
        color: '#e8eee9',
        padding: '72px',
        fontFamily: 'sans-serif',
      }}
    >
      <div style={{ display: 'flex', flexDirection: 'column' }}>
        <div
          style={{
            fontSize: 26,
            letterSpacing: '0.18em',
            textTransform: 'uppercase',
            color: '#5fd39b',
          }}
        >
          Case study
        </div>
        <div
          style={{
            fontSize: 82,
            fontWeight: 700,
            marginTop: 20,
            letterSpacing: '-0.02em',
            lineHeight: 1.05,
          }}
        >
          {name}
        </div>
        {summary ? (
          <div
            style={{
              fontSize: 32,
              marginTop: 24,
              color: '#9aa8a0',
              lineHeight: 1.3,
            }}
          >
            {summary.slice(0, 110)}
          </div>
        ) : null}
      </div>

      <div
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'flex-end',
          fontSize: 24,
          color: '#9aa8a0',
        }}
      >
        <div>{tags}</div>
        <div>{`${site.name} · jpulidev.com`}</div>
      </div>
    </div>,
    size,
  );
}
