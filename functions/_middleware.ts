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
  
  // 允许访问的路径列表
  const allowedPaths = [
    '/login',
    '/api/login'
  ];
  
  // 允许访问的文件扩展名
  const allowedExtensions = [
    '.css', '.js', '.png', '.svg', '.jpg', '.jpeg', '.gif',
    '.ico', '.webp', '.woff', '.woff2', '.ttf', '.otf'
  ];
  
  // 检查是否为静态资源
  const isStaticResource = allowedExtensions.some(ext => pathname.endsWith(ext));
  
  // 允许访问登录页面、登录API和静态资源
  if (allowedPaths.includes(pathname) || isStaticResource) {
    return context.next();
  }
  
  const password = String(env.PASSWORD || "");
  
  // 核心逻辑：只要PASSWORD环境变量不为空字符串，就必须验证密码
  if (password !== "") {
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
    return Response.redirect(new URL('/login', url).toString(), 302);
  }
  
  // 密码为空字符串或未设置，直接通过
  return context.next();
}
