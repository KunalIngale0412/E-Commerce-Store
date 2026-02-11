import { NextResponse } from "next/server"
import { USER_DASHBOARD, WEBSITE_LOGIN } from "./routes/WebsiteRoute"
import { jwtVerify } from "jose"
import { ADMIN_DASHBOARD } from "./routes/AdminPanelRoute"

export async function middleware(request) {
    try {
        const pathname = request.nextUrl.pathname
        const hasToken = request.cookies.has('access_token')

        if(!hasToken){
            // if the user is not loggedin or trying to access protected route, redirect to login page.
            if(!pathname.startsWith('/auth')){
                return NextResponse.redirect(new URL (WEBSITE_LOGIN, request.nextUrl))
            }
            return NextResponse.next() // Allow access to auth route if not loggedin.
        }

        // verify token

        const access_token = request.cookies.get('access_token').value
        const {payload} = await jwtVerify(access_token, new TextEncoder().encode(process.env.SECRET_KEY))


        const role = payload.role

        // prevent logged-in users from accessing auth routes 

        if(pathname.startsWith('/auth')){
            return NextResponse.redirect(new URL(role === 'admin' ? ADMIN_DASHBOARD : USER_DASHBOARD, request.nextUrl))
        }


        // Protect admin routes from user who are not loggedin and don't they are admin. if the role is user if he is accessing to an admin dashboard that only we have to prevent and not give access. 
        // if the role is not admin but he is accessing to an admin dashboard we can redirect to that user to login dashboard that time.


        // Protect admin routes
        if(pathname.startsWith('/admin') && role !== 'admin'){
            return NextResponse.redirect(new URL (WEBSITE_LOGIN, request.nextUrl))
        }

        // Protect users routes go to see routes than websiteRoutes.js to see user dashboard name
         if(pathname.startsWith('/my-account') && role !== 'user'){
            return NextResponse.redirect(new URL (WEBSITE_LOGIN, request.nextUrl))
        }

       return NextResponse.next()
        
    } catch (error) {
        console.log(error);
            return NextResponse.redirect(new URL (WEBSITE_LOGIN, request.nextUrl))
    }
}

export const config ={
    matcher:['/admin/:path*', '/my-account/:path*','/auth/:path*'] // * means admin/dashboard, admin/category same for user
}