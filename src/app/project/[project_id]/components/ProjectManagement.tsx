"use client";

import { useState, useEffect } from "react";
import { ProjectLogs } from "~/app/_components/ProjectLogs";
import { AddProjectLog } from "~/app/_components/AddProjectLog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "~/components/ui/tabs";
import { Card, CardContent, CardHeader, CardTitle } from "~/components/ui/card";
import { checkUserRole } from "~/app/utils/checkUserRole";
import { useUser } from "@clerk/nextjs";

type ProjectManagementProps = {
  projectId: number;
};

export function ProjectManagement({ projectId }: ProjectManagementProps) {
  const [isVisible, setIsVisible] = useState(false);
  const [userId, setUserId] = useState<number | null>(null);
  const { user } = useUser();
  
  // Check user permissions on component mount
  useEffect(() => {
    const checkPermissions = async () => {
      if (!user?.id) return;
      
      // Only admins and instructors should see this component
      const role = await checkUserRole();
      const isAdminOrInstructor = role === "admin" || role === "instructor";
      setIsVisible(isAdminOrInstructor);
      
      // Get the numerical user ID for the current user (from server)
      // This is a placeholder - you'll need to implement this function
      if (isAdminOrInstructor) {
        // Placeholder - replace with actual implementation
        setUserId(1); // Temporary hardcoded value
      }
    };
    
    checkPermissions();
  }, [user?.id]);
  
  // If not admin or instructor, don't render anything
  if (!isVisible || userId === null) {
    return null;
  }
  
  // When a new log is added, we'd refresh the logs
  const handleLogAdded = () => {
    // Force a refresh of the logs component (you might want to implement this differently)
    // For now, we'll just force a page refresh
    window.location.reload();
  };

  return (
    <Card className="w-full mt-8">
      <CardHeader>
        <CardTitle>Project Management</CardTitle>
      </CardHeader>
      <CardContent>
        <Tabs defaultValue="logs">
          <TabsList>
            <TabsTrigger value="logs">Project Logs</TabsTrigger>
            {/* Add more tabs as needed for project management */}
          </TabsList>
          
          <TabsContent value="logs" className="space-y-4">
            <div className="flex justify-between items-center">
              <h3 className="text-lg font-medium">Activity Log</h3>
              <AddProjectLog 
                projectId={projectId}
                userId={userId}
                onLogAdded={handleLogAdded}
                buttonLabel="Add Log Entry"
                defaultLogType="instructor_admin_message"
                allowedLogTypes={["instructor_admin_message", "approval", "deferment"]}
              />
            </div>
            <ProjectLogs projectId={projectId} maxHeight="500px" />
          </TabsContent>
          
          {/* Add more tab content as needed */}
        </Tabs>
      </CardContent>
    </Card>
  );
} 