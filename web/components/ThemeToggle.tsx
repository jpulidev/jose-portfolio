const OPTIONS = [
  { value: 'light', label: 'Light', icon: '☀' },
  { value: 'system', label: 'System', icon: '◐' },
  { value: 'dark', label: 'Dark', icon: '☾' },
] as const;

/**
 * Theme switch with three states, because "system" is a real preference and not
 * the absence of one.
 *
 * Deliberately *not* a client component. The markup is static and the inline
 * script in `app/layout.tsx` does the work: it stamps `data-theme` and
 * `data-theme-choice` on <html> before first paint, and wires clicks by
 * delegation. Which option looks active is decided in CSS from
 * `data-theme-choice` (see globals.css), so the highlight is correct in the very
 * first frame — no hydration, no flash, and the control works before any bundle
 * has loaded.
 *
 * It was a client component first. Note that moving it here did *not* shrink the
 * bundle — measured transferred JS was 140 KB either way, since the App Router
 * ships its client runtime regardless. The reason to keep it this way is the
 * behaviour, not the bytes.
 *
 * Because nothing here is React, `e2e/theme.spec.ts` is the only thing standing
 * between a refactor and a silently dead control.
 */
export function ThemeToggle() {
  return (
    <fieldset
      className="flex items-center rounded-full border border-line p-0.5"
      data-theme-switch
    >
      <legend className="sr-only">Colour theme</legend>
      {OPTIONS.map((option) => (
        <button
          key={option.value}
          type="button"
          data-choice={option.value}
          // The script corrects this to match the stored choice before paint.
          aria-pressed={option.value === 'system'}
          title={`${option.label} theme`}
          className="rounded-full px-2 py-1 text-step--1 leading-none text-ink-muted"
        >
          <span aria-hidden="true">{option.icon}</span>
          <span className="sr-only">{option.label}</span>
        </button>
      ))}
    </fieldset>
  );
}
