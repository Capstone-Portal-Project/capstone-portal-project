import { createTRPCRouter, publicProcedure } from "~/trpc/trpc";
import { z } from "zod";
import { db } from "~/server/db";
import { savedProjects } from "~/server/db/schema";
import { eq } from "drizzle-orm";

/**
 * Router for saved project-related operations.
 * 
 * This router handles CRUD operations for saved projects, including fetching all saved projects,
 * fetching a saved project by ID, creating a new saved project, and deleting a saved project.
 */
export const savedProjectRouter = createTRPCRouter({
  /**
   * Fetch all saved projects.
   */
  getAll: publicProcedure.query(async () => {
    return db.select().from(savedProjects);
  }),

  /**
   * Fetch a saved project by ID.
   */
  getById: publicProcedure.input(z.number()).query(async ({ input }) => {
    return db.select().from(savedProjects).where(savedProjects.save_id.eq(input)).first();
  }),

  /**
   * Create a new saved project.
   */
  create: publicProcedure.input(z.object({
    u_id: z.number(),
    cp_id: z.number(),
  })).mutation(async ({ input }) => {
    return db.insert(savedProjects).values(input).returning("*").first();
  }),

  /**
   * Delete a saved project by ID.
   */
  delete: publicProcedure
    .input(z.number())
    .mutation(async ({ input }) => {
      return db.delete(savedProjects)
        .where(eq(savedProjects.save_id, input))
        .returning();
    }),
});