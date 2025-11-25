import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
  // Récupérer le token et le rôle depuis les cookies
  const token = request.cookies.get('token')?.value;
  const role = request.cookies.get('role')?.value;
  
  // Vérifier si l'URL commence par /admin
  if (request.nextUrl.pathname.startsWith('/admin')) {
    // Si pas de token ou pas le bon rôle, rediriger
    if (!token || role !== 'admin') {
      const loginUrl = new URL('/login', request.url);
      return NextResponse.redirect(loginUrl);
    }
    return NextResponse.next();
  }
  
  // Vérifier si l'URL est /account
  if (request.nextUrl.pathname.startsWith('/account')) {
    // Si pas de token ou pas le bon rôle, rediriger
    if (!token || role !== 'customer') {
      const loginUrl = new URL('/login', request.url);
      return NextResponse.redirect(loginUrl);
    }
    return NextResponse.next();
  }
  
  return NextResponse.next();
}

export const config = {
  matcher: [
    '/admin/:path*',
    '/account/:path*'
  ],
};