'use client';

import { useEffect, useState } from "react";
import { useAuth } from "@clerk/clerk-react"; 
import { Toaster } from "~/components/ui/toaster";
import ProjectCard from "./components/ProjectCard";
import * as PortalPrimitive from "@radix-ui/react-portal";
import { getProjectsByProgram } from "~/server/api/routers/project";
import { getUserByClerkId } from '~/server/api/routers/user';

type Project = {
  projectId: number;
  projectTitle: string;
  appDescription: string;
  appImage: string | null;
};

type ProjectCardProps = {
  imgUrl?: string;
  title?: string;
  description?: string;
  projectId?: number;
};

export default function Projects() {
  const { userId: clerkUserId, isSignedIn } = useAuth(); // Get logged-in user ID
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);
  const [programId, setProgramId] = useState<number | null>(null); // Store programId of user

  useEffect(() => {
    const fetchUserProgramId = async () => {
      if (isSignedIn && clerkUserId) {
        try {
          const { user, error } = await getUserByClerkId(clerkUserId);
          if (error || !user) {
            console.error("Failed to fetch user or user program data:", error);
            return;
          }
          setProgramId(user.programId);
        } catch (error) {
          console.error("Error fetching user program:", error);
        }
      }
    };

    fetchUserProgramId();
  }, [isSignedIn, clerkUserId]);

  useEffect(() => {
    const fetchProjects = async () => {
      if (!programId) return; // Only fetch projects once programId is available

      try {
        const projectsResult = await getProjectsByProgram(programId);
        if (!projectsResult.error) {
          setProjects(projectsResult.projects);
        } else {
          console.error(projectsResult.message);
        }
      } catch (error) {
        console.error("Failed to fetch projects:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchProjects();
  }, [programId]); // Fetch projects when programId changes

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="animate-spin h-8 w-8 border-4 border-primary border-t-transparent rounded-full" />
      </div>
    );
  }

  return (
    <main className="flex flex-col items-center bg-white w-full py-10">
      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 px-4">
        {projects.map((project: Project) => {
          const projectInstance: ProjectCardProps = {
            imgUrl: project.appImage ?? undefined,
            title: project.projectTitle,
            description: project.appDescription,
            projectId: project.projectId,
          };
          return <ProjectCard key={project.projectId} {...projectInstance} />;
        })}
      </div>
      <PortalPrimitive.Root><Toaster /></PortalPrimitive.Root>
    </main>
  );
}
