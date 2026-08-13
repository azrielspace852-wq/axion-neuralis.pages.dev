# AXION Neuralis — Bible / Blueprint / Roadmap Compliance Audit v2

Audit date: 13 August 2026  
Source archive: `axion-neuralis.zip`  
Authority order: AXION BIBLE → AXION BLUEPRINT → AXION ROADMAP → implementation

## Executive result

The repository now passes the structural, routing-contract, lifecycle, basic accessibility, path, and parser checks that can be verified statically.

The project is **NOT READY FOR LAUNCH** yet. Two blockers are intentionally left unresolved because resolving them would require inventing information or assets:

1. **Binary asset integrity BLOCKER** — 3 `.webp` files and 2 `.mp3` files are ASCII placeholder/encoded text rather than valid binary media.
2. **Roadmap governance BLOCKER** — `AXION_ROADMAP.md` contains conflicting launch dates: 17 August 2026 and 5 September 2026. The documents do not unambiguously identify which is authoritative.

Additional functional items remain unverified/unimplemented: onboarding, global Play All, browser/E2E testing, Lighthouse, and Cloudflare production verification.

## 1. Document hierarchy compliance

Verified from `AXION_BIBLE.md`:

- Bible defines WHAT is allowed.
- Blueprint defines HOW to implement.
- Roadmap defines WHEN / execution order.
- Code must not become a new source of architectural rules.

This hierarchy was used for this audit.

## 2. Structural compliance

Status: **PASS**

- 51/51 required files present.
- No extra repository files outside the defined 51-file contract.
- 7 event templates present.
- Every configured event has HTML + CSS + JS.
- `default` exists and remains the fallback.
- `data/events.json` is the event configuration source.

## 3. Event engine compliance

Status: **PASS — statically verified**

Required resolution order is preserved:

1. Valid preview
2. Gregorian/Masehi event
3. Hijri event
4. Default

The implementation preserves:

- preview whitelist validation;
- safe template-name validation;
- 8-second request timeout;
- Gregorian-first resolution;
- Hijri lookup only when Gregorian has no valid match;
- deterministic default fallback;
- fallback after config/API/template/JS/CSS failure.

## 4. Router / lifecycle corrections

Status: **PASS — corrected**

Major prior defects fixed:

- Template HTML is now injected as HTML instead of `textContent`.
- CSS is loaded as a template-scoped resource.
- Previous template lifecycle is destroyed before replacement.
- Previous template CSS/JS is removed.
- All seven template JS files expose the same lifecycle contract:
  `window.AXION_TEMPLATE_LIFECYCLE = { init, destroy }`.
- Template self-initialization was removed.
- Router explicitly invokes `init()`.
- Router dispatches `axion:template-loaded` after initialization.
- Render sequence tokens prevent stale asynchronous renders from committing over a newer render.
- Template JS load failure is now a real failure and triggers fallback.
- CSS load failure triggers fallback.
- Critical error UI no longer uses inline JavaScript.

Representative implementation:
`js/main.js:240` injects template HTML.
`js/main.js:237` performs resource cleanup.
`js/main.js:16` / `js/main.js:206+` implement render sequencing.
`js/main.js:326` establishes the standard lifecycle contract.
`js/main.js:447` emits the language-change event with a stable `lang` field.

## 5. Language system compliance

Status: **PASS — corrected**

Prior inconsistency:

- `main.js` used `axn_lang`;
- some templates used `axion_lang`;
- some templates expected `event.detail.lang`;
- the core dispatched `event.detail.language`;
- static pages without `#app` effectively skipped language initialization.

Corrections:

- one storage key: `axn_lang`;
- one global language system;
- static pages initialize language even when `#app` does not exist;
- supported legacy UI control IDs/classes are normalized by the global handler;
- language event provides both `lang` and `language` for safe compatibility;
- HTML `lang` attribute is updated;
- `.lang-id`, `.lang-en`, and `[data-lang]` content is synchronized.

## 6. Accessibility

Status: **PASS — static baseline**

Verified:

- exactly one `h1` per HTML page/template;
- no missing `img alt` attributes;
- heading hierarchy no longer skips levels;
- skip-link structures remain present;
- visible focus and ARIA attributes remain in the existing UI;
- reduced-motion rules exist where CSS animations are present.

