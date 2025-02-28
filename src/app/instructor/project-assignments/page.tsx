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

import { DndContext, DragStartEvent, DragEndEvent } from "@dnd-kit/core";
import { users } from "~/server/db/schema";

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
          projectId: 9, // Simulating project ID (because rn theres no way to get a user's project ID)
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


  function onDragStart(event: DragStartEvent) {
    const { active } = event;
    console.log(`User ${active.id} started dragging`);
  }

  function onDragEnd(event: DragEndEvent) {
    const { active, over } = event;
    if (!over) return;

    console.log(`User ${active.id} dragged to project ${over.id}`);

    const userId = active.data.current!.userId as number;
    const newProject = over.data.current!.projectId as number;

    // Update the user's project ID in the state, then the database
    setUserData(() =>
        userData.map((user) => 
            user.id === userId ? { ...user, projectId: newProject } : user
        )
    )

    console.log(userData);

    // TODO BELOW - Update the user's project ID in the database
  }


  return (
    <div className="container mx-auto py-10 h-full flex gap-2">
        {/* Students List (Draggable) */}
        {/* <DataTable columns={columns} data={userData} /> */}
        {/* map the user data into a column here */}
        <div>
            <h3 className="text-2xl font-semibold mx-4 mb-4">
                Students
            </h3>
            <div className="flex flex-col gap-6 px-4">
                {userData.map((user) => (
                    <div key={user.id} className="bg-white rounded-md shadow-md p-4">
                        <h4 className="text-lg font-semibold">{user.username}</h4>
                        <p className="text-sm text-gray-500">{user.email}</p>
                    </div>
                ))}
            </div>
        </div>
        {/* Projects List (Droppable) */}
        <div>
            <h3 className="text-2xl font-semibold mx-4 mb-4">
                Projects
            </h3>
            <div className="flex gap-6 px-4">
                <DndContext 
                onDragStart={onDragStart}
                onDragEnd={onDragEnd}   
                >
                    {projects.map((project) => (
                        <DroppableProjectCard
                            key={project.projectId}
                            projectId={project.projectId}
                            imgUrl={project.appImage || ''}
                            title={project.projectTitle}
                            description={project.appDescription}
                            tags={[project.appOrganization]}
                            users={userData.filter(user => user.projectId === project.projectId)}
                        />
                    ))}
                </DndContext>
            </div>
        </div>
    </div>
  );
}
