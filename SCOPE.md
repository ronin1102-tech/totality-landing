# SCOPE — Totality Landing Page (v1, rev 2)

**Repo:** `/Users/solstice-agent/totality-landing` (greenfield, 2 commits: bootstrap + README)
**Date:** 2026-10-28 · **Loop:** scope-first Gate 3 → one-pass build → local check. Mini-sprint.
**Rev 2** supersedes rev 1 — Tracy's answers locked copy, form backend, and identity.

## What this is

Single-page lead-capture landing page for **Totality** — an eclipse-themed marble
shooter (Zuma on steroids) built by **Solstice Interactive**. Plain HTML/CSS/JS,
no framework, no build step. Deploy: **Cloudflare Pages** as its own project,
with a **Pages Function writing signups to Cloudflare KV** — no third-party
services, no stubs (Tracy's explicit call; overrides the Astro repo's Kit-based
implementation, which contributes shape only).

## Source of truth

- **Copy (locked):** vault `totality-landing-brief-answers.md` — brand paragraph,
  v1 job list, DoD, past-burn countermeasures. Copy is used verbatim; no
  rewriting Tracy's locked claims (cutting for layout is allowed, rewording is not).
- **Visual identity (locked, stamped 2026-10-28):** vault `totality-art-style-lock.md`
  — deep navy (`#1b2838` family and darker), corona gold as the only warm light
  (bright yellow-gold, holy things only), flat comic / temple-illustration mood.
  Eclipse-rendering gradients are on-brief; decorative gradients are not. Ember is
  red-orange, never amber. No text baked into imagery.
- **Pattern reference:** `/Users/solstice-astro-landing` — one static page + one
  `/api/subscribe` endpoint + JSON response contract (`{success:true}` / `{error}`).
  Borrowed: project shape and endpoint contract. Not borrowed: Kit API calls.

## v1 job list

1. **Hero** — "Totality" + the locked brand paragraph, eclipse-gold visual moment,
   primary CTA scrolls to the form.
2. **Lead capture — THE point of v1.** One email field ("notify me at launch"),
   client-side validation, POST to `/api/subscribe`, visible success + error
   states. No placeholders for parked items.
3. **`functions/api/subscribe.js`** — Pages Function: server-side email
   validation, write to KV (shape below), return the Astro JSON contract.
   Method guard (POST only), zero external calls.
4. **Instagram follow link** — one line, cheap add per brief.
5. **Footer** — Solstice Interactive credit, minimal.
6. **KV shape** — key `signup:<ISO8601 timestamp>:<sanitized email>` (sortable,
   collision-proof), value JSON `{email, ts, ua}`. Tracy inspects via dashboard
   or wrangler. Namespace creation/binding is a deploy-time item on Tracy's
   checklist, not code.
7. **Cloudflare readiness** — assets + `functions/` in the standard Pages layout,
   plus a DEPLOY.md one-pager so deploy can't burn an evening like Blockbuilt.

## Out of scope (parking lot → v2.txt)

Trailer embed, wishlist/store links, screenshot gallery, dev-log — the brief
says **do not build placeholders** for these. Also: analytics, pixels, real
asset pass (og:image/favicon), email sequences.

## Definition of done (Tracy's standing rule, unchanged)

On his phone, at the deployed URL: submit an email → visibly confirm it in the
KV store. Page loading + polish alone do NOT count.

**Owner split (honest-cost framing):**
- **Cori (verified before handoff):** page renders locally (server + file://),
  form validation + success/error states, endpoint contract tested locally
  (KV write shape, invalid-email path, method guard), code checked against
  both vault locks.
- **Tracy (unverified until done):** Cloudflare Pages project + KV namespace
  creation/binding, deploy, live phone test, DNS if any.

## Open items (non-blocking, assigned)

1. **Deploy path:** git-connected repo or dashboard direct upload — Tracy's
   call; DEPLOY.md covers both. (`git remote` is blocked in Coricode — honest gap.)
2. **"Route A audition repo"** (git history): whether this build is judged or
   deadlined is unconfirmed; proceeding on locked scope, flag if it binds.
3. **Art assets:** brief approves the game's eclipse art direction, but no asset
   files exist in this repo and chat attachments can't be written to disk by me.
   v1 ships a CSS-only eclipse render (gold corona on navy, on-lock); real art
   swaps in later as a filesystem drop.

## Cost-driver diagnosis (brief §6 — don't repeat)

- **Deploy fighting** (Blockbuilt: retrying an old deployment re-took the
  production alias twice, cost an evening) → DEPLOY.md carries a hard
  "never retry an old deployment row" warning; deploy is Tracy's single owned step.
- **Content churn** (claims changed across iterations) → copy is locked in the
  vault brief and used verbatim; mid-build copy ideas go to v2.txt.
- **Agent foraging** (burned time hunting the web) → build is fed from two
  vault docs + one local pattern file; no web foraging.

## Verified / Unverified (with owners)

| Item | Status | Owner |
|---|---|---|
| Repo is greenfield (clean tree, README only) | **verified** (git status + ls this session) | Cori |
| Copy + identity locked in vault docs (read this session) | **verified** | Cori |
| Astro pattern shape (worker.js + contract) read this session | **verified** | Cori |
| Page renders locally, form validates + success/error states | unverified until build check | Cori |
| Endpoint contract: KV write, invalid path, method guard | unverified until build check | Cori |
| Code matches both vault locks (palette, voice-color rule) | unverified until build check | Cori |
| Cloudflare Pages project + KV namespace/binding + deploy | **unverified — Tracy's move** | Tracy |
| Done-test: phone submit visible in KV store | **unverified — Tracy's move** | Tracy |
| Route A constraint applicability | unanswered — Tracy | Tracy |

## Build rule

One pass against the approved spec. Mid-build ideas → `v2.txt`, not the build.
