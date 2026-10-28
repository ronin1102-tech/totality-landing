# DEPLOY — Totality landing on Cloudflare Pages

Read once before deploying. The Blockbuilt lesson lives here.

## The one hard rule

**Never retry an old deployment row.** On Blockbuilt, "Retry deployment" on a
stale commit silently re-took the production alias — twice, and it cost an
evening. If a deploy looks wrong: deploy fresh from `main`, don't retry history.

## Layout (already built)

```
index.html            — the page
styles.css            — Direction C identity (navy + corona gold)
script.js             — form behavior
functions/api/subscribe.js — Pages Function, POST /api/subscribe → KV
```

## Step by step

1. **KV namespace:** Cloudflare dashboard → Storage & Databases → KV
   → Create namespace. Name it `totality-signups`. Leave it empty.
2. **Pages project:** Workers & Pages → Create → Pages → connect the Git repo
   `totality-landing` (or Direct Upload the folder if you'd rather not connect
   git — both work; the repo's remote status is the open call).
3. **Build settings:** framework preset **None**; build command **empty**;
   output dir `/` (repo root).
4. **Function binding (the step that bites):** Pages project → Settings →
   Functions → KV namespace bindings → add: variable name `SIGNUPS` →
   namespace `totality-signups`. Variable name must be exactly `SIGNUPS` —
   that's what the code reads.
5. **Deploy.** First deploy gives you `<project>.pages.dev`.
6. **Secret-free:** no env vars, no API keys — the endpoint calls nothing
   external. If you ever see a key prompt for this project, something's wrong.
7. **Done-test (yours):** on your phone, at the live URL, submit an email →
   dashboard → KV → `totality-signups` → see the row. Not done until the row
   is visible.

## If the form fails on the live URL

- 500 "Server misconfigured" = the `SIGNUPS` binding is missing or misnamed → step 4.
- 405 = something is POSTing that isn't the form; endpoint is POST-only by design.
- Rows missing but form says success = wrong namespace bound (check you're
  looking at `totality-signups`, not another project's namespace).
