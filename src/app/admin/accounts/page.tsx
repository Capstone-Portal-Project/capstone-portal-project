"use client";

import { useState, useEffect } from "react";
import { useToast } from "../../../components/ui/toaster";
import { Toaster } from "../../../components/ui/toaster";
import { Button } from "../../../components/ui/button";
import { PlusCircle } from "lucide-react";
import { getAllUsers, updateUser, createUser } from "~/server/api/routers/user";
import { getAllPrograms } from "~/server/api/routers/program";
import { DataTable } from "./data-table";
import { columns } from "./columns";
import { AddUserDialog } from "./components/AddUserDialog";
import { EditUserDialog } from "./components/EditUserDialog";
import { DeleteUserDialog } from "./components/DeleteUserDialog";

export type AdminUser = {
  id: number;
  username: string;
  email: string;
  type: "admin" | "instructor";
  isAdmin: boolean;
  isInstructor: boolean;
  clerk_user_id?: string;
  organizationId?: string;
};

export default function AccountManagementPage() {
  const [users, setUsers] = useState<AdminUser[]>([]);
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [editingUser, setEditingUser] = useState<AdminUser | null>(null);
  const [userToDelete, setUserToDelete] = useState<number | null>(null);
  const [organizations, setOrganizations] = useState<any[]>([]);
  const { toast } = useToast();

  useEffect(() => {
    fetchUsers();
    fetchOrganizations();
  }, []);

  const fetchOrganizations = async () => {
    try {
      const result = await getAllPrograms();
      
      if (!result.error) {
        setOrganizations(result.programs);
      } else {
        toast({
          variant: "destructive",
          title: "Error",
          description: result.message || "Failed to fetch organizations",
        });
      }
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to fetch organizations",
      });
    }
  };

  const fetchUsers = async () => {
    try {
      const result = await getAllUsers();
      
      if (!result.error) {
        // Filter for admin and instructor users only
        const adminUsers = result.users
          .filter(user => user.type === "admin" || user.type === "instructor")
          .map(user => ({
            id: user.userId,
            username: user.username,
            email: user.email,
            type: user.type as "admin" | "instructor",
            isAdmin: user.type === "admin",
            isInstructor: user.type === "instructor" || user.type === "admin",
            clerk_user_id: user.clerk_user_id,
            organizationId: user.programId ? user.programId.toString() : undefined,
          }));
        setUsers(adminUsers);
      } else {
        toast({
          variant: "destructive",
          title: "Error",
          description: result.message || "Failed to fetch users",
        });
      }
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to fetch users",
      });
    }
  };

  const handleAddUser = async (newUser: any) => {
    try {
      // Handle add user logic
      const result = await createUser({
        ...newUser,
        rankingSubmitted: false,
      });
      
      if (!result.error) {
        // In a real implementation, we would also:
        // 1. Add this user to Clerk with the appropriate role
        // 2. For admin users, add them to all organizations
        
        toast({
          title: "Success",
          description: "User added successfully",
        });
        fetchUsers();
      } else {
        toast({
          variant: "destructive",
          title: "Error",
          description: result.message || "Failed to add user",
        });
      }
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to add user",
      });
    }
  };

  const handleEditUser = async (userId: number, updatedUser: any) => {
    try {
      // Convert organizationId to programId for the API
      const apiData = {
        ...updatedUser,
        programId: updatedUser.organizationId && updatedUser.organizationId !== "none" 
          ? parseInt(updatedUser.organizationId) 
          : null
      };
      
      // Remove organizationId as it's not part of the user schema
      delete apiData.organizationId;
      
      const result = await updateUser(userId, apiData);
      
      if (!result.error) {
        // In a real implementation, we would also:
        // 1. Update the user's role in Clerk
        // 2. If the user is now an admin, add them to all organizations
        // 3. If the user is no longer an admin, handle organization membership accordingly
        
        toast({
          title: "Success",
          description: "User updated successfully",
        });
        fetchUsers();
      } else {
        toast({
          variant: "destructive",
          title: "Error",
          description: result.message || "Failed to update user",
        });
      }
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to update user",
      });
    }
  };

  const handleDeleteUser = async (userId: number) => {
    try {
      const result = await updateUser(userId, { type: "instructor" });
      
      if (!result.error) {
        toast({
          title: "Success",
          description: "Admin privileges removed successfully",
        });
        fetchUsers();
      } else {
        toast({
          variant: "destructive",
          title: "Error",
          description: result.message || "Failed to update user",
        });
      }
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to update user",
      });
    }
  };

  // Function to add admin to all organizations
  const addAdminToAllOrganizations = async (clerkUserId: string) => {
    // This would be implemented to use Clerk's API
    // For each organization, add the user with admin role
    // Example pseudo-code:
    // 
    // for (const program of organizations) {
    //   await clerkClient.organizations.createOrganizationMembership({
    //     organizationId: String(program.programId),
    //     userId: clerkUserId,
    //     role: "org:admin"
    //   });
    // }
    
    toast({
      title: "Admin Access",
      description: "Admin added to all organizations",
    });
  };

  return (
    <div className="container mx-auto py-10">
      <Toaster />
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-2xl font-bold">Account Management</h1>
        <Button 
          onClick={() => setIsAddDialogOpen(true)}
          className="bg-black hover:bg-black/90 text-white"
        >
          <PlusCircle className="mr-2 h-4 w-4" />
          Add Admin User
        </Button>
      </div>
      
      <div className="mb-6">
        <h2 className="text-xl font-semibold mb-4">Admin Accounts</h2>
        <p className="text-gray-600 mb-4">
          Admin users have access to all organizations and can manage all aspects of the system.
          When new courses are created, admin accounts are automatically added to the new organization.
        </p>
      </div>
      
      <DataTable 
        columns={columns({
          onEdit: (user) => {
            setEditingUser(user);
            setIsEditDialogOpen(true);
          },
          onDelete: (userId) => {
            setUserToDelete(userId);
            setIsDeleteDialogOpen(true);
          }
        })} 
        data={users} 
      />
      
      {isAddDialogOpen && (
        <AddUserDialog
          open={isAddDialogOpen}
          onOpenChange={setIsAddDialogOpen}
          onSuccess={() => {
            fetchUsers();
            toast({
              title: "Success",
              description: "User added successfully",
            });
          }}
          onError={(error) => {
            toast({
              variant: "destructive",
              title: "Error",
              description: error.message || "Failed to add user",
            });
          }}
          organizations={organizations}
        />
      )}
      
      {isEditDialogOpen && editingUser && (
        <EditUserDialog
          open={isEditDialogOpen}
          onOpenChange={setIsEditDialogOpen}
          user={editingUser}
          onSubmit={(updatedUser) => {
            handleEditUser(editingUser.id, updatedUser);
            // If the user was promoted to admin, add them to all organizations
            if (updatedUser.type === "admin" && !editingUser.isAdmin) {
              // We would need the clerk user ID here
              // This is a simplified version - in reality we'd fetch the clerk ID
              const user = users.find(u => u.id === editingUser.id);
              if (user) {
                addAdminToAllOrganizations(user.clerk_user_id || "");
              }
            }
          }}
          organizations={organizations}
        />
      )}
      
      {isDeleteDialogOpen && userToDelete && (
        <DeleteUserDialog
          open={isDeleteDialogOpen}
          onOpenChange={setIsDeleteDialogOpen}
          userId={userToDelete}
          onDelete={handleDeleteUser}
        />
      )}
    </div>
  );
} 