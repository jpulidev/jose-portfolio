/**
 * Single source of truth for facts that go stale on their own.
 *
 * The site previously hardcoded three mutually contradictory claims, all
 * written to be read in 2022:
 *   - home page:  "08 years"
 *   - /about:     "making websites for the past 5 years"
 *   - /about:     "I'm 33 years old"
 *
 * Eight years and five years can't both be true, and neither number aged.
 * Now the figure is computed, so it can never drift or disagree with itself.
 *
 * ⚠️ CONFIRM THIS VALUE. The two original claims imply different start years
 * (8 years as of 2022 → 2014; 5 years as of 2022 → 2017). 2014 is assumed here
 * because it matches the headline figure on the home page. Correct it if wrong
 * — it is the only place the number is defined.
 */
export const CAREER_START_YEAR = 2014;

/** Whole years of professional experience, as of the build date. */
export function yearsOfExperience(now = new Date()) {
  return now.getFullYear() - CAREER_START_YEAR;
}
