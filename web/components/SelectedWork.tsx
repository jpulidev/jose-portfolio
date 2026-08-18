import { engagements, selectedWork } from '@/lib/experience';

/**
 * The evidence section.
 *
 * A recruiter screening for "fullstack" wants to know what the person has
 * actually built, and a job title never answers that. These are concrete,
 * specific, and — deliberately — only things authored personally, so every line
 * survives being asked about in an interview.
 */
export function SelectedWork({
  headingLevel = 'h3',
}: {
  headingLevel?: 'h2' | 'h3';
}) {
  const Heading = headingLevel;

  return (
    <ol className="mt-6 grid gap-px overflow-hidden rounded-xl border border-line bg-line sm:grid-cols-2 print:gap-0 print:border-0 print:bg-transparent">
      {selectedWork.map((item) => (
        <li
          key={item.title}
          className="bg-ground p-5 print:break-inside-avoid print:p-0 print:pb-4"
        >
          <Heading className="font-display text-step-0 font-semibold">
            {item.title}
          </Heading>
          <p className="mt-2 text-step--1 text-ink-muted">{item.detail}</p>
          <p className="mt-2 font-mono text-step--1 text-accent">
            {item.stack}
          </p>
        </li>
      ))}
    </ol>
  );
}

/** Independent client engagements, run separately from the salaried roles. */
export function Engagements({
  headingLevel = 'h3',
}: {
  headingLevel?: 'h2' | 'h3';
}) {
  const Heading = headingLevel;

  return (
    <ul className="mt-6 border-t border-line">
      {engagements.map((item) => (
        <li
          key={item.client}
          className="grid gap-1 border-b border-line py-4 sm:grid-cols-[11rem_1fr] sm:gap-8"
        >
          <p className="font-mono text-step--1 text-ink-muted">{item.period}</p>
          <div>
            <Heading className="font-display text-step-0 font-semibold">
              {item.client}
            </Heading>
            <p className="mt-1 text-step--1 text-ink-muted">{item.work}</p>
            <p className="mt-1 font-mono text-step--1 text-ink-muted">
              {item.stack.join(' · ')}
            </p>
          </div>
        </li>
      ))}
    </ul>
  );
}
