"use server"

import { db } from "~/server/db"
import { projects, projectLog } from "~/server/db/schema"
import { z } from "zod"
import { eq, and } from "drizzle-orm"
import { sendLogEmail, projectLogTypes } from '~/server/mail/sendMail';
import { users } from "~/server/db/schema"

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
  projectGithubLink: z.string().optional(),
  projectStatus: z.enum(['draft', 'submitted', 'deferred', 'active', 'archived', 'incomplete']).optional()
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
        const activeProjects = await db
            .select()
            .from(projects)
            .where(
                and(
                    eq(projects.projectStatus, 'active'),
                    eq(projects.isShowcasePublished, false)
                )
            )
        return { projects: activeProjects, error: false }
    } catch (error) {
        return { projects: [], error: true, message: "Failed to fetch active projects" }
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

export async function getSubmittedProjects() {
  try {
    const submittedProjects = await db
      .select({
        projectId: projects.projectId,
        projectTitle: projects.projectTitle,
        appDescription: projects.appDescription,
        appOrganization: projects.appOrganization,
        programsId: projects.programsId
      })
      .from(projects)
      .where(eq(projects.projectStatus, 'submitted'))
      .execute();
   
    return { 
      error: false, 
      projects: submittedProjects 
    };
  } catch (error) {
    console.error('Error fetching submitted projects:', error);
    return { 
      error: true, 
      message: 'Failed to fetch submitted projects',
      projects: [] 
    };
  }
}

export async function updateProjectStatus(projectId: number, status: 'approved' | 'rejected') {
  try {
    // First update the project status
    await db.update(projects)
      .set({ projectStatus: status === 'approved' ? 'active' : 'archived' })
      .where(eq(projects.projectId, projectId))
      .execute();

    // Get the first instructor user (temporary solution)
    const instructors = await db
      .select({
        userId: users.userId,
      })
      .from(users)
      .where(eq(users.type, 'instructor'))
      .limit(1)
      .execute();

    const instructor = instructors[0];
    if (!instructor) {
      throw new Error('No instructor found');
    }

    // Create a project log entry with the instructor's user ID
    await db.insert(projectLog).values({
      projectId,
      userId: instructor.userId,
      content: `Project ${status}`,
      projectLogType: status === 'approved' ? 'approval' : 'deferment',
    }).execute();

    return { error: false };
  } catch (error) {
    console.error('Error updating project status:', error);
    return { 
      error: true, 
      message: error instanceof Error ? error.message : 'Failed to update project status'
    };
  }
}

// TO-DO: Create Functions for Sending Rejection and Acceptance Emails