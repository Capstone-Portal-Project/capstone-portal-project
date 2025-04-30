import { clerkMiddleware, createRouteMatcher } from '@clerk/nextjs/server'

const isAdminRoute = createRouteMatcher(['/admin(.*)'])
const isInstructorRoute = createRouteMatcher(['/instructor(.*)'])
const isStudentRoute = createRouteMatcher(['/saved-projects(.*)'])
const isLoggedInRoute = createRouteMatcher([
  '/submit(.*)',
  '/browse(.*)',
])
export default clerkMiddleware(async (auth, req) => {

  // Restrict admin route to users with specific role
  if (isAdminRoute(req)) await auth.protect({ role: 'org:admin' });

  // Allow both instructors and admins
  if (isInstructorRoute(req)) {
    await auth.protect((has) => has({ role: 'org:instructor' }) || has({ role: 'org:admin' }));
  }

  // Restrict saved-projects route to students
  if (isStudentRoute(req)) await auth.protect({ role: 'org:student' });

  // Requires auth for these routes
  if (isLoggedInRoute(req)) await auth.protect();
});
