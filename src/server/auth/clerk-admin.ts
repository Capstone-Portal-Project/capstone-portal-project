"use server"

import { clerkClient } from "@clerk/nextjs/server";
import { db } from "../db";
import { users } from "../db/schema";
import { eq } from "drizzle-orm";
import { getClerkOrganizationId } from "../api/routers/program";

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
    
    console.log(`Added user ${clerkUserId} to organization ${organizationId} with role ${role}`);
    
    return true;
  } catch (error) {
    console.error("Error adding user to organization:", error);
    return false;
  }
}

/**
 * Changes a user's role in a Clerk organization.
 * 
 * @param {string} organizationId - The ID of the organization.
 * @param {string} clerkUserId - The ID of the user.
 * @param {string} role - The new role to assign.
 * @returns {Promise<boolean>} Whether the operation was successful.
 */
export async function changeUserRoleInOrganization(
  organizationId: string,
  clerkUserId: string,
  role: string
): Promise<boolean> {
  try {
    // In a real implementation, we would update the user's role
    // Example:
    // await clerkClient.organizations.updateOrganizationMembership({
    //   organizationId,
    //   userId: clerkUserId,
    //   role
    // });
    
    // For demonstration purposes, we'll just log
    console.log(`[MOCK] Changed user ${clerkUserId}'s role in organization ${organizationId} to ${role}`);
    
    return true;
  } catch (error) {
    console.error("Error changing user role in organization:", error);
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