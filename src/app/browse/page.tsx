'use client'

import { useEffect, useState } from "react";
import { Toaster } from "~/components/ui/toaster";
import ProjectCard from "./components/ProjectCard";
import * as PortalPrimitive from "@radix-ui/react-portal";
import { getBrowseProjects } from "~/server/api/routers/project";
import CardGrid from "./components/CardGrid";
import Sidebar from "./components/Sidebar";

type Project = {
  projectId: number;
  projectTitle: string;
  appDescription: string;
  appImage: string | null;
  appOrganization: string;
  projectStatus: "draft" | "submitted" | "deferred" | "active" | "archived" | "incomplete" | null;
}

type ProjectCardProps = {
  imgUrl?: string,
  title?: string, 
  description?: string,
  tags?: string[],
  projectId?: number,
}

const BrowsePage = () => {
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProjects = async () => {
      try {
        const result = await getBrowseProjects();
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
    <div className="flex flex-col bg-[#FFFFFF] w-full  place-items-center pb-0 2xl:py-[40px]">
        <div className="layout grid grid-cols-12 h-[32rem]">
          <div className="col-span-3 h-full overflow-hidden">
          </div>
          <div className="col-span-6 h-full overflow-y-scroll scrollbar-none">
            <CardGrid>
              {projects.map((project: Project) => {
                const projectInstance: ProjectCardProps = {
                  imgUrl: project.appImage ?? undefined,
                  title: project.projectTitle,
                  description: project.appDescription,
                  projectId: project.projectId,
                };

                return (<ProjectCard key={project.projectId} {...projectInstance}/>);
              })}
            </CardGrid>           
          </div>
          <div className="col-span-3">
            <Sidebar />
          </div>
        </div>
      <PortalPrimitive.Root><Toaster /></PortalPrimitive.Root>
    </div>
  );
};

export default BrowsePage;