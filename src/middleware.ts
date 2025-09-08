import { NextResponse, NextRequest } from 'next/server'
 
export function middleware(request: NextRequest) {

    const path = request.nextUrl.pathname
    const isPublicPath =path ==='/signIn' || path === '/signUp'||path === '/'

    const token = request.cookies.get("token")?.value || ''
     
    if (isPublicPath && token){
       return NextResponse.redirect(new URL('/home', request.url))
    }

    if (!isPublicPath && !token){
       return NextResponse.redirect(new URL('/signIn', request.url))
    }
}

export const config = {
  matcher: ['/','/home','/signIn','/signUp'],
}