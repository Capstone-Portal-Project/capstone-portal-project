"use server"

import { db } from "~/server/db"
import { savedProjects } from "~/server/db/schema"
import { z } from "zod"
import { eq, and, gt, sql} from "drizzle-orm"

/**
 * Schema for validating saved project data.
 */
const savedProjectSchema = z.object({
  userId: z.number(),
  projectId: z.number(),
  saveIndex: z.number(),
  preferenceDescription: z.string().optional()
})

/**
 * Creates a new saved project.
 * 
 * @param {z.infer<typeof savedProjectSchema>} unsafeData - The data to save the project with.
 * @returns {Promise<{ error: boolean; message?: string; saveId?: number }>} The result of the save operation.
 */
export async function createSavedProject(
  unsafeData: z.infer<typeof savedProjectSchema>
): Promise<{ error: boolean; message?: string; saveId?: number }> {
  const { success, data } = savedProjectSchema.safeParse(unsafeData);

  if (!success) {
    return { error: true, message: "Invalid data" };
  }

  try {
    // Check if the project already exists for the user
    const existingProject = await db
      .select()
      .from(savedProjects)
      .where(and(eq(savedProjects.userId, data.userId), eq(savedProjects.projectId, data.projectId)));

    if (existingProject.length > 0) {
      return { error: true, message: "Project already saved for this user" };
    }
    const result = await db.insert(savedProjects)
      .values(data)
      .returning({ saveId: savedProjects.saveId })
      .execute();

    return { 
      error: false, 
      saveId: result[0]?.saveId 
    };
  } catch (error) {
    return { error: true, message: "Failed to save project" };
  }
}

/**
 * Updates an existing saved project.
 * 
 * @param {number} saveId - The ID of the saved project to update.
 * @param {Partial<z.infer<typeof savedProjectSchema>>} unsafeData - The new data for the saved project.
 * @returns {Promise<{ error: boolean; message?: string }>} The result of the update operation.
 */
export async function updateSavedProject(
  saveId: number,
  unsafeData: Partial<z.infer<typeof savedProjectSchema>>
): Promise<{ error: boolean; message?: string }> {
  const { success, data } = savedProjectSchema.partial().safeParse(unsafeData)

  if (!success) {
    return { error: true, message: "Invalid data" }
  }

  try {
    await db.update(savedProjects)
      .set(data)
      .where(eq(savedProjects.saveId, saveId))
      .execute()

    return { error: false }
  } catch (error) {
    return { error: true, message: "Failed to update saved project" }
  }
}

/**
 * Fetches all saved projects for a specific user.
 * 
 * @param {number} userId - The ID of the user to fetch saved projects for.
 * @returns {Promise<{ savedProjects: any[]; error: boolean; message?: string }>} The result of the fetch operation.
 */
export async function getSavedProjectsByUser(userId: number) {
  try {
    const userSavedProjects = await db
      .select()
      .from(savedProjects)
      .where(eq(savedProjects.userId, userId))
      .orderBy(savedProjects.saveIndex)
    return { savedProjects: userSavedProjects, error: false }
  } catch (error) {
    return { savedProjects: [], error: true, message: "Failed to fetch saved projects" }
  }
}

/**
 * Deletes a saved project and updates the saveIndex for remaining projects.
 * 
 * @param {number} saveId - The ID of the saved project to delete.
 * @returns {Promise<{ error: boolean; message?: string }>} The result of the deletion operation.
 */
export async function deleteSavedProject(saveId: number) {
  try {
    // Get the project to be deleted
    const projectToDelete = await db
      .select()
      .from(savedProjects)
      .where(eq(savedProjects.saveId, saveId));

    if (!projectToDelete || projectToDelete.length === 0) {
      return { error: true, message: "Project not found" };
    }

    const  saveIndex  = projectToDelete[0]?.saveIndex;
    const  userId  = projectToDelete[0]?.userId;
    if (saveIndex === undefined || userId === undefined) {
      return { error: true, message: "Invalid project data" };
    }
    // Delete the selected project
    await db
      .update(savedProjects)
      .set({ saveIndex: sql`${savedProjects.saveIndex} - 1` })
      .where(and(eq(savedProjects.userId, userId), gt(savedProjects.saveIndex, saveIndex)))
      .execute();
      
    await db
      .delete(savedProjects)
      .where(eq(savedProjects.saveId, saveId))
      .execute();

    return { error: false };
  } catch (error) {
    console.error("Error deleting saved project:", error);
    return { error: true, message: "Failed to delete saved project" };
  }
}



/**
 * Fetches the highest saveIndex for a specific user.
 * 
 * @param {number} userId - The ID of the user to fetch the highest saveIndex for.
 * @returns {Promise<number>} The highest saveIndex for the user or 0 if no saved projects exist.
 */
export async function getHighestSaveIndex(userId: number): Promise<number> {
  try {
    const result = await db
      .select()
      .from(savedProjects)
      .where(eq(savedProjects.userId, userId))
    return result.length+1
  } catch (error) {
    console.error("Failed to fetch highest saveIndex", error)
    return 0
  }
}


export async function updateRankAndGetProjects(
  saveId: number,
  userId: number,
  direction: 'up' | 'down'
) {
  try {
    const currentProject = await db
  .select()
  .from(savedProjects)
  .where(eq(savedProjects.saveId, saveId));

if (!currentProject || currentProject.length === 0) {
  return { error: true, message: "Project not found" };
}

// At this point, TypeScript knows currentProject is non-empty
const project = currentProject[0];

if (!project) {
  return { error: true, message: "Project not found" };  // Safeguard if somehow project is still undefined
}

const newSaveIndex = direction === 'up' ? project.saveIndex - 1 : project.saveIndex + 1;



    // Update the project with the new saveIndex
    const updateResult = await updateSavedProject(saveId, { saveIndex: newSaveIndex });

    if (updateResult.error) {
      return { error: true, message: "Failed to update project rank" };
    }

    // If the saveIndex reaches a certain value (e.g., 0), we delete the project
    if (newSaveIndex <= 0) {
      const deleteResult = await deleteSavedProject(saveId);
      if (deleteResult.error) {
        return { error: true, message: "Failed to delete project after rank update" };
      }
    }

    // Fetch the updated list of saved projects for the user
    const savedProjectsResult = await getSavedProjectsByUser(userId);

    if (savedProjectsResult.error) {
      return { error: true, message: "Failed to fetch updated list of projects" };
    }

    return { error: false, savedProjects: savedProjectsResult.savedProjects };
  } catch (error) {
    console.error("Error updating rank and fetching projects:", error);
    return { error: true, message: "An unexpected error occurred" };
  }
}

