"use server"

import { db } from "~/server/db"
import { projects, projectLog } from "~/server/db/schema"
import { z } from "zod"
import { eq, and, sql } from "drizzle-orm"
import { sendLogEmail, projectLogTypes } from '~/server/mail/sendMail';
import { users } from "~/server/db/schema"
import { auth } from "@clerk/nextjs/server";

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
  projectStatus: z.enum(['draft', 'submitted', 'deferred', 'active', 'archived', 'incomplete']).optional(),
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
  const { userId: clerkUserId } = await auth();
  
  if (!clerkUserId) {
    return { error: true, message: "Unauthorized" };
  }

  const user = await db
    .select()
    .from(users)
    .where(eq(users.clerk_user_id, clerkUserId))
    .limit(1);

  if (!user.length) {
    return { error: true, message: "User not found" };
  }

  const userId = user[0]?.userId;
  
  if (!userId) {
    return { error: true, message: "Invalid user ID" };
  }

  const parseResult = projectFormSchema.safeParse(unsafeData);

  if (!parseResult.success) {
    return { error: true, message: "Invalid data: " + JSON.stringify(parseResult.error) }
  }

  const projectData = parseResult.data;

  try {
    const result = await db.insert(projects)
      .values(projectData)
      .returning({ projectId: projects.projectId })
      .execute();

    const projectId = result[0]?.projectId;

    if (!projectId) {
      throw new Error("Failed to create project: No project ID returned");
    }

    // Create project log entry for submission
    await db.insert(projectLog).values({
      projectId,
      userId,
      content: `Project submitted: ${projectData.projectTitle}`,
      projectLogType: 'submission'
    }).execute();

    // Send notifications
    const [creator] = await db
      .select({
        email: users.email,
        username: users.username
      })
      .from(users)
      .where(eq(users.userId, userId))
      .execute();

    if (creator) {
      await sendLogEmail(
        projectLogTypes.SUBMISSION,
        creator.email,
        creator.username,
        projectData.projectTitle,
        `/project/${projectId}`
      );
    }

    return { error: false, projectId };
  } catch (error) {
    console.error("Database error:", error);
    return { 
      error: true, 
      message: `Failed to create project: ${error instanceof Error ? error.message : 'Unknown error'}`
    };
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
  const parseResult = projectFormSchema.safeParse(unsafeData)

  if (!parseResult.success) {
    return { error: true, message: "Invalid data: " + JSON.stringify(parseResult.error) }
  }

  const projectData = parseResult.data

  try {
    await db.update(projects)
      .set(projectData)
      .where(eq(projects.projectId, projectId))
      .execute()

    return { error: false }
  } catch (error) {
    console.error("Database error:", error)
    return { 
      error: true, 
      message: `Failed to update project: ${error instanceof Error ? error.message : 'Unknown error'}`
    }
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

/**
 * Fetches all submitted projects.
 * 
 * @returns {Promise<{ projects: any[]; error: boolean; message?: string }>} The result of the fetch operation.
 */
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

/**
 * Updates the status of a project and sends notifications.
 * 
 * @param {number} projectId - The ID of the project to update.
 * @param {'approved' | 'rejected'} status - The new status of the project.
 * @param {string} [comments] - Optional comments about the status change.
 * @returns {Promise<{ error: boolean; message?: string }>} The result of the update operation.
 */
export async function updateProjectStatus(
  projectId: number, 
  status: 'approved' | 'rejected',
  comments?: string
) {
  try {
    // Get project info first
    const projectInfo = await db
      .select({
        projectTitle: projects.projectTitle
      })
      .from(projects)
      .where(eq(projects.projectId, projectId))
      .execute()

    if (!projectInfo.length) {
      throw new Error('Project not found')
    }

    // Get the most recent project log entry to get the userId
    const projectLogEntry = await db
      .select({
        userId: projectLog.userId
      })
      .from(projectLog)
      .where(eq(projectLog.projectId, projectId))
      .orderBy(sql`date_created DESC`)
      .limit(1)
      .execute()

    if (!projectLogEntry.length || !projectLogEntry[0]) {
      throw new Error('No project log entry found')
    }

    const userId = projectLogEntry[0].userId

    // Get creator info
    const creator = await db
      .select({
        email: users.email,
        username: users.username
      })
      .from(users)
      .where(eq(users.userId, userId))
      .execute()

    // Update project status
    await db.update(projects)
      .set({ projectStatus: status === 'approved' ? 'active' : 'deferred' })
      .where(eq(projects.projectId, projectId))
      .execute()

    // Create project log entry
    await db.insert(projectLog).values({
      projectId,
      userId,
      content: comments || `Project ${status}`,
      projectLogType: status === 'approved' ? 'approval' : 'deferment'
    }).execute()

    // Send email to creator if found
    if (creator[0] && projectInfo[0]) {
      await sendLogEmail(
        status === 'approved' ? projectLogTypes.APPROVAL : projectLogTypes.DEFERMENT,
        creator[0].email,
        creator[0].username,
        projectInfo[0].projectTitle,
        `/project/${projectId}`
      )
    }

    return { error: false }
  } catch (error) {
    console.error('Error updating project status:', error)
    return { 
      error: true, 
      message: error instanceof Error ? error.message : 'Failed to update project status'
    }
  }
}