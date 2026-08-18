import { formatPeriod, rolesByRecency, type Role } from '@/lib/experience';

/**
 * The work history.
 *
 * Roles with detail on record get their scope and highlights; the rest are a
 * compact line each. Padding the thin ones with invented responsibilities would
 * be worse than showing them plainly.
 */
export function RoleList({
  roles,
  headingLevel = 'h3',
}: {
  roles: Role[];
  headingLevel?: 'h2' | 'h3';
}) {
  const Heading = headingLevel;
  const ordered = rolesByRecency(roles);

  return (
    <ol className="mt-6 border-t border-line">
      {ordered.map((role) => (
        <li
          key={`${role.company}-${role.title}`}
          className="grid gap-2 border-b border-line py-6 sm:grid-cols-[11rem_1fr] sm:gap-8"
        >
          <div>
            <p className="font-mono text-step--1 text-ink-muted">
              {formatPeriod(role)}
            </p>
            {role.location ? (
              <p className="mt-1 text-step--1 text-ink-muted print:hidden">
                {role.location}
              </p>
            ) : null}
          </div>

          <div>
            <Heading className="font-display text-step-1 font-semibold">
              {role.title}
            </Heading>
            <p className="mt-0.5 text-step-0 text-ink-muted">{role.company}</p>

            {role.summary ? (
              <p className="measure mt-3">{role.summary}</p>
            ) : null}

            {role.highlights.length > 0 ? (
              <ul className="measure mt-3 list-disc space-y-1.5 pl-5 text-step--1 text-ink-muted">
                {role.highlights.map((item) => (
                  <li key={item}>{item}</li>
                ))}
              </ul>
            ) : null}
          </div>
        </li>
      ))}
    </ol>
  );
}
