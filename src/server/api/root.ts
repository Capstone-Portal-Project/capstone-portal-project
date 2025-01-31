import { createTRPCRouter } from "~/trpc/trpc";
import { userRouter } from "./routers/user";
import { courseRouter } from "./routers/course";
import { projectTrackRouter } from "./routers/projectTrack";
import { capstoneProjectRouter } from "./routers/capstoneProject";
import { savedProjectRouter } from "./routers/savedProject";
import { reviewRouter } from "./routers/review";

/**
 * The main router for the TRPC API.
 * 
 * This router combines all the individual routers for different resources
 * such as users, courses, project tracks, capstone projects, saved projects, and reviews.
 */
export const appRouter = createTRPCRouter({
  users: userRouter,
  courses: courseRouter,
  capstoneProjects: capstoneProjectRouter,
  savedProjects: savedProjectRouter,
  reviews: reviewRouter,
});

/**
 * Type definition for the main router.
 */
export type AppRouter = typeof appRouter;