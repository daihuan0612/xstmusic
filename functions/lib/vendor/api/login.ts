const MAX_AGE_SECONDS = 48 * 60 * 60;

export async function onRequestPost(context: any) {
  const { request, env } = context;
  const url = new URL(request.url);

  const body = await request.json().catch(() => ({ password: "" }));
  const providedPassword = typeof body.password === "string" ? body.password : "";
  const password = String(env.PASSWORD || "");

  // 核心逻辑：只要PASSWORD环境变量不为空字符串，就必须验证密码
  if (password !== "") {
    // 验证密码
    if (providedPassword === password) {
      const cookieSegments = [
        `auth=${btoa(password)}`,
        `Max-Age=${MAX_AGE_SECONDS}`,
        "Path=/",
        "SameSite=Lax",
        "HttpOnly",
      ];
      if (url.protocol === "https:") {
        cookieSegments.push("Secure");
      }

      return new Response(JSON.stringify({ success: true }), {
        status: 200,
        headers: {
          "Content-Type": "application/json",
          "Set-Cookie": cookieSegments.join("; "),
        },
      });
    } else {
      // 密码错误
      return new Response(JSON.stringify({ success: false }), {
        status: 401,
        headers: { "Content-Type": "application/json" },
      });
    }
  }

  // 密码为空字符串，直接通过
  return new Response(JSON.stringify({ success: true }), {
    status: 200,
    headers: { "Content-Type": "application/json" },
  });
}
