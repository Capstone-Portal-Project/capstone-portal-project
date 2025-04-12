"use client";

import { Archive, BookOpen, Pin, Search, Star } from "lucide-react";
import Link from "next/link";
import React, { useEffect, useState } from "react";
import { cn } from "~/lib/utils";
import { useAuth } from "@clerk/clerk-react";
import { getUserByClerkId } from "~/server/api/routers/user";
import { getProjectByUserId } from "~/server/api/routers/project"; 

const TabButton = ({ isActive = false, children }: { isActive?: boolean, children?: React.ReactNode }) => (
  <div className={cn(
    'text-[#808080] py-1 pl-1 flex font-semibold gap-1',
    {
      'bg-[#D73F09] text-[#f7f5f5]': isActive,
      'hover:bg-[#e9e5e4]' : !isActive,
    }
  )}>
    {children}
  </div>
);

const Sidebar = () => {
  const [assignedProjectId, setAssignedProjectId] = useState<number | null>(null);
  const { userId: clerkUserId, isSignedIn } = useAuth();

  useEffect(() => {
    const fetchAssignedProject = async () => {
      if (!isSignedIn || !clerkUserId) return;

      try {
        const { user: fetchedUser, error: userError } = await getUserByClerkId(clerkUserId);
        if (userError || !fetchedUser?.userId) {
          console.error("User fetch error:", userError);
          return;
        }

        const { project, error: projectError } = await getProjectByUserId(fetchedUser.userId);
        if (projectError || !project?.projectId) {
          console.error("Project fetch error:", projectError);
          return;
        }

        setAssignedProjectId(project.projectId);
      } catch (err) {
        console.error("Error loading assigned project:", err);
      }
    };

    fetchAssignedProject();
  }, [clerkUserId, isSignedIn]);

  return (
    <div className="bg-[#f7f5f5] h-full w-full rounded-lg flex flex-col pt-4 px-4 space-y-3">
      <div>
        <span className="text-[#808080] font-bold">Tabs</span>
        <div className="border h-[1px] w-full" />

        <Link href="/archive">
          <TabButton>
            <Archive /> Archived
          </TabButton>
        </Link>

        <Link href="/browse">
          <TabButton>
            <BookOpen /> Browse
          </TabButton>
        </Link>

        <Link href="/savedProjects">
          <TabButton isActive={true}>
            <Pin /> Saved
          </TabButton>
        </Link>

          <Link href={`/studentProject/${assignedProjectId}`}>
            <TabButton>
              <Star /> Assigned Project
            </TabButton>
          </Link>
      </div>

      <div>
        <span className="text-[#808080] font-bold">Filters</span>
        <div className="border h-[1px] w-full mb-3" />
        <div className="flex flex-col space-y-3">
          <div className="flex focus-within:ring-2 focus-within:ring-[#D73F09] content-center place-items-center bg-[#e9e5e4]">
            <Search className="mx-1" />
            <textarea 
              className="resize-none focus:outline-none w-full h-auto py-1 px-1 whitespace-nowrap overflow-hidden bg-[#e9e5e4]" 
              rows={1} placeholder="Search..." />
          </div>
          <span className="text-[#808080]">Sort by</span>  
        </div>       
      </div>
    </div>
  );
};

export default Sidebar;
