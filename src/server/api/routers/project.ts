"use server"

import { db } from "~/server/db"
import { projects } from "~/server/db/schema"
import { z } from "zod"
import { eq } from "drizzle-orm"

/**
 * Schema for validating project form data.
 */
const projectFormSchema = z.object({
  programsId: z.number(),
  projectTitle: z.string().min(2).max(256),
  appImage: z.string().optional(),
  appVideo: z.string().optional(),
  appOrganization: z.string(),
  appDescription: z.string(),
  appObjectives: z.string(),
  appMotivations: z.string(),
  appMinQualifications: z.string(),
  appPrefQualifications: z.string(),
  showcaseDescription: z.string().optional(),
  showcaseImage: z.string().optional(),
  showcaseVideo: z.string().optional(),
  isShowcasePublished: z.boolean().optional(),
  sequenceId: z.number().optional(),
  sequenceReport: z.string().optional(),
  projectGithubLink: z.string().optional()
})

/**
 * Creates a new project.
 * 
 * @param {z.infer<typeof projectFormSchema>} unsafeData - The data to create the project with.
 * @returns {Promise<{ error: boolean; message?: string; projectId?: number }>} The result of the creation operation.
 */
export async function createProject(
  unsafeData: z.infer<typeof projectFormSchema>
): Promise<{ error: boolean; message?: string; projectId?: number }> {
  const parseResult = projectFormSchema.safeParse(unsafeData)

  if (!parseResult.success) {
    return { error: true, message: "Invalid data: " + JSON.stringify(parseResult.error) }
  }

  const data = parseResult.data

  try {
    const result = await db.insert(projects)
      .values(data)
      .returning({ projectId: projects.projectId })
      .execute()

    return { 
      error: false, 
      projectId: result[0]?.projectId 
    }
  } catch (error) {
    // Log the actual error for debugging
    console.error("Database error:", error)
    return { 
      error: true, 
      message: `Failed to create project: ${error instanceof Error ? error.message : 'Unknown error'}`
    }
  }
}

/**
 * Updates an existing project.
 * 
 * @param {number} projectId - The ID of the project to update.
 * @param {z.infer<typeof projectFormSchema>} unsafeData - The new data for the project.
 * @returns {Promise<{ error: boolean; message?: string }>} The result of the update operation.
 */
export async function updateProject(
  projectId: number,
  unsafeData: z.infer<typeof projectFormSchema>
): Promise<{ error: boolean; message?: string }> {
  const { success, data } = projectFormSchema.safeParse(unsafeData)

  if (!success) {
    return { error: true, message: "Invalid data" }
  }

  try {
    await db.update(projects)
      .set(data)
      .where(eq(projects.projectId, projectId))
      .execute()

    return { error: false }
  } catch (error) {
    return { error: true, message: "Failed to update project" }
  }
}

export async function getProjectById(projectId: number) {
  try {
    const projectResult = await db
      .select()
      .from(projects)
      .where(eq(projects.projectId, projectId))
      .limit(1)

    const project = projectResult[0] ?? null
    return { project, error: false }
  } catch (error) {
    return { project: null, error: true, message: "Failed to fetch project" }
  }

}

/**
 * Fetches all projects.
 * 
 * @returns {Promise<{ projects: any[]; error: boolean; message?: string }>} The result of the fetch operation.
 */
export async function getAllProjects() {
  try {
    const allProjects = await db.select().from(projects)
    return { projects: allProjects, error: false }
  } catch (error) {
    return { projects: [], error: true, message: "Failed to fetch projects" }
  }
}

/**
 * Fetches all projects for a specific program.
 * 
 * @param {number} programId - The ID of the program to fetch projects for.
 * @returns {Promise<{ projects: any[]; error: boolean; message?: string }>} The result of the fetch operation.
 */
export async function getProjectsByProgram(programId: number) {
  try {
    const programProjects = await db
      .select()
      .from(projects)
      .where(eq(projects.programsId, programId))
    return { projects: programProjects, error: false }
  } catch (error) {
    return { projects: [], error: true, message: "Failed to fetch program projects" }
  }
}

/**
 * Fetches all archived projects.
 * 
 * @returns {Promise<{ projects: any[]; error: boolean; message?: string }>} The result of the fetch operation.
 */
export async function getBrowseProjects() {
    try {
        const archivedProjects = await db
            .select()
            .from(projects)
            .where(eq(projects.isShowcasePublished, false))
        return { projects: archivedProjects, error: false }
    } catch ( error ) {
        return { projects: [], error: true, message: "Failed to fetch archived projects" }
    }
}

/**
 * Fetches all showcase projects.
 * 
 * @returns {Promise<{ projects: any[]; error: boolean; message?: string }>} The result of the fetch operation.
 */
export async function getShowcaseProjects() {
  try {
    const showcaseProjects = await db
      .select()
      .from(projects)
      .where(eq(projects.isShowcasePublished, true))
    return { projects: showcaseProjects, error: false }
  } catch (error) {
    return { projects: [], error: true, message: "Failed to fetch showcase projects" }
  }
}