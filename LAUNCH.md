# Launch checklist

What has to happen to put `web/` in front of jpulidev.com, in order. Nothing
here needs code changes — it is all configuration, content, and a few clicks.

## 1. Things only you can do

These are blocking in the sense that launching without them ships a weaker site,
not a broken one.

- [ ] **Write the six case studies.** The fields exist and render; the words
      don't. `sanity/README.md` has the suggested six, the per-field prompts and
      the cleanup checklist. This is the single biggest difference between "a
      portfolio" and "evidence".
- [ ] **Delete the duplicate bio note in the CMS.** The `person` note titled
      "Jose Pulido" is a second copy of the bio and still says "5 years of
      experience". The site suppresses it (`SUPPRESSED_NOTE_SLUGS` in
      `lib/sanity/data.ts`) so nothing contradicts, but the document is still
      there. Delete it in the Studio, then remove the suppression list.
- [ ] **Clean the project slugs.** Older `works` documents hold the live URL in
      the slug field. Click *Generate* on each, and move the URL to **Live site
      URL**. Do this *before* launch — changing a slug after the fact changes a
      page's address.
- [ ] **Get a proper headshot.** The current photo is the 2020 selfie, used
      small and tightly cropped so the headline carries the page. A real
      portrait would let the hero do more.
- [ ] **Re-export project screenshots at 2×** (≥1600px wide). Several are 573px,
      which is soft on a high-density display.

## 2. Deployment — staying on Netlify

`jpulidev.com` already points at Netlify, so this replaces the build on the
existing site rather than moving DNS. `web/netlify.toml` is already configured:
Node 22, the official `@netlify/plugin-nextjs` runtime, security headers, and
301s from the old `/project/*` tag URLs.

On the **existing** Netlify site, change these settings:

- [ ] **Base directory:** `gatsby` → **`web`**
- [ ] **Build command:** leave blank — `netlify.toml` sets `npm run build`
- [ ] **Publish directory:** leave blank — `netlify.toml` sets `.next`
- [ ] Remove the old `NODE_VERSION = 16` if it is set in the UI; the toml sets 22.
- [ ] Add the environment variables from `web/.env.example`. Sanity's two are
      public identifiers and already the defaults; the contact form needs
      `RESEND_API_KEY` and `CONTACT_FROM_EMAIL` (see §3).
- [ ] Trigger a **deploy preview** first (open a PR) and click through every
      page before touching production.

The App Router, image optimisation and the `/contact` server action all become
Netlify Functions automatically — the plugin handles that, nothing extra to
configure.

**Rolling back** is redeploying the last Gatsby build from Netlify's deploy
list, so keep `gatsby/` in the repo until the new site has been stable for a
week or two.

## 3. Contact form

Without both variables the form still validates and still shows your email
address, but it refuses to pretend a message was sent.

- [ ] Create a [Resend](https://resend.com) account.
- [ ] Verify a domain you control — `jpulidev.com`.
- [ ] Set `CONTACT_FROM_EMAIL` to an address on that domain (e.g.
      `portfolio@jpulidev.com`). This is the *sender*; the recipient is your
      address and is set in code.
- [ ] Set `RESEND_API_KEY`.
- [ ] Send yourself a test message from the live form and confirm that hitting
      Reply goes back to the sender, not to the site.

## 4. Search engines

- [ ] **Google Search Console** — verify the domain, submit
      `https://jpulidev.com/sitemap.xml`, then check Coverage a few days later
      for anything unexpectedly excluded.
- [ ] **Bing Webmaster Tools** — five minutes, and it feeds ChatGPT search.
- [ ] Check the branded query **"jose pulido developer"** a month in. If you are
      not the first result, that is the gap to close before anything else — the
      JSON-LD `Person` block and the `sameAs` profile links are what work on it.

## 5. Analytics

Not wired up, deliberately: every option needs an account, and picking one for
you would mean embedding a third-party script without asking.

Recommended: [Plausible](https://plausible.io) or Vercel Analytics. Both are
cookie-free, so neither needs a consent banner — which matters, because a
consent banner is the first thing a recruiter would see.

- [ ] Add the script in `app/layout.tsx`.
- [ ] Confirm Lighthouse still passes afterwards (`npm run lighthouse`) — a
      third-party script is the usual way a 100 becomes a 92.

## 6. Tell people it moved

- [ ] Update the website link on **LinkedIn**, **GitHub** and **Instagram**.
- [ ] **Update your LinkedIn headline to match the site.** The site now leads
      with **"Shopify Developer & Tech Lead"**. Your LinkedIn says "Tech Lead &
      Shopify Specialist", which is close — align the two so a recruiter
      checking both sees one person, and put the same line on GitHub.

## After launch

- [ ] Delete `gatsby/` once you are confident, and drop the Netlify site.
- [ ] Turn the pre-commit hook on in any fresh clone:
      `git config core.hooksPath .githooks`
