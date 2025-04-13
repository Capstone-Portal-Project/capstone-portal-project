"use client"

import React, { useEffect, useState } from "react";
import { DataTableUser, columns } from "./columns";
import { DataTable } from "./data-table";
import { useUser } from "@clerk/clerk-react";
import { getAllInstructors, updateInstructor } from "~/server/api/routers/user";
import { getAllPrograms } from "~/server/api/routers/program";
import DroppableProgramCard from "./_components/DroppableProgramCard";
import UserCard from "./_components/UserCard";
import {
    ResizableHandle,
    ResizablePanel,
    ResizablePanelGroup,
  } from "~/components/ui/resizable"

import { DndContext, DragStartEvent, DragEndEvent } from "@dnd-kit/core";
import { users } from "~/server/db/schema";

type Program = {
    programId: number;
    programName: string;
    programDescription: string | null;
    programStatus: 'submissions' | 'matching' | 'active' | 'ending' | 'archived' | 'hidden';
    startTermId: number;
    endTermId: number;
  }

export default function ProjectAssignments() {
  const { user } = useUser();
  const [userData, setUserData] = useState<DataTableUser[]>([]);
  const [programs, setPrograms] = useState<Program[]>([]);
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
        const { users, error } = await getAllInstructors();
        if (error) {
          console.error("Error fetching students:", error);
          return;
        }

        // Map student data
        const instructors = users.map((user) => ({
          id: user.userId,
          username: user.username,
          email: user.email,
          programId: user.programId, 
        }));

        setUserData(instructors);
      } catch (error) {
        console.error("Error fetching user data:", error);
      } finally {
        setLoading(false);
      }
    }

    async function fetchPrograms() {
        try {

          const result = await getAllPrograms();
          if (!result.error) {
            setPrograms(result.programs);
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
    fetchPrograms();
  }, [user]);

  if (loading) {
    return (
        <div className="flex items-center justify-center h-screen text-2xl font-semibold">
            <div className="animate-spin h-8 w-8 border-4 border-primary border-t-transparent rounded-full"></div>
            <span className="ml-2">Loading programs...</span>
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
      updateInstructor (userId, { programId: undefined });

      setUserData((prevState) =>
        prevState.map((user) =>
          user.id === userId ? { ...user, programId: null } : user
    )
  );
} else {
  // Otherwise, assign the user to the new project
      console.log(`User ${active.id} dragged to project ${over.id}`);

      const newProgram = over.data.current!.programId as number;
      setUserData((prevState) =>
        prevState.map((user) =>
          user.id === userId ? { ...user, programId: newProgram } : user
        )
      );
    }

    console.log(userData);

    updateInstructor (userId, { programId: over ? over.data.current!.programId : null });
    console.log(`User ${userId} updated with program ID ${over ? over.data.current!.programId : null}`);
  }


  return (
    <div className="container mx-auto py-10 h-full flex gap-2">
        {/* Students List (Draggable) */}
        {/* <DataTable columns={columns} data={userData} /> Eventually want to use this since it has a searchable table of users */}
        {/* map the user data into a column here */}
        <DndContext 
        onDragStart={onDragStart}
        onDragEnd={onDragEnd}   
        >
            <div>
                <h3 className="text-2xl font-semibold mx-4 mb-4">
                    Instructors
                </h3>
                {/* <div>
                    <DataTable columns={columns} data={userData.filter(user => user.projectId === null)} />
                </div> */}
                <div className="flex flex-col gap-6">
                    {/* List all the users that have a null projectId (haven't been assigned to a project yet) */}
                    {userData.filter(user => user.programId === null).map((user) => (
                        <UserCard key={user.id} user={user} />
                    ))}
                </div>
            </div>
            {/* Programs List (Droppable) */}
            <div>
                <h3 className="text-2xl font-semibold mx-4 mb-4">
                    Programs
                </h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-3 gap-6 px-4">
                        {programs.map((program) => (
                            <DroppableProgramCard
                                key={program.programId}
                                projectId={program.programId}
                                imgUrl={undefined}
                                title={program.programName}
                                description={program.programStatus}
                                tags={[]}
                                users={userData.filter(user => user.programId === program.programId)}
                            />
                        ))}
                </div>
            </div>
        </DndContext>
    </div>
  );
}
