import { createTRPCRouter, publicProcedure } from "~/trpc/trpc";
import { z } from "zod";
import { db } from "~/server/db";
import { courses } from "~/server/db/schema";

/**
 * Router for course-related operations.
 * 
 * This router handles CRUD operations for courses, including fetching all courses,
 * fetching a course by ID, and creating a new course.
 */
export const courseRouter = createTRPCRouter({
  /**
   * Fetch all courses.
   */
  getAll: publicProcedure.query(async () => {
    return db.select().from(courses);
  }),

  /**
   * Fetch a course by ID.
   */
  getById: publicProcedure.input(z.string()).query(async ({ input }) => {
    return db.select().from(courses).where(courses.course_id.eq(input)).first();
  }),

  /**
   * Create a new course.
   */
  create: publicProcedure.input(z.object({
    course_id: z.string(),
    u_id: z.number(),
    term: z.string(),
    course_description: z.string(),
    is_archived: z.boolean(),
  })).mutation(async ({ input }) => {
    return db.insert(courses).values(input).returning("*").first();
  }),
});