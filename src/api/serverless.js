// Serverless wrappers for sensitive integrations. These hit backend endpoints
// so client-side secrets are never exposed. Endpoints should be implemented
// separately; when unavailable, functions throw.

const SERVERLESS_BASE =
  import.meta?.env?.VITE_SERVERLESS_BASE_URL ||
  (typeof window !== 'undefined' ? window.location.origin : '');

const postJson = async (path, body) => {
  const res = await fetch(`${SERVERLESS_BASE}${path}`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(body || {}),
  });
  if (!res.ok) {
    const text = await res.text();
    throw new Error(`Serverless error ${res.status}: ${text}`);
  }
  return res.json();
};

export const serverlessLLM = async ({ prompt, response_json_schema }) => {
  return postJson('/api/llm', { prompt, response_json_schema });
};

export const serverlessEmail = async ({ to, subject, html, body, from }) => {
  return postJson('/api/email', { to, subject, html, body, from });
};

export const serverlessImage = async ({ prompt, size }) => {
  return postJson('/api/image', { prompt, size });
};

