"use server";

import { db } from "~/server/db";
import { savedProjects } from "~/server/db/schema";
import { z } from "zod";

const savedProjectSchema = z.object({
  studentId: z.number(),
  projectId: z.number(),
  saveIndex: z.number(),
  preferenceDescription: z.string().optional(),
});

export async function getAllSavedProjects() {
  try {
    const projects = await db.select().from(savedProjects);
    return { projects, error: false };
  } catch (error) {
    return { projects: [], error: true, message: "Failed to fetch saved projects" };
  }
}


export async function createSavedProject(
  unsafeData: z.infer<typeof savedProjectSchema>
): Promise<{ error: boolean; message?: string }> {
  const { success, data } = savedProjectSchema.safeParse(unsafeData);

  if (!success) {
    return { error: true, message: "Invalid data" };
  }

  try {
    await db.insert(savedProjects).values({
      studentId: data.studentId,
      projectId: data.projectId,
      saveIndex: data.saveIndex,
      preferenceDescription: data.preferenceDescription,
    });

    return { error: false };
  } catch (error) {
    return { error: true, message: "Failed to save project" };
  }
}