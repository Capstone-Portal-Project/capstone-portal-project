"use client"

import React, { useContext, useEffect, useState } from "react";
import { DataTableUser, columns } from "./columns";
import { DataTable } from "./data-table";
import { useUser } from "@clerk/clerk-react";
import { getStudentsByProgram } from "~/server/api/routers/user";
import { getProjectsByProgram } from "~/server/api/routers/project";
import DroppableProjectCard from "./_components/DroppableProjectCard";
import UserCard from "./_components/UserCard";
import {
    ResizableHandle,
    ResizablePanel,
    ResizablePanelGroup,
  } from "~/components/ui/resizable"

import { DndContext, DragStartEvent, DragEndEvent, PointerSensor, useSensor, useSensors, useDroppable, useDraggable } from "@dnd-kit/core";
import { users } from "~/server/db/schema";
import Sidebar from "./_components/SideBar";

type Project = {
    projectId: number;
    projectTitle: string;
    appDescription: string;
    appImage: string | null;
    appOrganization: string;
    projectStatus: "draft" | "submitted" | "deferred" | "active" | "archived" | "incomplete" | null;
  }

import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "~/components/ui/dialog";
import { Pointer } from "lucide-react";
import { createContext } from "vm";

const ProjectBoard = () => {
  return (
    <div>

    </div>
  );
}





export default function ProjectAssignments() {
  const { user } = useUser();
  const [userData, setUserData] = useState<DataTableUser[]>([]);
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);


  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 5
      }
    }),
  );

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
          projectId: null, // Simulating project ID (because rn theres no way to get a user's project ID)
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
    return (

        <div className="flex items-center justify-center h-screen text-2xl font-semibold">
            <div className="animate-spin h-8 w-8 border-4 border-primary border-t-transparent rounded-full"></div>
            <span className="ml-2">Loading submissions...</span>
        </div>
    )
  }


  function onDragStart(event: DragStartEvent) {
    const { active } = event;
    console.log(`User ${active.id} started dragging`);
  }

  function onDragEnd(event: DragEndEvent) {
    const { active, over } = event;
    const userId = active.data.current!.userId as number;
    
    // If dropped back into the unassigned list, set projectId to null
    if (!over) {
      // Update the user's project ID to null (unassigned)
      console.log(`User ${active.id} dragged to unassigned`);

      setUserData((prevState) =>
        prevState.map((user) =>
          user.id === userId ? { ...user, projectId: null } : user
    )
  );
} else {
  // Otherwise, assign the user to the new project
      console.log(`User ${active.id} dragged to project ${over.id}`);

      const newProject = over.data.current!.projectId as number;
      setUserData((prevState) =>
        prevState.map((user) =>
          user.id === userId ? { ...user, projectId: newProject } : user
        )
      );
    }

    console.log(userData);

    // TODO BELOW - Update the user's project ID in the database
  }

  return (
    <div className="absolute bottom-0 top-20 h-full flex flex-col bg-[#FFFFFF] w-full place-items-center pb-0">
        <div className="layout grid grid-cols-12 h-full">
          <DndContext 
          sensors={sensors}
          onDragStart={onDragStart}
          onDragEnd={onDragEnd}
          >          
            <div className="col-span-2 h-full overflow-hidden">
              <div className="flex flex-col gap-6">
                {/* List all the users that have a null projectId (haven't been assigned to a project yet) */}
                {userData.filter(user => user.projectId === null).map((user) => (
                    <UserCard key={user.id} user={user} />
                ))}
              </div>            
            </div>
            <div className="col-span-8 h-full overflow-y-scroll scrollbar-none">
              {/* Projects List (Droppable) */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 xl:grid-cols-4 gap-3 px-4">
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
              </div>
            </div>
            <div className="col-span-2 h-full overflow-hidden">
              {/* Placeholder for Sidebar */}
            </div>
          </DndContext>            
        </div>
    </div>
  );
}
