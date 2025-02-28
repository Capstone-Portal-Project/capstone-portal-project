'use client'

import { useEffect, useState } from "react";
import { Toaster } from "~/components/ui/toaster";
import ProjectCard from "./components/ProjectCard";
import * as PortalPrimitive from "@radix-ui/react-portal";
import { getArchivedProjects } from "~/server/api/routers/project";
import { Button } from "~/components/ui/button";
import { useRouter } from "next/navigation";

type Project = {
  projectId: number;
  projectTitle: string;
  appDescription: string;
  appImage: string | null;
  appOrganization: string;
  projectStatus: "draft" | "submitted" | "deferred" | "active" | "archived" | "incomplete" | null;
};

const ProjectArchivePage = () => {
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const fetchProjects = async () => {
      try {
        const result = await getArchivedProjects();
        if (!result.error) {
          setProjects(result.projects);
        } else {
          console.error(result.message);
        }
      } catch (error) {
        console.error("Failed to fetch archived projects:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchProjects();
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="animate-spin h-8 w-8 border-4 border-primary border-t-transparent rounded-full" />
      </div>
    );
  }

  return (
    <main className="min-h-screen bg-gray-50">
      <div className="container mx-auto py-8">
        <div className="flex justify-between items-center px-4">
          <h1 className="text-3xl font-bold">Archived Projects</h1>
          <Button onClick={() => router.push("/browse")}>Browse Projects</Button>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 px-4">
          {projects.map((project) => (
            <ProjectCard
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
              No archived projects available
            </div>
          )}
        </div>
      </div>
      <PortalPrimitive.Root><Toaster /></PortalPrimitive.Root>
    </main>
  );
};

export default ProjectArchivePage;
