const PUBLIC_PATH_PATTERNS = [/^\/login(?:\/|$)/, /^\/api\/login(?:\/|$)/];
const PUBLIC_FILE_EXTENSIONS = new Set([
  ".css",
  ".js",
  ".png",
  ".svg",
  ".jpg",
  ".jpeg",
  ".gif",
  ".webp",
  ".ico",
  ".txt",
  ".map",
  ".json",
  ".woff",
  ".woff2",
]);

function hasPublicExtension(pathname: string): boolean {
  const lastDotIndex = pathname.lastIndexOf(".");
  if (lastDotIndex === -1) {
    return false;
  }
  const extension = pathname.slice(lastDotIndex).toLowerCase();
  return PUBLIC_FILE_EXTENSIONS.has(extension);
}

function isPublicPath(pathname: string): boolean {
  return (
    PUBLIC_PATH_PATTERNS.some((pattern) => pattern.test(pathname)) ||
    hasPublicExtension(pathname)
  );
}

export async function onRequest(context: any) {
  const { request, env } = context;
  const url = new URL(request.url);
  const pathname = url.pathname;
  
  try {
    // 允许访问登录页面和登录API
    if (pathname === '/login' || pathname === '/api/login') {
      return context.next();
    }
    
    // 允许访问静态资源
    const isStaticResource = hasPublicExtension(pathname);
    if (isStaticResource) {
      return context.next();
    }
    
    const password = String(env.PASSWORD || "");
    
    // 如果未设置密码，直接放行
    if (password === "") {
      return context.next();
    }
    
    // 验证身份：检查cookie
    const cookie = request.headers.get('Cookie') || '';
    const authCookie = cookie.split(';').find(c => c.trim().startsWith('auth='));
    
    if (authCookie) {
      const authValue = authCookie.split('=')[1].trim();
      // 验证auth cookie是否正确
      if (authValue === btoa(password)) {
        return context.next();
      }
    }
    
    // 未登录或密码错误，重定向到登录页
    // 构造绝对URL，避免重定向问题
    const loginUrl = new URL('/login', url.origin);
    return Response.redirect(loginUrl.toString(), 302);
  } catch (error) {
    // 出错时直接放行，避免服务崩溃
    console.error('Middleware error:', error);
    return context.next();
  }
}
