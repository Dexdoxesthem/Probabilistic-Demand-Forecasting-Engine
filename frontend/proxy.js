import { NextResponse } from 'next/server';

export const config = {
  matcher: '/:path*', // Protect all routes
};

export function middleware(req) {
  const basicAuth = req.headers.get('authorization');
  const url = req.nextUrl;

  // Bypass auth for public assets if needed, but here we protect everything
  if (basicAuth) {
    const authValue = basicAuth.split(' ')[1];
    const [user, pwd] = atob(authValue).split(':');

    // Secure credentials fetched from Vercel Environment Variables
    const validUser = process.env.SECURE_USER;
    const validPass = process.env.SECURE_PASSWORD;

    if (user === validUser && pwd === validPass) {
      return NextResponse.next();
    }
  }

  // Trigger browser's native basic auth login prompt
  url.pathname = '/api/auth';
  return new NextResponse('Auth required', {
    status: 401,
    headers: {
      'WWW-Authenticate': 'Basic realm="Secure Dashboard"',
    },
  });
}
