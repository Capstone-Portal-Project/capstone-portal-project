# API Documentation

This document provides an overview of the database interaction and authentication helper functions available in the `src/server` directory. The documented functions allow you to interact with the database using Drizzle ORM, supporting data retrieval and manipulation for various resources. Authentication-related APIs are helper functions to interact with Clerk for user and organization management.

---

## Table of Contents
- [Authentication](#authentication)
- [Mail](#mail)
- [Database APIs](#database-apis)
  - [home.ts](#homets)
  - [program.ts](#programts)
  - [project.ts](#projectts)
  - [projectLog.ts](#projectlogts)
  - [savedProjects.ts](#savedprojectsts)
  - [sequence.ts](#sequencets)
  - [tag.ts](#tagts)
  - [team.ts](#teamts)
  - [term.ts](#termts)
  - [user.ts](#userts)

---

## Authentication

This section documents all authentication-related helper functions, primarily for integrating with Clerk. These functions handle user and organization management, role assignments, and invitations. They are used by backend processes to enforce access control and manage user roles within the Capstone Project Portal.

### createClerkOrganization
- **Function:** `createClerkOrganization`
- **Description:** Creates a new Clerk organization for a program using the provided name.
- **Parameters:**
  - `name` (string): The name of the organization to create.
- **Returns:**
  - On success: `string` (the ID of the created organization)
  - On error: `null` (logs error to console)
- **Authentication:** Requires server-side Clerk admin privileges
- **Errors:**
  - Clerk API errors (organization creation failure)

### addAdminsToOrganization
- **Function:** `addAdminsToOrganization`
- **Description:** Adds all users with the 'admin' type to a specified Clerk organization as organization admins.
- **Parameters:**
  - `organizationId` (string): The ID of the Clerk organization.
- **Returns:**
  - On success: `true`
  - On error: `false` (logs error to console)
- **Authentication:** Requires server-side Clerk admin privileges
- **Errors:**
  - Clerk API errors (membership creation failure)
  - Database errors (admin user fetch failure)

### addUserToOrganization
- **Function:** `addUserToOrganization`
- **Description:** Adds a user to a Clerk organization for a program with a specified role.
- **Parameters:**
  - `programId` (number): The ID of the program.
  - `clerkUserId` (string): The Clerk user ID of the user to add.
  - `role` (string): The role to assign (e.g., "org:admin", "org:instructor", "org:student").
- **Returns:**
  - On success: `true`
  - On error: `false` (logs error to console)
- **Authentication:** Requires server-side Clerk admin privileges
- **Errors:**
  - Clerk API errors (membership creation failure)
  - Program/organization not found

### changeUserRoleInOrganization
- **Function:** `changeUserRoleInOrganization`
- **Description:** Changes a user's role in a Clerk organization for a program.
- **Parameters:**
  - `programId` (number): The ID of the program.
  - `clerkUserId` (string): The Clerk user ID of the user.
  - `role` (string): The new role to assign.
- **Returns:**
  - On success: `true`
  - On error: `false` (logs error to console)
- **Authentication:** Requires server-side Clerk admin privileges
- **Errors:**
  - Clerk API errors (membership update failure)
  - Program/organization not found

### removeUserFromOrganization
- **Function:** `removeUserFromOrganization`
- **Description:** Removes a user from a Clerk organization for a program.
- **Parameters:**
  - `programId` (number): The ID of the program.
  - `clerkUserId` (string): The Clerk user ID of the user to remove.
- **Returns:**
  - On success: `true`
  - On error: `false` (logs error to console)
- **Authentication:** Requires server-side Clerk admin privileges
- **Errors:**
  - Clerk API errors (membership deletion failure)
  - Program/organization not found

### deleteOrganization
- **Function:** `deleteOrganization`
- **Description:** Deletes a Clerk organization by its ID.
- **Parameters:**
  - `organizationId` (string): The ID of the Clerk organization to delete.
- **Returns:**
  - On success: `true`
  - On error: `false` (logs error to console)
- **Authentication:** Requires server-side Clerk admin privileges
- **Errors:**
  - Clerk API errors (organization deletion failure)

### addAdminToAllOrganization
- **Function:** `addAdminToAllOrganization`
- **Description:** Adds a user as an admin to all Clerk organizations for all programs, or promotes them if already present.
- **Parameters:**
  - `clerk_user_id` (string): The Clerk user ID to promote to admin in all organizations.
- **Returns:**
  - On success: `true`
  - On error: `false` (logs error to console)
- **Authentication:** Requires server-side Clerk admin privileges
- **Errors:**
  - Clerk API errors (membership creation/update failure)
  - User not found
  - Program/organization not found

### removeAdminRole
- **Function:** `removeAdminRole`
- **Description:** Demotes an admin user to a different role (e.g., instructor or student) in their program and removes them from other organizations.
- **Parameters:**
  - `clerk_user_id` (string): The Clerk user ID to demote.
  - `role` (string): The new role to assign (must not be "org:admin").
- **Returns:**
  - On success: `true`
  - On error: `false` (logs error to console)
- **Authentication:** Requires server-side Clerk admin privileges
- **Errors:**
  - Clerk API errors (membership update/deletion failure)
  - User not found
  - Program/organization not found
  - If `role` is "org:admin", returns error and does not proceed

### inviteClerkUser
- **Function:** `inviteClerkUser`
- **Description:** Sends an invitation to a user to join Clerk using their email address.
- **Parameters:**
  - `emailAddress` (string): The email address to invite.
- **Returns:**
  - On success: `void` (logs invitation sent)
  - On error: Throws an error (logs error to console)
- **Authentication:** Requires server-side Clerk admin privileges
- **Errors:**
  - Clerk API errors (invitation failure)

## Mail

The mail functionality is used to support project submission processes and other notification needs within the Capstone Project Portal. It is implemented in `src/server/mail/mailer.ts` and leverages Gmail with OAuth2 authentication via Nodemailer and Google APIs.

### sendEmail
- **Function:** `sendEmail`
- **Description:** Sends an email using Gmail's OAuth2 authentication. Commonly used to notify users and instructors during project submission workflows and other portal events.
- **Parameters:**
  - `to` (string): The recipient's email address.
  - `cc` (Array<string>): An array of email addresses to be CC'd.
  - `subject` (string): The subject line of the email.
  - `htmlContent` (string): The HTML content of the email body.
- **Returns:**
  - On success: Logs the response from Gmail (no explicit return value).
  - On error: Logs the error to the console (no explicit return value).
- **Authentication:**
  - Uses Gmail OAuth2 credentials (client ID, client secret, refresh token) loaded from environment variables.
- **Errors:**
  - Any errors during the OAuth2 flow or email sending process are caught and logged to the console.

**Note:** This function is a backend utility and is not directly exposed as an API endpoint. It is called by other backend processes, especially those related to project submission and notification workflows.

## Database APIs

This section documents all database-related functions implemented using Drizzle ORM. These functions provide data retrieval, creation, update, and deletion for core resources such as programs, projects, teams, users, and more. They are used throughout the backend to support the portal's main features and workflows.

### home.ts

#### updateHomepageContent
- **Function:** `updateHomepageContent`
- **Description:** Validates and updates the homepage content in the database using Drizzle ORM and a Zod schema.
- **Parameters:**
  - `unsafeData` (object): Must include `heroTitle`, `heroSubtitle`, and `mainContent` (all strings, validated by Zod schema).
- **Returns:**
  - On success: `{ error: false }`
  - On validation error: `{ error: true, message: "Invalid data" }`
  - On DB error: `{ error: true, message: "Failed to update homepage content" }`
- **Authentication:** Not required
- **Errors:**
  - Validation errors
  - Database update errors

#### getHomepageContent
- **Function:** `getHomepageContent`
- **Description:** Fetches the homepage content from the database using Drizzle ORM.
- **Parameters:** None
- **Returns:**
  - On success: `{ content: <homepageContent>, error: false }`
  - On DB error: `{ content: null, error: true, message: "Failed to fetch homepage content" }`
- **Authentication:** Not required
- **Errors:**
  - Database fetch errors

### program.ts

#### createProgram
- **Function:** `createProgram`
- **Description:** Creates a new program/course, a corresponding Clerk organization, and assigns instructors if provided. Updates the program with the Clerk organization ID and adds admin users to the organization.
- **Parameters:**
  - `unsafeData` (object): Program data (validated by Zod schema) and optional `selected_instructors` array.
- **Returns:**
  - On success: `{ error: false, programId }`
  - On validation error: `{ error: true, message: "Invalid data" }`
  - On DB/Clerk error: `{ error: true, message: "Failed to create program" }`
- **Authentication:** Not required
- **Errors:**
  - Validation errors
  - Database or Clerk API errors

#### getAllPrograms
- **Function:** `getAllPrograms`
- **Description:** Fetches all programs, including start/end term details and assigned instructors.
- **Parameters:** None
- **Returns:**
  - On success: `{ programs: [...], error: false }`
  - On DB error: `{ programs: [], error: true, message: "Failed to fetch programs" }`
- **Authentication:** Not required
- **Errors:**
  - Database fetch errors

#### getActivePrograms
- **Function:** `getActivePrograms`
- **Description:** Fetches all programs with status 'active'.
- **Parameters:** None
- **Returns:**
  - On success: `{ programs: [...], error: false }`
  - On DB error: `{ programs: [], error: true, message: "Failed to fetch active programs" }`
- **Authentication:** Not required
- **Errors:**
  - Database fetch errors

#### updateProgramStatus
- **Function:** `updateProgramStatus`
- **Description:** Updates the status of a program by its ID.
- **Parameters:**
  - `programId` (number): The ID of the program.
  - `status` (string): The new status (validated by Zod schema).
- **Returns:**
  - On success: `{ error: false }`
  - On DB error: `{ error: true, message: "Failed to update program status" }`
- **Authentication:** Not required
- **Errors:**
  - Database update errors

#### getProgramStatus
- **Function:** `getProgramStatus`
- **Description:** Fetches the status of a program by its ID.
- **Parameters:**
  - `programId` (number): The ID of the program.
- **Returns:**
  - On success: `{ status: string, error: false }`
  - If not found: `{ status: "", error: true, message: "Program not found" }`
  - On DB error: `{ status: "", error: true, message: "Failed to fetch program status" }`
- **Authentication:** Not required
- **Errors:**
  - Database fetch errors

#### updateProgram
- **Function:** `updateProgram`
- **Description:** Updates a program's details and instructor assignments by its ID.
- **Parameters:**
  - `programId` (number): The ID of the program.
  - `unsafeData` (object): Program data (validated by Zod schema) and optional `selected_instructors` array.
- **Returns:**
  - On success: `{ error: false }`
  - On validation error: `{ error: true, message: "Invalid data" }`
  - On DB error: `{ error: true, message: "Failed to update program" }`
- **Authentication:** Not required
- **Errors:**
  - Validation errors
  - Database update errors

#### getProgramById
- **Function:** `getProgramById`
- **Description:** Fetches a program by its ID.
- **Parameters:**
  - `programId` (number): The ID of the program.
- **Returns:**
  - On success: `{ program: <program>, error: false }`
  - On DB error: `{ program: null, error: true, message: "Failed to fetch program" }`
- **Authentication:** Not required
- **Errors:**
  - Database fetch errors

#### deleteProgram
- **Function:** `deleteProgram`
- **Description:** Deletes a program by its ID and removes the corresponding Clerk organization if present.
- **Parameters:**
  - `programId` (number): The ID of the program.
- **Returns:**
  - On success: `{ error: false }`
  - If not found: `{ error: true, message: "Program not found" }`
  - On DB/Clerk error: `{ error: true, message: "Failed to delete program" }`
- **Authentication:** Not required
- **Errors:**
  - Database or Clerk API errors

#### getClerkOrganizationId
- **Function:** `getClerkOrganizationId`
- **Description:** Fetches the Clerk organization ID for a given program.
- **Parameters:**
  - `programId` (number): The ID of the program.
- **Returns:**
  - On success: `string | null` (organization ID or null)
- **Authentication:** Not required
- **Errors:**
  - Database fetch errors

#### getProgramsByInstructorClerkId
- **Function:** `getProgramsByInstructorClerkId`
- **Description:** Gets all programs assigned to an instructor by their Clerk user ID.
- **Parameters:**
  - `clerkUserId` (string): The Clerk user ID of the instructor.
- **Returns:**
  - On success: `{ programs: [...], error: false }`
  - If not found: `{ programs: [], error: true, message: "Instructor not found" }`
  - On DB error: `{ programs: [], error: true, message: "Failed to fetch instructor programs" }`
- **Authentication:** Not required
- **Errors:**
  - Database fetch errors

### project.ts

#### createProject
- **Function:** `createProject`
- **Description:** Creates a new project, logs the submission, and sends a notification email to the creator. Requires authentication and validates input with Zod schema.
- **Parameters:**
  - `unsafeData` (object): Project data (validated by Zod schema).
- **Returns:**
  - On success: `{ error: false, projectId }`
  - On validation/auth error: `{ error: true, message: "..." }`
  - On DB error: `{ error: true, message: "Failed to create project: ..." }`
- **Authentication:** Required
- **Errors:**
  - Validation errors
  - Authentication errors
  - Database errors

#### updateProject
- **Function:** `updateProject`
- **Description:** Updates an existing project by its ID. Validates input with Zod schema.
- **Parameters:**
  - `projectId` (number): The ID of the project.
  - `unsafeData` (object): New project data (validated by Zod schema).
- **Returns:**
  - On success: `{ error: false }`
  - On validation error: `{ error: true, message: "Invalid data: ..." }`
  - On DB error: `{ error: true, message: "Failed to update project: ..." }`
- **Authentication:** Not required
- **Errors:**
  - Validation errors
  - Database errors

#### getProjectById
- **Function:** `getProjectById`
- **Description:** Fetches a project by its ID.
- **Parameters:**
  - `projectId` (number): The ID of the project.
- **Returns:**
  - On success: `{ project: <project>, error: false }`
  - On DB error: `{ project: null, error: true, message: "Failed to fetch project" }`
- **Authentication:** Not required
- **Errors:**
  - Database fetch errors

#### getAllProjects
- **Function:** `getAllProjects`
- **Description:** Fetches all projects.
- **Parameters:** None
- **Returns:**
  - On success: `{ projects: [...], error: false }`
  - On DB error: `{ projects: [], error: true, message: "Failed to fetch projects" }`
- **Authentication:** Not required
- **Errors:**
  - Database fetch errors

#### getProjectsByProgram
- **Function:** `getProjectsByProgram`
- **Description:** Fetches all projects for a specific program.
- **Parameters:**
  - `programId` (number): The ID of the program.
- **Returns:**
  - On success: `{ projects: [...], error: false }`
  - On DB error: `{ projects: [], error: true, message: "Failed to fetch program projects" }`
- **Authentication:** Not required
- **Errors:**
  - Database fetch errors

#### getBrowseProjects
- **Function:** `getBrowseProjects`
- **Description:** Fetches all active projects that are not published as showcase projects.
- **Parameters:** None
- **Returns:**
  - On success: `{ projects: [...], error: false }`
  - On DB error: `{ projects: [], error: true, message: "Failed to fetch active projects" }`
- **Authentication:** Not required
- **Errors:**
  - Database fetch errors

#### getShowcaseProjects
- **Function:** `getShowcaseProjects`
- **Description:** Fetches all projects published as showcase projects.
- **Parameters:** None
- **Returns:**
  - On success: `{ projects: [...], error: false }`
  - On DB error: `{ projects: [], error: true, message: "Failed to fetch showcase projects" }`
- **Authentication:** Not required
- **Errors:**
  - Database fetch errors

#### getSubmittedProjects
- **Function:** `getSubmittedProjects`
- **Description:** Fetches all projects with status 'submitted'.
- **Parameters:** None
- **Returns:**
  - On success: `{ projects: [...], error: false }`
  - On DB error: `{ error: true, message: "Failed to fetch submitted projects", projects: [] }`
- **Authentication:** Not required
- **Errors:**
  - Database fetch errors

#### getArchivedProjects
- **Function:** `getArchivedProjects`
- **Description:** Fetches all projects with status 'archived'.
- **Parameters:** None
- **Returns:**
  - On success: `{ projects: [...], error: false }`
  - On DB error: `{ error: true, message: "Failed to fetch archived projects", projects: [] }`
- **Authentication:** Not required
- **Errors:**
  - Database fetch errors

#### updateProjectStatus
- **Function:** `updateProjectStatus`
- **Description:** Updates the status of a project (approved or rejected), logs the change, and sends a notification email to the creator.
- **Parameters:**
  - `projectId` (number): The ID of the project.
  - `status` ('approved' | 'rejected'): The new status.
  - `comments` (string, optional): Optional comments about the status change.
- **Returns:**
  - On success: `{ error: false }`
  - On error: `{ error: true, message: "..." }`
- **Authentication:** Not required
- **Errors:**
  - Database errors

#### getTitleByProjectId
- **Function:** `getTitleByProjectId`
- **Description:** Fetches the title of a project by its ID.
- **Parameters:**
  - `projectId` (number): The ID of the project.
- **Returns:**
  - On success: `{ title: string, error: false }`
  - If not found: `{ title: null, error: true, message: "Project not found" }`
  - On DB error: `{ title: null, error: true, message: "Failed to fetch project title" }`
- **Authentication:** Not required
- **Errors:**
  - Database fetch errors

#### checkIfProjectSaved
- **Function:** `checkIfProjectSaved`
- **Description:** Checks if a project is saved by a specific user by calling the `/api/savedProjects` endpoint.
- **Parameters:**
  - `userId` (number): The ID of the user.
  - `projectId` (number): The ID of the project.
- **Returns:**
  - On success: `true` if the project is saved, `false` otherwise.
  - On error: `false` (logs error to console)
- **Authentication:** Not required
- **Errors:**
  - Network or API errors

#### getProjectByUserId
- **Function:** `getProjectByUserId`
- **Description:** Fetches the project for a specific user by their user ID, using team assignments.
- **Parameters:**
  - `userId` (number): The ID of the user.
- **Returns:**
  - On success: `{ project: <project>, error: false }`
  - If not found: `{ project: null, error: true, message: "Team not found for user" }` or `{ project: null, error: true, message: "Project not found for team" }`
  - On DB error: `{ project: null, error: true, message: "Failed to fetch project" }`
- **Authentication:** Not required
- **Errors:**
  - Database fetch errors


### projectLog.ts

#### createProjectLog
- **Function:** `createProjectLog`
- **Description:** Creates a new project log entry for a project. Validates input with Zod schema.
- **Parameters:**
  - `unsafeData` (object): Project log data (validated by Zod schema).
- **Returns:**
  - On success: `{ error: false, projectLogId }`
  - On validation error: `{ error: true, message: "Invalid data" }`
  - On DB error: `{ error: true, message: "Failed to create project log" }`
- **Authentication:** Not required
- **Errors:**
  - Validation errors
  - Database errors

#### getProjectLogs
- **Function:** `getProjectLogs`
- **Description:** Fetches all logs for a specific project, ordered by creation date (descending).
- **Parameters:**
  - `projectId` (number): The ID of the project.
- **Returns:**
  - On success: `{ logs: [...], error: false }`
  - On DB error: `{ logs: [], error: true, message: "Failed to fetch project logs" }`
- **Authentication:** Not required
- **Errors:**
  - Database fetch errors

#### getProjectLogsWithUsers
- **Function:** `getProjectLogsWithUsers`
- **Description:** Fetches all logs for a specific project, including user information, ordered by creation date (descending).
- **Parameters:**
  - `projectId` (number): The ID of the project.
- **Returns:**
  - On success: `{ logs: [...], error: false }`
  - On DB error: `{ logs: [], error: true, message: "Failed to fetch project logs with users" }`
- **Authentication:** Not required
- **Errors:**
  - Database fetch errors

#### getProgramLogsWithDetails
- **Function:** `getProgramLogsWithDetails`
- **Description:** Fetches all logs for projects in a program, including user and project information. Can filter by log types and limit the number of logs returned.
- **Parameters:**
  - `programId` (number): The ID of the program.
  - `limit` (number, optional): Maximum number of logs to return.
  - `logTypes` (array, optional): Array of log types to filter by.
- **Returns:**
  - On success: `{ logs: [...], error: false }`
  - On DB error: `{ logs: [], error: true, message: "Failed to fetch program logs" }`
- **Authentication:** Not required
- **Errors:**
  - Database fetch errors

#### getProjectLogsByType
- **Function:** `getProjectLogsByType`
- **Description:** Fetches logs of a specific type for a specific project, ordered by creation date (descending).
- **Parameters:**
  - `projectId` (number): The ID of the project.
  - `type` (string): The type of log to fetch.
- **Returns:**
  - On success: `{ logs: [...], error: false }`
  - On DB error: `{ logs: [], error: true, message: "Failed to fetch project logs" }`
- **Authentication:** Not required
- **Errors:**
  - Database fetch errors

#### updateProjectLog
- **Function:** `updateProjectLog`
- **Description:** Updates an existing project log by its ID. Validates input with a partial Zod schema.
- **Parameters:**
  - `projectLogId` (number): The ID of the project log.
  - `unsafeData` (object): Partial project log data (validated by Zod schema).
- **Returns:**
  - On success: `{ error: false }`
  - On validation error: `{ error: true, message: "Invalid data" }`
  - On DB error: `{ error: true, message: "Failed to update project log" }`
- **Authentication:** Not required
- **Errors:**
  - Validation errors
  - Database errors

#### deleteProjectLog
- **Function:** `deleteProjectLog`
- **Description:** Deletes a project log by its ID.
- **Parameters:**
  - `projectLogId` (number): The ID of the project log.
- **Returns:**
  - On success: `{ error: false }`
  - On DB error: `{ error: true, message: "Failed to delete project log" }`
- **Authentication:** Not required
- **Errors:**
  - Database errors

### savedProjects.ts

#### createSavedProject
- **Function:** `createSavedProject`
- **Description:** Creates a new saved project for a user. Validates input with Zod schema and prevents duplicate saves for the same user/project pair.
- **Parameters:**
  - `unsafeData` (object): Saved project data (validated by Zod schema).
- **Returns:**
  - On success: `{ error: false, saveId }`
  - On validation error: `{ error: true, message: "Invalid data" }`
  - If already saved: `{ error: true, message: "Project already saved for this user" }`
  - On DB error: `{ error: true, message: "Failed to save project" }`
- **Authentication:** Not required
- **Errors:**
  - Validation errors
  - Duplicate save errors
  - Database errors

#### updateSavedProject
- **Function:** `updateSavedProject`
- **Description:** Updates an existing saved project by its ID. Validates input with a partial Zod schema.
- **Parameters:**
  - `saveId` (number): The ID of the saved project.
  - `unsafeData` (object): Partial saved project data (validated by Zod schema).
- **Returns:**
  - On success: `{ error: false }`
  - On validation error: `{ error: true, message: "Invalid data" }`
  - On DB error: `{ error: true, message: "Failed to update saved project" }`
- **Authentication:** Not required
- **Errors:**
  - Validation errors
  - Database errors

#### getSavedProjectsByUser
- **Function:** `getSavedProjectsByUser`
- **Description:** Fetches all saved projects for a specific user, ordered by saveIndex.
- **Parameters:**
  - `userId` (number): The ID of the user.
- **Returns:**
  - On success: `{ savedProjects: [...], error: false }`
  - On DB error: `{ savedProjects: [], error: true, message: "Failed to fetch saved projects" }`
- **Authentication:** Not required
- **Errors:**
  - Database fetch errors

#### deleteSavedProject
- **Function:** `deleteSavedProject`
- **Description:** Deletes a saved project by its ID and updates the saveIndex for remaining projects of the user.
- **Parameters:**
  - `saveId` (number): The ID of the saved project.
- **Returns:**
  - On success: `{ error: false }`
  - If not found: `{ error: true, message: "Project not found" }`
  - On DB error: `{ error: true, message: "Failed to delete saved project" }`
- **Authentication:** Not required
- **Errors:**
  - Database errors

#### getHighestSaveIndex
- **Function:** `getHighestSaveIndex`
- **Description:** Fetches the highest saveIndex for a specific user. Returns 0 if the user has no saved projects.
- **Parameters:**
  - `userId` (number): The ID of the user.
- **Returns:**
  - On success: `number` (highest saveIndex + 1)
  - On DB error: `0` (logs error to console)
- **Authentication:** Not required
- **Errors:**
  - Database fetch errors

#### updateRankAndGetProjects
- **Function:** `updateRankAndGetProjects`
- **Description:** Updates the rank (saveIndex) of a saved project (up or down) and returns the updated list of saved projects for the user. Deletes the project if the new rank is less than or equal to 0.
- **Parameters:**
  - `saveId` (number): The ID of the saved project.
  - `userId` (number): The ID of the user.
  - `direction` ('up' | 'down'): The direction to move the project in the ranking.
- **Returns:**
  - On success: `{ error: false, savedProjects: [...] }`
  - On error: `{ error: true, message: "..." }`
- **Authentication:** Not required
- **Errors:**
  - Database errors

### sequence.ts

#### getSequenceById
- **Function:** `getSequenceById`
- **Description:** Fetches a sequence by its ID from the database.
- **Parameters:**
  - `sequenceId` (number): The ID of the sequence to fetch.
- **Returns:**
  - On success: `{ sequence: <sequence>, error: false }`
  - On DB error: `{ sequence: undefined, error: true, message: "Failed to fetch sequence" }`
- **Authentication:** Not required
- **Errors:**
  - Database fetch errors

### tag.ts

#### createTag
- **Function:** `createTag`
- **Description:** Creates a new tag. Validates input with Zod schema.
- **Parameters:**
  - `unsafeData` (object): Tag data (validated by Zod schema).
- **Returns:**
  - On success: `{ error: false, tagId }`
  - On validation error: `{ error: true, message: "Invalid data" }`
  - On DB error: `{ error: true, message: "Failed to create tag" }`
- **Authentication:** Not required
- **Errors:**
  - Validation errors
  - Database errors

#### addProjectTag
- **Function:** `addProjectTag`
- **Description:** Adds a tag to a project. Validates input with Zod schema.
- **Parameters:**
  - `unsafeData` (object): Project tag data (validated by Zod schema).
- **Returns:**
  - On success: `{ error: false, projectTagId }`
  - On validation error: `{ error: true, message: "Invalid data" }`
  - On DB error: `{ error: true, message: "Failed to add project tag" }`
- **Authentication:** Not required
- **Errors:**
  - Validation errors
  - Database errors

#### getAllTags
- **Function:** `getAllTags`
- **Description:** Fetches all tags from the database.
- **Parameters:** None
- **Returns:**
  - On success: `{ tags: [...], error: false }`
  - On DB error: `{ tags: [], error: true, message: "Failed to fetch tags" }`
- **Authentication:** Not required
- **Errors:**
  - Database fetch errors

#### getProjectTags
- **Function:** `getProjectTags`
- **Description:** Fetches all tags for a specific project.
- **Parameters:**
  - `projectId` (number): The ID of the project.
- **Returns:**
  - On success: `{ tags: [...], error: false }`
  - On DB error: `{ tags: [], error: true, message: "Failed to fetch project tags" }`
- **Authentication:** Not required
- **Errors:**
  - Database fetch errors

#### removeProjectTag
- **Function:** `removeProjectTag`
- **Description:** Removes a tag from a project by its projectTagId.
- **Parameters:**
  - `projectTagId` (number): The ID of the project tag to remove.
- **Returns:**
  - On success: `{ error: false }`
  - On DB error: `{ error: true, message: "Failed to remove project tag" }`
- **Authentication:** Not required
- **Errors:**
  - Database errors

#### deleteTag
- **Function:** `deleteTag`
- **Description:** Deletes a tag and removes all its associations from projects.
- **Parameters:**
  - `tagId` (number): The ID of the tag to delete.
- **Returns:**
  - On success: `{ error: false }`
  - On DB error: `{ error: true, message: "Failed to delete tag" }`
- **Authentication:** Not required
- **Errors:**
  - Database errors

### team.ts

#### createTeam
- **Function:** `createTeam`
- **Description:** Creates a new team. Validates input with Zod schema.
- **Parameters:**
  - `unsafeData` (object): Team data (validated by Zod schema).
- **Returns:**
  - On success: `{ error: false, teamId }`
  - On validation error: `{ error: true, message: "Invalid data" }`
  - On DB error: `{ error: true, message: "Failed to create team" }`
- **Authentication:** Not required
- **Errors:**
  - Validation errors
  - Database errors

#### updateTeam
- **Function:** `updateTeam`
- **Description:** Updates an existing team by its ID. Validates input with a partial Zod schema.
- **Parameters:**
  - `teamId` (number): The ID of the team.
  - `unsafeData` (object): Partial team data (validated by Zod schema).
- **Returns:**
  - On success: `{ error: false }`
  - On validation error: `{ error: true, message: "Invalid data" }`
  - On DB error: `{ error: true, message: "Failed to update team" }`
- **Authentication:** Not required
- **Errors:**
  - Validation errors
  - Database errors

#### getAllTeams
- **Function:** `getAllTeams`
- **Description:** Fetches all teams from the database.
- **Parameters:** None
- **Returns:**
  - On success: `{ teams: [...], error: false }`
  - On DB error: `{ teams: [], error: true, message: "Failed to fetch teams" }`
- **Authentication:** Not required
- **Errors:**
  - Database fetch errors

#### getTeamById
- **Function:** `getTeamById`
- **Description:** Fetches a team by its ID.
- **Parameters:**
  - `teamId` (number): The ID of the team.
- **Returns:**
  - On success: `{ team: <team>, error: false }`
  - On DB error: `{ team: null, error: true, message: "Failed to fetch team" }`
- **Authentication:** Not required
- **Errors:**
  - Database fetch errors

#### getTeamsByProjectId
- **Function:** `getTeamsByProjectId`
- **Description:** Fetches teams by their project ID.
- **Parameters:**
  - `projectId` (number): The ID of the project.
- **Returns:**
  - On success: `{ team: [...], error: false }`
  - On DB error: `{ team: null, error: true, message: "Failed to fetch team" }`
- **Authentication:** Not required
- **Errors:**
  - Database fetch errors

#### getTeamMembers
- **Function:** `getTeamMembers`
- **Description:** Fetches all members of a specific team.
- **Parameters:**
  - `teamId` (number): The ID of the team.
- **Returns:**
  - On success: `{ members: [...], error: false }`
  - On DB error: `{ members: [], error: true, message: "Failed to fetch team members" }`
- **Authentication:** Not required
- **Errors:**
  - Database fetch errors

#### addTeamMember
- **Function:** `addTeamMember`
- **Description:** Adds a member to a team by updating the user's teamId.
- **Parameters:**
  - `teamId` (number): The ID of the team.
  - `userId` (number): The ID of the user to add.
- **Returns:**
  - On success: `{ error: false }`
  - On DB error: `{ error: true, message: "Failed to add team member" }`
- **Authentication:** Not required
- **Errors:**
  - Database errors

#### removeTeamMember
- **Function:** `removeTeamMember`
- **Description:** Removes a member from a team by setting their teamId to null.
- **Parameters:**
  - `userId` (number): The ID of the user to remove.
- **Returns:**
  - On success: `{ error: false }`
  - On DB error: `{ error: true, message: "Failed to remove team member" }`
- **Authentication:** Not required
- **Errors:**
  - Database errors

#### deleteTeam
- **Function:** `deleteTeam`
- **Description:** Deletes a team by its ID and removes all team associations from users.
- **Parameters:**
  - `teamId` (number): The ID of the team to delete.
- **Returns:**
  - On success: `{ error: false }`
  - On DB error: `{ error: true, message: "Failed to delete team" }`
- **Authentication:** Not required
- **Errors:**
  - Database errors

### term.ts

#### getAllTerms
- **Function:** `getAllTerms`
- **Description:** Fetches all terms from the database.
- **Parameters:** None
- **Returns:**
  - On success: `{ terms: [...], error: false }`
  - On DB error: `{ terms: [], error: true, message: "Failed to fetch terms" }`
- **Authentication:** Not required
- **Errors:**
  - Database fetch errors

### user.ts

#### createUser
- **Function:** `createUser`
- **Description:** Creates a new user. Validates input with Zod schema.
- **Parameters:**
  - `unsafeData` (object): User data (validated by Zod schema).
- **Returns:**
  - On success: `{ error: false, userId }`
  - On validation error: `{ error: true, message: "Invalid data" }`
  - On DB error: `{ error: true, message: "Failed to create user" }`
- **Authentication:** Not required
- **Errors:**
  - Validation errors
  - Database errors

#### updateUser
- **Function:** `updateUser`
- **Description:** Updates an existing user by their ID. Validates input with a partial Zod schema.
- **Parameters:**
  - `userId` (number): The ID of the user.
  - `unsafeData` (object): Partial user data (validated by Zod schema).
- **Returns:**
  - On success: `{ error: false }`
  - On validation error: `{ error: true, message: "Invalid data" }`
  - On DB error: `{ error: true, message: "Failed to update user" }`
- **Authentication:** Not required
- **Errors:**
  - Validation errors
  - Database errors

#### updateInstructor
- **Function:** `updateInstructor`
- **Description:** Updates an instructor's data and manages Clerk organization membership. Validates input with a partial Zod schema.
- **Parameters:**
  - `userId` (number): The ID of the instructor.
  - `unsafeData` (object): Partial user data (validated by Zod schema).
- **Returns:**
  - On success: `{ error: false }`
  - On validation error: `{ error: true, message: "Invalid data" }`
  - On DB error: `{ error: true, message: "Failed to update user" }`
- **Authentication:** Not required
- **Errors:**
  - Validation errors
  - Database errors
  - Clerk organization errors

#### getAllUsers
- **Function:** `getAllUsers`
- **Description:** Fetches all users from the database.
- **Parameters:** None
- **Returns:**
  - On success: `{ users: [...], error: false }`
  - On DB error: `{ users: [], error: true, message: "Failed to fetch users" }`
- **Authentication:** Not required
- **Errors:**
  - Database fetch errors

#### getUserByEmail
- **Function:** `getUserByEmail`
- **Description:** Fetches a user by their email address.
- **Parameters:**
  - `email` (string): The email of the user.
- **Returns:**
  - On success: `{ user: <user>, error: false }`
  - On DB error: `{ user: null, error: true, message: "Failed to fetch user" }`
- **Authentication:** Not required
- **Errors:**
  - Database fetch errors

#### getUsersByProgram
- **Function:** `getUsersByProgram`
- **Description:** Fetches all users for a specific program.
- **Parameters:**
  - `programId` (number): The ID of the program.
- **Returns:**
  - On success: `{ users: [...], error: false }`
  - On DB error: `{ users: [], error: true, message: "Failed to fetch program users" }`
- **Authentication:** Not required
- **Errors:**
  - Database fetch errors

#### getAllInstructors
- **Function:** `getAllInstructors`
- **Description:** Fetches all users with the type 'instructor'.
- **Parameters:** None
- **Returns:**
  - On success: `{ users: [...], error: false }`
  - On DB error: `{ users: [], error: true, message: "Failed to fetch instructors" }`
- **Authentication:** Not required
- **Errors:**
  - Database fetch errors

#### getStudentsByProgram
- **Function:** `getStudentsByProgram`
- **Description:** Fetches all users with the type 'student' for a specific program.
- **Parameters:**
  - `programId` (number): The ID of the program.
- **Returns:**
  - On success: `{ users: [...], error: false }`
  - On DB error: `{ users: [], error: true, message: "Failed to fetch program students" }`
- **Authentication:** Not required
- **Errors:**
  - Database fetch errors

#### getProjectPartnerByTeamId
- **Function:** `getProjectPartnerByTeamId`
- **Description:** Fetches all users with the type 'project_partner' for a specific team.
- **Parameters:**
  - `teamId` (number): The ID of the team.
- **Returns:**
  - On success: `{ projectPartners: [...], error: false }`
  - On DB error: `{ user: null, error: true, message: "Failed to fetch project partner" }`
- **Authentication:** Not required
- **Errors:**
  - Database fetch errors

#### getTeamUsersExcludingPartner
- **Function:** `getTeamUsersExcludingPartner`
- **Description:** Fetches all users on a team, excluding those with the type 'project_partner'.
- **Parameters:**
  - `teamId` (number): The ID of the team.
- **Returns:**
  - On success: `{ teammates: [...], error: false }`
  - On DB error: `{ teammates: [], error: true, message: "Failed to fetch team users" }`
- **Authentication:** Not required
- **Errors:**
  - Database fetch errors

#### getUserByClerkId
- **Function:** `getUserByClerkId`
- **Description:** Fetches a user by their Clerk user ID.
- **Parameters:**
  - `clerkId` (string): The Clerk user ID of the user.
- **Returns:**
  - On success: `{ user: <user>, error: false }`
  - On DB error: `{ user: null, error: true, message: "Failed to fetch user" }`
- **Authentication:** Not required
- **Errors:**
  - Database fetch errors
