import { createTRPCRouter, publicProcedure } from "~/trpc/trpc";
import { z } from "zod";
import { db } from "~/server/db";
import { capstoneProjects } from "~/server/db/schema";
import { eq } from "drizzle-orm";

/**
 * Router for capstone project-related operations.
 * 
 * This router handles CRUD operations for capstone projects, including fetching all capstone projects,
 * fetching a capstone project by ID, creating a new capstone project, and deleting a capstone project.
 */
export const capstoneProjectRouter = createTRPCRouter({
  /**
   * Fetch all capstone projects.
   */
  getAll: publicProcedure.query(async () => {
    return db.select().from(capstoneProjects);
  }),

  /**
   * Fetch a capstone project by ID.
   */
  getById: publicProcedure.input(z.number()).query(async ({ input }) => {
    return db.select().from(capstoneProjects).where(capstoneProjects.cp_id.eq(input)).first();
  }),

  /**
   * Create a new capstone project.
   */
  create: publicProcedure.input(z.object({
    course_id: z.number(),
    track_id: z.number(),
    cp_title: z.string(),
    cp_description: z.string(),
    cp_objectives: z.string(),
    cp_archived: z.boolean(),
  })).mutation(async ({ input }) => {
    return db.insert(capstoneProjects).values(input).returning("*").first();
  }),

  /**
   * Delete a capstone project by ID.
   */
  delete: publicProcedure
    .input(z.number())
    .mutation(async ({ input }) => {
      return db.delete(capstoneProjects)
        .where(eq(capstoneProjects.cp_id, input))
        .returning();
    }),
});