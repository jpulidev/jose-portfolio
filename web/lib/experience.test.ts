import { describe, expect, it } from 'vitest';
import {
  education,
  formatMonth,
  formatPeriod,
  roles,
  rolesByRecency,
  stack,
} from './experience';
import { CAREER_START_YEAR } from './site';

/**
 * Consistency checks over the work history.
 *
 * This data is transcribed from an external profile, so the failure mode is a
 * typo nobody notices — a role that ends before it starts, a duplicate, a date
 * that contradicts the years-of-experience figure on every page.
 */

describe('role data', () => {
  it('uses well-formed year-month dates', () => {
    for (const role of roles) {
      expect(role.start, role.company).toMatch(/^\d{4}-(0[1-9]|1[0-2])$/);
      if (role.end) {
        expect(role.end, role.company).toMatch(/^\d{4}-(0[1-9]|1[0-2])$/);
      }
    }
  });

  it('never ends a role before it starts', () => {
    for (const role of roles) {
      if (role.end) {
        expect(
          role.end.localeCompare(role.start),
          `${role.company}: ${role.start} → ${role.end}`,
        ).toBeGreaterThan(0);
      }
    }
  });

  it('has exactly one current role', () => {
    expect(roles.filter((r) => r.end === null)).toHaveLength(1);
  });

  it('has no duplicate company/title pairs', () => {
    const keys = roles.map((r) => `${r.company}|${r.title}`);
    expect(new Set(keys).size).toBe(keys.length);
  });

  it('agrees with the years-of-experience figure shown sitewide', () => {
    // The earliest role is what CAREER_START_YEAR claims. If someone adds an
    // older role and forgets to update it, every page starts understating.
    const earliest = roles
      .map((r) => r.start)
      .sort((a, b) => a.localeCompare(b))[0];
    expect(Number(earliest.slice(0, 4))).toBe(CAREER_START_YEAR);
  });

  it('gives every featured role something concrete to show', () => {
    // A featured role with no highlights is a nameplate, which is the exact
    // problem the old site had.
    for (const role of roles.filter((r) => r.featured)) {
      expect(role.highlights.length, role.company).toBeGreaterThan(0);
      expect(role.summary, role.company).toBeTruthy();
    }
  });
});

describe('rolesByRecency', () => {
  it('puts the newest role first', () => {
    const sorted = rolesByRecency();
    expect(sorted[0].company).toBe("Pet's Table");
    for (let i = 1; i < sorted.length; i += 1) {
      expect(
        sorted[i - 1].start.localeCompare(sorted[i].start),
      ).toBeGreaterThanOrEqual(0);
    }
  });

  it('does not mutate the source array', () => {
    const before = roles.map((r) => r.company);
    rolesByRecency();
    expect(roles.map((r) => r.company)).toEqual(before);
  });
});

describe('formatting', () => {
  it('renders a month and year', () => {
    expect(formatMonth('2023-06')).toBe('Jun 2023');
    expect(formatMonth('2017-01')).toBe('Jan 2017');
  });

  it('passes through anything malformed rather than throwing', () => {
    expect(formatMonth('nonsense')).toBe('nonsense');
    expect(formatMonth('2023-13')).toBe('2023-13');
  });

  it('marks the current role as Present', () => {
    const current = roles.find((r) => r.end === null)!;
    expect(formatPeriod(current)).toMatch(/— Present$/);
    const past = roles.find((r) => r.end !== null)!;
    expect(formatPeriod(past)).not.toMatch(/Present/);
  });
});

describe('stack', () => {
  it('groups skills rather than listing them flat', () => {
    expect(stack.length).toBeGreaterThan(2);
    for (const group of stack) {
      expect(group.items.length, group.group).toBeGreaterThan(0);
    }
  });

  it('lists no skill twice across groups', () => {
    const all = stack.flatMap((g) => g.items.map((i) => i.toLowerCase()));
    expect(new Set(all).size).toBe(all.length);
  });
});

describe('education', () => {
  it('has an institution, qualification and year for each entry', () => {
    for (const entry of education) {
      expect(entry.institution).toBeTruthy();
      expect(entry.qualification).toBeTruthy();
      expect(entry.year).toMatch(/^\d{4}$/);
    }
  });
});

describe('engagements and selected work', () => {
  it('gives every engagement a client, period and stack', async () => {
    const { engagements } = await import('./experience');
    expect(engagements.length).toBeGreaterThan(0);
    for (const e of engagements) {
      expect(e.client, 'client').toBeTruthy();
      expect(e.work, `${e.client} work`).toBeTruthy();
      expect(e.period, `${e.client} period`).toMatch(/\d{4}/);
      expect(e.stack.length, `${e.client} stack`).toBeGreaterThan(0);
    }
  });

  it('omits work Jose did not author', async () => {
    // Vistobot's repository has none of his commits in its last hundred. A CV
    // line that cannot survive one interview question is worse than no line.
    const { engagements } = await import('./experience');
    expect(engagements.map((e) => e.client.toLowerCase())).not.toContain(
      'vistobot',
    );
  });

  it('describes each built thing concretely, with a stack', async () => {
    const { selectedWork } = await import('./experience');
    expect(selectedWork.length).toBeGreaterThanOrEqual(5);
    for (const item of selectedWork) {
      expect(item.title, 'title').toBeTruthy();
      // Long enough to say something; a five-word bullet is a nameplate.
      expect(item.detail.length, `${item.title} detail`).toBeGreaterThan(60);
      expect(item.stack, `${item.title} stack`).toBeTruthy();
    }
  });

  it('has no duplicate titles', async () => {
    const { selectedWork } = await import('./experience');
    const titles = selectedWork.map((i) => i.title);
    expect(new Set(titles).size).toBe(titles.length);
  });
});