Specific corrections:
- `services.html`: footer `h4` headings corrected to `h3`.
- `templates/lebaran/index.html`: transcript headings corrected to `h2`.
- `templates/idul-adha/index.html`: transcript headings corrected to `h2`.

Browser keyboard verification remains required.

## 7. Security compliance

Status: **PASS — statically verified**

Verified / corrected:

- preview accepts only whitelisted template names;
- template names are constrained to `[a-z0-9-]+`;
- template paths are constructed only after validation;
- no inline `onsubmit` handlers remain;
- no template uses arbitrary URL/path input;
- no audio autoplay attribute exists;
- API requests have timeouts and error handling;
- CSP no longer permits `unsafe-inline` for scripts;
- CSP permits `mailto:` because the roadmap specifies mailto-based contact V1.

The `arbitrary-template-loader` scan hit `js/main.js` only because validated template names are used to construct internal paths; this is expected and not an arbitrary URL loader.

## 8. Content / brand immutability

Status: **PASS — static review**

No event template was found to:

- remove the AXION shell;
- replace the global identity;
- add partisan political content;
- add alcohol imagery/text;
- add violent sacrificial imagery;
- add obvious prohibited event content.

The global AXION accent remains available through the global layer, while event templates use theme-specific treatment.

## 9. SEO / deployment corrections

Status: **PARTIAL**

Corrected:

- canonical URLs added to public root pages;
- Open Graph metadata strengthened for services;
- 404 page marked `noindex, nofollow`;
- `robots.txt` repaired;
- `sitemap.xml` repaired and now parses as XML;
- root-based paths preserved.

Still requires runtime / production verification:

- canonical behavior behind Cloudflare redirects;
- final OG rendering;
- Cloudflare Pages deployment;
- HTTPS;
- headers in production;
- production 404;
- Lighthouse.

## 10. Asset integrity — BLOCKER

Status: **BLOCKED**

The following required files are not valid binary media:

- `assets/images/hero/hero-banner.webp`
- `assets/images/hero/og-image.webp`
- `assets/images/team/azriel.webp`
- `assets/audio/tp1E.mp3`
- `assets/audio/tp1I.mp3`

`file` identifies them as ASCII text, not WebP/MP3 binaries.

The SVG assets had a separate corruption pattern: a literal `xml` line before the `<svg>` element. That has been corrected for all SVG files.

I did **not** generate replacement hero/team/audio assets because the Bible/Blueprint do not supply the missing source media and replacing them with invented assets would be an unsupported assumption.

## 11. Missing / unresolved roadmap features

Status: **NOT READY**

Still requiring explicit implementation and/or verification:

- onboarding (roadmap requires 3-step behavior, localStorage, skip, reopen/reset);
- global Play All;
- complete audio/transcript UX;
- browser matrix;
- mobile/tablet/desktop runtime validation;
- Lighthouse Performance ≥ 90;
- Lighthouse Accessibility ≥ 90;
- production Cloudflare test;
- production smoke test.

These are not being falsely marked complete.

## 12. Governance conflict in AXION_ROADMAP.md — BLOCKER

`AXION_ROADMAP.md` contains both:

- `Target Launch: 17 Agustus 2026`
- `Target launch tetap: 5 September 2026`
- sign-off also states `Target Launch: 5 September 2026`

The timeline immediately before the second statement describes production launch during 16–17 August 2026.

This is an internal document contradiction. I did not silently choose one date because the governance rule says the implementation must follow the documents, not invent a missing decision.

## 13. Automated checks executed

- 51-file contract: **PASS**
- events.json mapping: **PASS**
- all JS syntax (`node --check`): **PASS**
- lifecycle standardization: **PASS**
- root-relative path scan: **PASS**
- inline-handler scan: **PASS**
- autoplay-attribute scan: **PASS**
- basic HTML accessibility scan: **PASS**
- sitemap XML parse: **PASS**
- robots.txt structural check: **PASS**
- binary asset validation: **FAIL / BLOCKER**
- roadmap consistency: **FAIL / BLOCKER**

## 14. Release decision

**STATUS: NOT READY FOR LAUNCH**

The repository is substantially more aligned with the AXION Bible/Blueprint than the previous revision, but release must remain blocked until:

1. valid WebP/MP3 assets are supplied;
2. the Roadmap launch date is resolved;
3. onboarding / Play All / full audio requirements are completed;
4. browser, Lighthouse, and Cloudflare production verification pass.

No unsupported Bible rules were invented during this audit.
