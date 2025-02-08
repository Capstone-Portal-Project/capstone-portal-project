import { clerkMiddleware, createRouteMatcher } from '@clerk/nextjs/server'

const isAdminRoute = createRouteMatcher(['\/admin(.*)'])
const isInstructorRoute = createRouteMatcher(['\/instructor(.*)'])
const isLoggedInRoute = createRouteMatcher(['\/saved-projects(.*)'])

export default clerkMiddleware(async (auth, req) => {

  // Restrict admin route to users with specific role
  if (isAdminRoute(req)) await auth.protect({ role: 'org:admin' })
  if (isInstructorRoute(req)) await auth.protect({ role: 'org:instructor' })
  if (isLoggedInRoute(req)) await auth.protect({ role: 'org:student' })
})