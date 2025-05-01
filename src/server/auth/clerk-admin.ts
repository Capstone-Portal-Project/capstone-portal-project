"use server"

import { clerkClient } from "@clerk/nextjs/server";
import { db } from "../db";
import { users } from "../db/schema";
import { eq } from "drizzle-orm";
import { getAllPrograms, getClerkOrganizationId } from "../api/routers/program";
import { getUserByClerkId } from "../api/routers/user";

/**
 * Creates a new Clerk organization for a program.
 * 
 * @param {string} name - The name of the organization.
 * @returns {Promise<string|null>} The ID of the created organization, or null if creation failed.
 */
export async function createClerkOrganization(name: string): Promise<string | null> {
  try {
    const client = await clerkClient();
    const organization = await client.organizations.createOrganization({
      name: name,
    });
    return organization.id;
  } catch (error) {
    console.error("Error creating Clerk organization:", error);
    return null;
  }
}

/**
 * Adds all admin users to a Clerk organization.
 * 
 * @param {string} organizationId - The ID of the organization.
 * @returns {Promise<boolean>} Whether the operation was successful.
 */
export async function addAdminsToOrganization(organizationId: string): Promise<boolean> {
  try {
    const client = await clerkClient();
    const adminUsers = await db
      .select({ clerk_user_id: users.clerk_user_id })
      .from(users)
      .where(eq(users.type, "admin"));

    for (const admin of adminUsers) {
      await client.organizations.createOrganizationMembership({
        organizationId,
        userId: admin.clerk_user_id,
        role: "org:admin"
      });
    }
    
    // For demonstration purposes, we'll just log
    console.log(`Added ${adminUsers.length} admins to organization: ${organizationId}`);
    adminUsers.forEach(admin => {
      console.log(`  - user ${admin.clerk_user_id} as admin`);
    });
    
    return true;
  } catch (error) {
    console.error("Error adding admins to organization:", error);
    return false;
  }
}

/**
 * Adds a user to a Clerk organization with a specific role.
 * 
 * @param {number} programId - The ID of the program.
 * @param {string} clerkUserId - The ID of the user.
 * @param {string} role - The role to assign (e.g., "org:admin", "org:instructor", "org:student").
 * @returns {Promise<boolean>} Whether the operation was successful.
 */
export async function addUserToOrganization(
  programId: number,
  clerkUserId: string,
  role: string
): Promise<boolean> {
  try {
    const organizationId = await getClerkOrganizationId(programId);

    if (!organizationId) {
      console.error("Organization ID not found for program:", programId);
      return false;
    }

    const client = await clerkClient();

    await client.organizations.createOrganizationMembership({
      organizationId,
      userId: clerkUserId,
      role
    });
    
    console.log(`Added user ${clerkUserId} to program ${programId} with role ${role}`);
    
    return true;
  } catch (error) {
    console.error(`Error adding user ${clerkUserId} to program ${programId}`, error);
    return false;
  }
}

/**
 * Changes a user's role in a Clerk organization.
 * 
 * @param {number} programId - The ID of the program.
 * @param {string} clerkUserId - The ID of the user.
 * @param {string} role - The new role to assign.
 * @returns {Promise<boolean>} Whether the operation was successful.
 */
export async function changeUserRoleInOrganization(
  programId: number,
  clerkUserId: string,
  role: string
): Promise<boolean> {
  try {
    const organizationId = await getClerkOrganizationId(programId);

    if (!organizationId) {
      console.error("Organization ID not found for program:", programId);
      return false;
    }

    const client = await clerkClient();
    await client.organizations.updateOrganizationMembership({
      organizationId,
      userId: clerkUserId,
      role
    });
    
    // For demonstration purposes, we'll just log
    console.log(`Changed user ${clerkUserId}'s role in program ${programId} to ${role}`);
    
    return true;
  } catch (error) {
    console.error(`Error changing user role in program ${programId}:`, error);
    return false;
  }
}

