import { createTRPCRouter, publicProcedure } from "~/trpc/trpc";
import { z } from "zod";
import { db } from "~/server/db";
import { projectTracks } from "~/server/db/schema";

/**
 * Router for project track-related operations.
 * 
 * This router handles CRUD operations for project tracks, including fetching all project tracks,
 * fetching a project track by ID, and creating a new project track.
 */
export const projectTrackRouter = createTRPCRouter({
  /**
   * Fetch all project tracks.
   */
  getAll: publicProcedure.query(async () => {
    return db.select().from(projectTracks);
  }),

  /**
   * Fetch a project track by ID.
   */
  getById: publicProcedure.input(z.number()).query(async ({ input }) => {
    return db.select().from(projectTracks).where(projectTracks.track_id.eq(input)).first();
  }),

  /**
   * Create a new project track.
   */
  create: publicProcedure.input(z.object({
    name: z.string(),
    description: z.string(),
  })).mutation(async ({ input }) => {
    return db.insert(projectTracks).values(input).returning("*").first();
  }),
});