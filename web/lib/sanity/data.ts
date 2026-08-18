import { sanityClient } from './client';
import { normalizeNotes, normalizeProjects, normalizeTags } from './normalize';
import { notesQuery, tagsQuery, worksQuery } from './queries';
import type { Note, Project, RawNote, RawTag, RawWork, Tag } from './types';

/**
 * The app's read API. Pages call these; nothing else touches the CMS.
 *
 * Results are memoised per request with React's `cache`, so a page that needs
 * both projects and tags — and a `generateMetadata` that needs the same project
 * as the page body — issues one query, not several.
 */

import { cache } from 'react';

export const getProjects = cache(async (): Promise<Project[]> => {
  const raw = await sanityClient.fetch<RawWork[]>(worksQuery);
  return normalizeProjects(raw ?? []);
});

export const getTags = cache(async (): Promise<Tag[]> => {
  const [raw, projects] = await Promise.all([
    sanityClient.fetch<RawTag[]>(tagsQuery),
    getProjects(),
  ]);
  return normalizeTags(raw ?? [], projects);
});

/**
 * Notes whose slug is listed here are not rendered.
 *
 * `jose-pulido` is a second copy of the bio, written years ago, and it still
 * claims "5 years of experience" — a figure the site now computes from a single
 * date. /about carries the real bio, the work history and the stack, so the note
 * adds nothing except a number that contradicts every other page.
 *
 * This is a workaround for a content problem: the right fix is deleting the
 * document in the Studio, which needs write access this app does not have. Once
 * it is gone, delete this list.
 */
const SUPPRESSED_NOTE_SLUGS = new Set(['jose-pulido']);

export const getNotes = cache(async (): Promise<Note[]> => {
  const raw = await sanityClient.fetch<RawNote[]>(notesQuery);
  return normalizeNotes(raw ?? []).filter(
    (note) => !SUPPRESSED_NOTE_SLUGS.has(note.slug),
  );
});

export const getProjectBySlug = cache(
  async (slug: string): Promise<Project | null> => {
    const projects = await getProjects();
    return projects.find((project) => project.slug === slug) ?? null;
  },
);
