import { groq } from 'next-sanity';

/**
 * GROQ queries. Each one projects into the matching `Raw*` type in `types.ts`,
 * so the shape is declared in exactly one place per query.
 *
 * Note the `legacy*` aliases: the Studio migration added explicit fields for
 * things that were previously stored in the wrong place (a URL in `slug`, a
 * summary in `project`). Both are fetched so `normalize.ts` can prefer the new
 * one and fall back, letting content migrate document by document.
 */

/**
 * All projects, featured first, then by manual order, then newest.
 *
 * Image dimensions come along for the ride so `next/image` can reserve space
 * before the image loads — the old site shipped bare `<img>` tags with no
 * width/height, which is a layout-shift source.
 */
export const worksQuery = groq`
  *[_type == "works" && defined(name)]
    | order(featured desc, order asc, _createdAt desc) {
      _id,
      name,
      "legacySlug": slug.current,
      liveUrl,
      repoUrl,
      summary,
      "legacySummary": project,
      designCredit,
      client,
      role,
      timeline,
      featured,
      order,
      problem,
      approach,
      outcome,
      "metrics": metrics[]{label, value},
      "imageUrl": image.asset->url,
      "imageAlt": image.alt,
      "imageDimensions": image.asset->metadata.dimensions{width, height},
      "imageLqip": image.asset->metadata.lqip,
      "tagNames": projects[]->name
    }
`;

/**
 * Technology tags, with a live count of how many works reference each.
 *
 * The count is what lets the app drop orphans: the dataset holds six tag
 * documents referenced by nothing ("Node", "Node.js", "React.js", a duplicate
 * "React", a duplicate "Gatsby", "Sanity Studio Backend"), and the old site
 * generated a page for every one of them.
 */
export const tagsQuery = groq`
  *[_type == "project" && defined(name)] {
    _id,
    name,
    shopify,
    "useCount": count(*[_type == "works" && references(^._id)])
  }
`;

/**
 * The `person` documents — personal notes and short essays. The type is named
 * "person" and was titled "Team" by the original scaffold; the Studio now calls
 * it "Notes", which is what the content actually is.
 */
export const notesQuery = groq`
  *[_type == "person" && defined(name)] {
    _id,
    name,
    "slug": slug.current,
    description,
    "imageUrl": image.asset->url,
    "imageAlt": image.alt,
    "imageDimensions": image.asset->metadata.dimensions{width, height},
    "imageLqip": image.asset->metadata.lqip
  }
`;
