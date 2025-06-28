import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
 
// This function can be marked `async` if using `await` inside
export function middleware(request: NextRequest) {
const path = request.nextUrl.pathname;
const isPathLocal = path === '/login' || path === '/signup' || path === '/verifyemail';

//check if the token is set or not 
const token = request.cookies.get('token');
console.log("Token from cookies: ", token ? token.value : "No token found");
if(isPathLocal && token){
  return NextResponse.redirect(new URL('/profile', request.nextUrl))
}else if(!isPathLocal && !token){
  // If the path is not local and token is not set, redirect to the login page
  return NextResponse.redirect(new URL('/login', request.nextUrl))
}
}
 
// See "Matching Paths" below to learn more
export const config = {
  matcher: [
    '/',
    '/login',
    '/signup',
    '/verifyemail',
    '/profile',
  ]

}