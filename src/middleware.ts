// Temporarily disable auth middleware for development
// Authentication will be implemented later

// import { withAuth } from 'next-auth/middleware'

// export default withAuth(
//   function middleware(req) {
//     // Add any additional middleware logic here
//   },
//   {
//     callbacks: {
//       authorized: ({ token, req }) => {
//         // Check if user is trying to access protected routes
//         if (req.nextUrl.pathname.startsWith('/dashboard')) {
//           return !!token
//         }
//         if (req.nextUrl.pathname.startsWith('/projects')) {
//           return !!token
//         }
//         if (req.nextUrl.pathname.startsWith('/workspace')) {
//           return !!token
//         }
//         return true
//       },
//     },
//   }
// )

// Temporary middleware that allows all requests
import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

export function middleware(request: NextRequest) {
  // Allow all requests for now
  return NextResponse.next()
}

// export const config = {
//   matcher: [
//     '/dashboard/:path*',
//     '/projects/:path*',
//     '/workspace/:path*',
//     '/api/projects/:path*',
//     '/api/tasks/:path*',
//     '/api/notes/:path*',
//     '/api/payments/:path*',
//   ],
// } 