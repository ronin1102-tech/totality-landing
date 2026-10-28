// functions/api/subscribe.js — Cloudflare Pages Function.
//
// POST /api/subscribe → validate email → write one row to KV → JSON contract.
// Contract (carried from the Astro landing pattern, vendor calls dropped):
//   200 { success: true }
//   400 { error: "Invalid request body" | "Please provide a valid email address" }
//   405 { error: "Method not allowed" }
//   500 { error: "Server misconfigured" | "Server error" }
//
// Required: KV namespace bound as SIGNUPS (Tracy creates + binds at deploy;
// no code change needed — the binding is environment, not code).
// Key: signup:<ISO8601 ts>:<sanitized email>  — sortable, collision-proof.
// Value: {"email": "...", "ts": "...", "ua": "..."} — exact email as typed.
// Zero third-party calls. No stubs. (Tracy's explicit no-vendor rule, 2026-10-28.)

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export async function onRequestPost(context) {
  const { request, env } = context;

  // Belt-and-suspenders method guard: exporting only onRequestPost already
  // makes non-POST requests 405 in the CF runtime; this explicit check makes
  // that path provable in the local contract test too.
  if (request.method !== 'POST') {
    return jsonResponse({ error: 'Method not allowed' }, 405);
  }

  if (!env || !env.SIGNUPS) {
    console.error('KV binding SIGNUPS is missing');
    return jsonResponse({ error: 'Server misconfigured' }, 500);
  }

  let email;
  try {
    const body = await request.json();
    email = typeof body.email === 'string' ? body.email.trim() : '';
  } catch {
    return jsonResponse({ error: 'Invalid request body' }, 400);
  }

  if (!email || !EMAIL_RE.test(email)) {
    return jsonResponse({ error: 'Please provide a valid email address' }, 400);
  }

  const ts = new Date().toISOString();
  // Key-safe email: KV keys allow most chars; this keeps dashboard rows readable
  // and collision-proof. The value JSON keeps the email exactly as submitted.
  const keyEmail = email.toLowerCase().replace(/[^a-z0-9@._-]/g, '_');
  const key = 'signup:' + ts + ':' + keyEmail;
  const ua = request.headers.get('user-agent') || '';

  try {
    await env.SIGNUPS.put(key, JSON.stringify({ email: email, ts: ts, ua: ua }));
    return jsonResponse({ success: true }, 200);
  } catch (err) {
    console.error('KV write failed:', err);
    return jsonResponse({ error: 'Server error' }, 500);
  }
}

function jsonResponse(data, status) {
  return new Response(JSON.stringify(data), {
    status: status,
    headers: { 'Content-Type': 'application/json' }
  });
}
