import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export function middleware(request:NextRequest){
    const token = request.cookies.get('token')?.value

    const access = request.nextUrl.pathname.startsWith('/dashboard')
    if(access && token){
        return NextResponse.redirect(new URL('/register',request.url))
    }

    return NextResponse.next()

}