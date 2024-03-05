// For demo purposes only

// docs: https://nextjs.org/docs/app/building-your-application/routing/middleware

// latest info on why middleware may run multiple times: https://github.com/vercel/next.js/issues/39917

export function middleware(/* request */) {
    // Uncomment these to see them in action in the server console
    // console.log('this is a users route and this message comes from middleware');
    // console.log(request.nextUrl.pathname);
}

// regex can be used here using path-to-regexp:
// https://github.com/pillarjs/path-to-regexp#path-to-regexp-1
// export const config = {
//     matcher: '/users/(.*)',
// }
