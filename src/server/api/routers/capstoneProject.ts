import { z } from "zod";
import { createTRPCRouter, publicProcedure } from "../../../trpc/trpc";
import { capstoneProjects, capstoneProjectCourses } from "../../db/schema";
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
    course_ids: z.array(z.number()), // Update to array of numbers
    cp_image: z.string().url().optional(),
    cp_archived: z.boolean(),
  })).mutation(async ({ input }) => {
    try {
      console.log("Attempting to insert project with data:", input);
      
      const projectResult = await db.insert(capstoneProjects)
        .values({
          cp_title: input.cp_title,
          cp_description: input.cp_description,
          cp_objectives: input.cp_objectives,
          cp_image: input.cp_image ?? "",
          cp_archived: input.cp_archived,
          course_id: input.course_ids[0],
        })
        .returning()
        .execute();
      
      const projectId = projectResult[0].cp_id;

      // Insert all course associations
      for (const courseId of input.course_ids) {
        await db.insert(capstoneProjectCourses)
          .values({
            cp_id: projectId,
            course_id: courseId,
          })
          .execute();
      }

      console.log("Insert result:", projectResult);
      return projectResult[0];
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