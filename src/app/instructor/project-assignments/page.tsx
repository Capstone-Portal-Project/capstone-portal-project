"use client"

import React, { useEffect, useState } from "react";
import { DataTableUser, columns } from "./columns";
import { updateUser } from "../../../server/api/routers/user"

import { DataTable } from "./data-table";
import { useToast } from "~/components/ui/toaster"; // adjust the path as needed
import { useUser } from "@clerk/clerk-react";
import { getStudentsByProgram } from "~/server/api/routers/user";
import { getProjectsByProgram } from "~/server/api/routers/project";
import DroppableProjectCard from "./_components/DroppableProjectCard";
import UserCard from "./_components/UserCard";
import {
 DndContext,
 DragStartEvent,
 DragEndEvent,
 PointerSensor,
 useSensor,
 useSensors,
} from "@dnd-kit/core";


type Project = {
 projectId: number;
 projectTitle: string;
 appDescription: string;
 appImage: string | null;
 appOrganization: string;
 projectStatus:
   | "draft"
   | "submitted"
   | "deferred"
   | "active"
   | "archived"
   | "incomplete"
   | null;
};


export default function ProjectAssignments() {
 const { user } = useUser();
 const [userData, setUserData] = useState<DataTableUser[]>([]);
 const [originalUserData, setOriginalUserData] = useState<DataTableUser[]>([]);
 const [projects, setProjects] = useState<Project[]>([]);
 const [loading, setLoading] = useState(true);
 const { toast } = useToast();


 const sensors = useSensors(
   useSensor(PointerSensor, {
     activationConstraint: {
       distance: 5,
     },
   })
 );


 useEffect(() => {
   async function fetchUserData() {
     if (!user) return;


     try {
       const clerkId = user.id;
       const programId = 5;


       const { users, error } = await getStudentsByProgram(programId);
       if (error) {
         console.error("Error fetching students:", error);
         return;
       }


       const students = users.map((user) => ({
         id: user.userId,
         username: user.username,
         email: user.email,
         projectId: user.projectId,
       }));


       setUserData(students);
       setOriginalUserData(students);
     } catch (error) {
       console.error("Error fetching user data:", error);
     } finally {
       setLoading(false);
     }
   }


   async function fetchProjects() {
     try {
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
   }


   fetchUserData();
   fetchProjects();
 }, [user]);


 if (loading) {
   return (
     <div className="flex items-center justify-center h-screen text-2xl font-semibold">
       <div className="animate-spin h-8 w-8 border-4 border-primary border-t-transparent rounded-full"></div>
       <span className="ml-2">Loading...</span>
     </div>
   );
 }


 function hasChanges() {
   return JSON.stringify(userData) !== JSON.stringify(originalUserData);
 }


 function onDragStart(event: DragStartEvent) {
   const { active } = event;
   console.log(`User ${active.id} started dragging`);
 }


 function onDragEnd(event: DragEndEvent) {
   const { active, over } = event;
   const userId = active.data.current!.userId as number;


   if (!over) {
     setUserData((prev) =>
       prev.map((user) =>
         user.id === userId ? { ...user, projectId: null } : user
       )
     );
   } else {
     const newProject = over.data.current!.projectId as number;
     setUserData((prev) =>
       prev.map((user) =>
         user.id === userId ? { ...user, projectId: newProject } : user
       )
     );
   }
 }


 async function updateUserProjectAssignment(userId: number, projectId: number | null) {
  if (projectId) {
    console.log("pushing changes to the backend :)")
    console.log(JSON.stringify({ userId, projectId }))

    try {
      const result = await updateUser(userId, { projectId });
      if (result.error) {
        console.error(`Failed to update user ${userId}:`, result.message);
      } else {
        console.log(`User ${userId} updated with projectId ${projectId}`);
      }
    } catch (error) {
      console.error(`Error updating user ${userId}:`, error);
    }
  }
 }


 async function handleApplyChanges() {
   try {
     await Promise.all(
       userData.map((user) =>
         updateUserProjectAssignment(user.id, user.projectId)
       )
     );
     setOriginalUserData(userData);
     toast({
       title: "Changes saved",
       description: "Student assignments have been updated successfully.",
       variant: "default", // or "success" if you've customized variants
     });
   } catch (error) {
     console.error("Failed to apply changes:", error);
     toast({
       title: "Error",
       description: "Something went wrong while saving.",
       variant: "destructive",
     });
   }
 }


 return (
   <div className="absolute bottom-0 top-20 h-full flex flex-col bg-[#FFFFFF] w-full place-items-center pb-0">
     <div className="layout grid grid-cols-12 h-full">
       <DndContext sensors={sensors} onDragStart={onDragStart} onDragEnd={onDragEnd}>
         <div className="col-span-2 h-full overflow-hidden">
           <div className="flex flex-col gap-6">
             {userData
               .filter((user) => user.projectId === null)
               .map((user) => (
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


         <div className="col-span-2 h-full overflow-hidden">{/* Sidebar placeholder */}</div>
       </DndContext>
     </div>


     {hasChanges() && (
       <div className="fixed bottom-4 right-4 flex gap-4 z-50">
         <button
           className="px-4 py-2 bg-gray-800 hover:bg-gray-950 text-white rounded shadow"
           onClick={handleApplyChanges}
         >
           Apply Changes
         </button>
         <button
           className="px-4 py-2 bg-gray-300 text-gray-800 rounded shadow hover:bg-gray-400"
           onClick={() => setUserData(originalUserData)}
         >
           Cancel
         </button>
       </div>
     )}
   </div>
 );
}



