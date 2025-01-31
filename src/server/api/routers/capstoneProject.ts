import { z } from "zod";
import { createTRPCRouter, publicProcedure } from "../../../trpc/trpc";
import { capstoneProjects } from "../../db/schema";
import { db } from "~/server/db";

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
    cp_title: z.string().min(2).max(256),
    cp_description: z.string().min(10),
    cp_objectives: z.string().min(10),
    course_id: z.number(),
    cp_archived: z.boolean()
  })).mutation(async ({ input }) => {
    try {
      console.log("Attempting to insert project with data:", input);
      
      const result = await db.insert(capstoneProjects)
        .values(input)
        .returning({
          cp_id: capstoneProjects.cp_id,
          cp_title: capstoneProjects.cp_title,
          cp_description: capstoneProjects.cp_description,
          cp_objectives: capstoneProjects.cp_objectives,
          course_id: capstoneProjects.course_id,
          cp_archived: capstoneProjects.cp_archived
        })
        .execute();
      
      console.log("Insert result:", result);
      return result[0];
    } catch (error) {
      console.error("Database error:", error);
      throw new Error(`Failed to create project: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }),

  /**
   * Delete a capstone project by ID.
   */
  delete: publicProcedure.input(z.number()).mutation(async ({ input }) => {
    return db.delete(capstoneProjects)
      .where(capstoneProjects.cp_id.eq(input))
      .returning();
  }),
});