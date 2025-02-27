"use client"

import React, { useEffect, useState } from "react";
import { DataTableUser, columns } from "./columns";
import { DataTable } from "./data-table";
import { useUser } from "@clerk/clerk-react";
import { getStudentsByProgram } from "~/server/api/routers/user";
import { getProjectsByProgram } from "~/server/api/routers/project";
import DroppableProjectCard from "./_components/DroppableProjectCard";
import {
    ResizableHandle,
    ResizablePanel,
    ResizablePanelGroup,
  } from "~/components/ui/resizable"

import { DndContext } from "@dnd-kit/core";

type Project = {
    projectId: number;
    projectTitle: string;
    appDescription: string;
    appImage: string | null;
    appOrganization: string;
    projectStatus: "draft" | "submitted" | "deferred" | "active" | "archived" | "incomplete" | null;
  }

export default function ProjectAssignments() {
  const { user } = useUser();
  const [userData, setUserData] = useState<DataTableUser[]>([]);
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);

  // On page load, fetch students and projects for the program (course)
  useEffect(() => {
    async function fetchUserData() {
      if (!user) return;

      try {
        const clerkId = user.id; // Eventually we will use this to get the program ID
        
        // Simulating getting program ID
        const programId = 5;

        // Fetch students for the program
        const { users, error } = await getStudentsByProgram(programId);
        if (error) {
          console.error("Error fetching students:", error);
          return;
        }

        // Map student data
        const students = users.map((user) => ({
          id: user.userId,
          username: user.username,
          email: user.email,
        }));

        setUserData(students);
      } catch (error) {
        console.error("Error fetching user data:", error);
      } finally {
        setLoading(false);
      }
    }

    async function fetchProjects() {
        try {
          // Simulating getting program ID
          const programId = 5;

          const result = await getProjectsByProgram(programId);
          if (!result.error) {
            setProjects(result.projects);
          } else {
            console.error(result.message);
          }
        } catch (error) {
          console.error("Failed to fetch projects:", error);
        } finally {
          setLoading(false);
        }
      };

    fetchUserData();
    fetchProjects();
  }, [user]);

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <div className="container mx-auto py-10 h-full">
        <ResizablePanelGroup direction="horizontal" >
            {/* Students List (Draggable) */}
            <ResizablePanel  defaultSize={30}>
                <DataTable columns={columns} data={userData} />
            </ResizablePanel>
            <ResizableHandle />
            {/* Projects List (Droppable) */}
            <ResizablePanel  defaultSize={70}>
                <div>
                    <h3 className="text-2xl font-semibold mx-4 mb-4">
                        Projects
                    </h3>
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-3 gap-6 px-4">
                        {projects.map((project) => (
                            <DroppableProjectCard
                            key={project.projectId}
                            projectId={project.projectId}
                            imgUrl={project.appImage || ''}
                            title={project.projectTitle}
                            description={project.appDescription}
                            tags={[project.appOrganization]}
                            />
                        ))}
                        {projects.length === 0 && (
                            <div className="col-span-full text-center py-10 text-gray-500">
                            No active projects available
                            </div>
                        )}
                    </div>
                </div>
            </ResizablePanel>
        </ResizablePanelGroup>
    </div>
  );
}
