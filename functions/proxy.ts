const API_BASE_URL = "https://music-dl.sayqz.com/api";
const KUWO_HOST_PATTERN = /(^|\.)kuwo\.cn$/i;
const QQ_MUSIC_HOST_PATTERN = /(^|\.)qq\.com$/i;
const SAFE_RESPONSE_HEADERS = ["content-type", "cache-control", "accept-ranges", "content-length", "content-range", "etag", "last-modified", "expires", "x-source-switch"];

function createCorsHeaders(init?: Headers): Headers {
  const headers = new Headers();
  if (init) {
    for (const [key, value] of init.entries()) {
      if (SAFE_RESPONSE_HEADERS.includes(key.toLowerCase())) {
        headers.set(key, value);
      }
    }
  }
  if (!headers.has("Cache-Control")) {
    headers.set("Cache-Control", "no-store");
  }
  headers.set("Access-Control-Allow-Origin", "*");
  return headers;
}

function handleOptions(): Response {
  return new Response(null, {
    status: 204,
    headers: {
      "Access-Control-Allow-Origin": "*",
      "Access-Control-Allow-Methods": "GET,HEAD,OPTIONS",
      "Access-Control-Allow-Headers": "*",
      "Access-Control-Max-Age": "86400",
    },
  });
}

function isAllowedHost(hostname: string): boolean {
  if (!hostname) return false;
  return KUWO_HOST_PATTERN.test(hostname) || QQ_MUSIC_HOST_PATTERN.test(hostname);
}

function normalizeUrl(rawUrl: string): URL | null {
  try {
    const parsed = new URL(rawUrl);
    if (!isAllowedHost(parsed.hostname)) {
      return null;
    }
    if (parsed.protocol !== "http:" && parsed.protocol !== "https:") {
      return null;
    }
    parsed.protocol = "http:";
    return parsed;
  } catch {
    return null;
  }
}

async function proxyAudio(targetUrl: string, request: Request): Promise<Response> {
  const normalized = normalizeUrl(targetUrl);
  if (!normalized) {
    return new Response("Invalid target", { status: 400 });
  }

  const init: RequestInit = {
    method: request.method,
    headers: {
      "User-Agent": request.headers.get("User-Agent") ?? "Mozilla/5.0",
      "Referer": normalized.hostname.includes("kuwo") ? "https://www.kuwo.cn/" : "https://y.qq.com/",
    },
  };

  const rangeHeader = request.headers.get("Range");
  if (rangeHeader) {
    (init.headers as Record<string, string>)["Range"] = rangeHeader;
  }

  const upstream = await fetch(normalized.toString(), init);
  const headers = createCorsHeaders(upstream.headers);
  if (!headers.has("Cache-Control")) {
    headers.set("Cache-Control", "public, max-age=3600");
  }

  return new Response(upstream.body, {
    status: upstream.status,
    statusText: upstream.statusText,
    headers,
  });
}

async function proxyApiRequest(url: URL, request: Request): Promise<Response> {
  const apiUrl = new URL(API_BASE_URL, "https://music-dl.sayqz.com");
  url.searchParams.forEach((value, key) => {
    if (key === "target" || key === "callback") {
      return;
    }
    apiUrl.searchParams.set(key, value);
  });

  const upstream = await fetch(apiUrl.toString(), {
    headers: {
      "User-Agent": request.headers.get("User-Agent") ?? "Mozilla/5.0",
      "Accept": request.headers.get("Accept") ?? "application/json",
    },
  });

  const headers = createCorsHeaders(upstream.headers);
  if (!headers.has("Content-Type")) {
    headers.set("Content-Type", "application/json; charset=utf-8");
  }

  return new Response(upstream.body, {
    status: upstream.status,
    statusText: upstream.statusText,
    headers,
  });
}

export async function onRequest({ request }: { request: Request }): Promise<Response> {
  if (request.method === "OPTIONS") {
    return handleOptions();
  }

  if (request.method !== "GET" && request.method !== "HEAD") {
    return new Response("Method not allowed", { status: 405 });
  }

  const url = new URL(request.url);
  const target = url.searchParams.get("target");

  if (target) {
    return proxyAudio(target, request);
  }

  const pathname = url.pathname;

  if (pathname === "/status" || pathname === "/health") {
    return proxyApiRequest(url, request);
  }

  if (pathname.startsWith("/stats")) {
    return proxyApiRequest(url, request);
  }

  return proxyApiRequest(url, request);
}
