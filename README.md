# Totality — Landing Page

One-page launch site for **TOTALITY**, an eclipse-themed marble shooter by
Solstice Interactive. The page has one job: collect launch-notify emails.

**Game repo:** [ronin1102-tech/totality](https://github.com/ronin1102-tech/totality) (private) ·
**Live:** _pending first deploy — see DEPLOY.md_

## Stack

Plain HTML/CSS/JS. No framework, no build step, no third-party services.
Deploys to **Cloudflare Pages** with a **Pages Function** writing signups to
**Cloudflare KV**.

```
index.html                  the page (hero + signup + footer)
styles.css                  Direction C identity — deep navy, corona gold
script.js                   form validation + POST + status states
functions/api/subscribe.js  POST /api/subscribe → KV
DEPLOY.md                   deploy runbook — read before deploying
SCOPE.md                    v1 scope, owner split, verified/unverified ledger
v2.txt                      parked ideas (trailer, gallery, dev-log…)
```

## The endpoint

`POST /api/subscribe` — JSON in, JSON out, zero external calls.

| Response | Body | When |
|---|---|---|
| `200` | `{"success":true}` | valid email, KV write succeeded |
| `400` | `{"error":"Invalid request body"}` | body isn't JSON |
| `400` | `{"error":"Please provide a valid email address"}` | missing/malformed email |
| `405` | `{"error":"Method not allowed"}` | anything that isn't POST |
| `500` | `{"error":"Server misconfigured"}` | KV binding `SIGNUPS` missing |
| `500` | `{"error":"Server error"}` | KV write failed |

**KV row:** key `signup:<ISO8601 timestamp>:<sanitized email>` (sortable,
collision-proof), value `{"email","ts","ua"}` — the email stored exactly as
submitted. Inspect via the Cloudflare dashboard or `wrangler`.

**Required binding:** a KV namespace bound to the Pages project with the
variable name **exactly `SIGNUPS`**. That's environment, not code — see
DEPLOY.md step 4 (the step that bites).

## Local development

Any static server works for the page (`python3 -m http.server`). The Function
needs the Pages runtime — `wrangler pages dev` — or test the contract with a
KV stub: the endpoint is a pure `onRequestPost` and was verified 12/12 that
way (write shape, 400/405/500 paths, key format).

## Deploy

Follow **DEPLOY.md**, top to bottom. The one hard rule in it exists because it
already cost an evening on another project:

> **Never "Retry deployment" on an old row.** Deploy fresh from `main`.

Definition of done (standing rule): on a phone, at the live URL, submit an
email and **see the row in KV**. Page loading + polish alone do not count.

## Visual identity

Deep navy (`#1b2838` family) with corona gold as the only warm light, per the
Totality art style lock. Eclipse-rendering gradients are on-brief; decorative
gradients are not. Ember is red-orange, never amber. The hero eclipse is a
CSS render standing in for real art, which lands later as a file drop.

## Status

- ✅ Page, Function, contract battery, art-lock conformance — verified locally
- ⏳ Cloudflare project, KV namespace + `SIGNUPS` binding, deploy, phone done-test
- 📋 Known TODO: swap the placeholder Instagram URL for the real one (one string)

---
Totality is a Solstice Interactive game. © 2026 Solstice.
