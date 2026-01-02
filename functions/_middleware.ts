// 简化版中间件 - 确保网站能够正常访问
// 只处理登录验证，避免复杂逻辑导致服务崩溃

export async function onRequest(context: any) {
  const { request, env } = context;
  
  try {
    // 解析URL
    const url = new URL(request.url);
    const pathname = url.pathname;
    
    // 1. 直接放行登录页面和登录API
    if (pathname === '/login' || pathname === '/api/login') {
      return context.next();
    }
    
    // 2. 直接放行静态资源
    const staticExtensions = ['.css', '.js', '.png', '.svg', '.jpg', '.jpeg', '.gif', '.ico', '.webp', '.woff', '.woff2'];
    const isStatic = staticExtensions.some(ext => pathname.endsWith(ext));
    if (isStatic) {
      return context.next();
    }
    
    // 3. 获取密码配置
    const password = env.PASSWORD;
    
    // 4. 如果未设置密码，直接放行所有请求
    if (!password) {
      return context.next();
    }
    
    // 5. 简单的密码验证逻辑
    const cookie = request.headers.get('Cookie') || '';
    const expectedAuth = `auth=${btoa(String(password))}`;
    
    // 6. 如果cookie匹配，放行请求
    if (cookie.includes(expectedAuth)) {
      return context.next();
    }
    
    // 7. 否则重定向到登录页
    const loginUrl = `${url.origin}/login`;
    return Response.redirect(loginUrl, 302);
    
  } catch (error) {
    // 任何错误都直接放行，确保网站能够访问
    console.error('Middleware error - allowing request to proceed:', error);
    return context.next();
  }
}
