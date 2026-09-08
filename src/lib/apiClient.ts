/**
 * Safe API response parser that handles JSON, non-JSON (HTML 404/500/504),
 * and network errors gracefully without crashing on Unexpected token 'T'.
 */

export interface ApiResponse<T = any> {
  ok: boolean;
  status: number;
  data?: T;
  error?: string;
}

export async function parseJsonResponse<T = any>(res: Response): Promise<ApiResponse<T>> {
  const contentType = res.headers.get('content-type') || '';
  const isJson = contentType.toLowerCase().includes('application/json');

  if (isJson) {
    try {
      const data = await res.json();
      if (res.ok && data?.success !== false) {
        return { ok: true, status: res.status, data };
      }
      return {
        ok: false,
        status: res.status,
        data,
        error: data?.error || `Request failed with status ${res.status}.`,
      };
    } catch {
      const rawText = await res.text().catch(() => '');
      return {
        ok: false,
        status: res.status,
        error: `Server returned invalid JSON (HTTP ${res.status}): ${rawText.slice(0, 160)}`,
      };
    }
  }

  // Handle non-JSON responses (e.g. Vercel 404, 500, 502, 504 HTML pages)
  const rawText = await res.text().catch(() => '');
  let friendlyMessage = '';

  if (res.status === 404) {
    friendlyMessage =
      'API endpoint not found (HTTP 404). Please ensure Vercel Serverless Functions are deployed at /api/council/analyze.';
  } else if (res.status === 401) {
    friendlyMessage = 'Unauthorized (HTTP 401). Please verify your environment variables and API keys.';
  } else if (res.status === 400) {
    friendlyMessage = `Bad request (HTTP 400): ${rawText.slice(0, 160) || 'Invalid parameters provided.'}`;
  } else if (res.status === 504) {
    friendlyMessage = 'Analysis request timed out (HTTP 504). Please try Quick Mode or test with fewer providers.';
  } else if (res.status === 500) {
    friendlyMessage = `Server error (HTTP 500): ${rawText.slice(0, 160) || 'Internal server error occurred.'}`;
  } else {
    friendlyMessage = `Server returned HTTP ${res.status} (${res.statusText || 'Error'}): ${rawText.slice(0, 160)}`;
  }

  return {
    ok: false,
    status: res.status,
    error: friendlyMessage,
  };
}
