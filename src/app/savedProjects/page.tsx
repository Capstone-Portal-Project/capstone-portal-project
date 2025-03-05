"use client";

import { useEffect, useState } from "react";
import { Toaster } from "~/components/ui/toaster";
import ProjectCard from "./components/ProjectCard";
import * as PortalPrimitive from "@radix-ui/react-portal";
import { getSavedProjectsByUser } from "~/server/api/routers/savedProjects";
import CardGrid from "./components/CardGrid";
import Sidebar from "./components/Sidebar";

type SavedProject = {
  saveId: number;
  userId: number;
  projectId: number;
  saveIndex: number;
  preferenceDescription: string | null,
};

const SavedProjectsPage = ({ userId }: SavedProject) => {
  const [savedProjects, setProjects] = useState<SavedProject[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchSavedProjects = async () => {
      try {
        const result = await getSavedProjectsByUser(userId);
        if (!result.error) {
          setProjects(result.savedProjects);
        } else {
          console.error(result.message);
        }
      } catch (error) {
        console.error("Failed to fetch saved projects:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchSavedProjects();
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="animate-spin h-8 w-8 border-4 border-primary border-t-transparent rounded-full" />
      </div>
    );
  }

  return (
    <main className="flex flex-col bg-[#FFFFFF] w-full place-items-center pb-0 2xl:py-[40px]">
      <div className="layout grid grid-cols-12 h-[32rem]">
        <div className="col-span-3 h-full overflow-hidden"></div>
        <div className="col-span-6 h-full overflow-y-scroll scrollbar-none">
          <CardGrid>
            {savedProjects.map((savedProject) => (
              <ProjectCard
                saveId={savedProject.saveId}
                userId={savedProject.userId}
                projectId={savedProject.projectId}
                saveIndex={savedProject.saveIndex}
                preferenceDescription={savedProject.preferenceDescription}
              />
            ))}
          </CardGrid>
        </div>
        <div className="col-span-3">
          <Sidebar />
        </div>
      </div>
      <PortalPrimitive.Root>
        <Toaster />
      </PortalPrimitive.Root>
    </main>
  );
};

export default SavedProjectsPage;