/**
 * Removes a user from a Clerk organization.
 * 
 * @param {number} programId - The ID of the program.
 * @param {string} clerkUserId - The ID of the user.
 * @returns {Promise<boolean>} Whether the operation was successful.
 */
export async function removeUserFromOrganization(
  programId: number,
  clerkUserId: string
): Promise<boolean> {
  try {
    const organizationId = await getClerkOrganizationId(programId);

    if (!organizationId) {
      console.error("Organization ID not found for program:", programId);
      return false;
    }

    const client = await clerkClient();

    await client.organizations.deleteOrganizationMembership({
      organizationId,
      userId: clerkUserId
    });
    
    console.log(`Removed user ${clerkUserId} from organization ${organizationId}`);
    
    return true;
  } catch (error) {
    console.error("Error removing user from organization:", error);
    return false;
  }
}

export async function deleteOrganization(organizationId: string) {
  try {
    const client = await clerkClient();
    await client.organizations.deleteOrganization(organizationId);
    console.log(`Deleted organization: ${organizationId}`);
    return true;
  } catch (error) {
    console.error("Error deleting organization:", error);
    return false;
  }
}

export async function addAdminToAllOrganization(clerk_user_id: string) {
  try {

    const {user} = await getUserByClerkId(clerk_user_id);
    const client = await clerkClient();
    console.log(await client.organizations.getOrganizationList({limit: 1000}));

    if (!user) {
      console.error("User not found for clerk user ID:", clerk_user_id);
      return false;
    }

    if (user.type === "admin") {
      console.log("User is already an admin:", clerk_user_id);
      return true;
    }

    const programs = await getAllPrograms();
    
    for (const program of programs.programs) {
      if (program.programId === user.programId) {
        console.log(`User ${clerk_user_id} promoted in program ${program.programName}`);
        await changeUserRoleInOrganization(program.programId, clerk_user_id, "org:admin");
      } else {
      console.log(`Adding admin user ${clerk_user_id} to program ${program.programName}`);
      await addUserToOrganization(program.programId, clerk_user_id, "org:admin");
      }
    }
    
    console.log(`Added admin user ${clerk_user_id} to all organizations`);
    return true;
  } catch (error) {
    console.error("Error adding admin to all organizations:", error);
    return false;
  }
}

export async function removeAdminRole(clerk_user_id: string, role: string) {

  if (role === "org:admin") {
    console.error("Please set the role to org:instructor or org:student instead of org:admin");
    return false;
  }

  try {
    const {user} = await getUserByClerkId(clerk_user_id);

    if (!user) {
      console.error("User not found for clerk user ID:", clerk_user_id);
      return false;
    }

    if (user.type === "instructor") {
      console.log("User is already an instructor", clerk_user_id);
      return true;
    }

    const programs = await getAllPrograms();
    
    for (const program of programs.programs) {
      if (program.programId === user.programId) {
        console.log(`User ${clerk_user_id} demoted to ${role} in program ${program.programName}`);
        await changeUserRoleInOrganization(program.programId, clerk_user_id, role);
      } else {
        console.log(`Removing user ${clerk_user_id} from program ${program.programName}`);
        await removeUserFromOrganization(program.programId, clerk_user_id);
      }
    }
    
    console.log(`Update admin user ${clerk_user_id} to be ${role} in organization ${user.programId}`);
    return true;
  } catch (error) {
    console.error("Error removing admin:", error);
    return false;
  }
}

export async function inviteClerkUser(emailAddress: string) {
  try {
    const client = await clerkClient();
    // TODO : Implement custom url for signup page
    const user = await client.invitations.createInvitation({
      emailAddress: `${emailAddress}`,
    });
    console.log(`Invitation sent to ${emailAddress}`);
  } catch (error) {
    console.error("Error inviting Clerk user:", error);
    throw new Error("Failed to invite Clerk user");
  }
}