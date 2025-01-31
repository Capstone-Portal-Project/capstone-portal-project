'use client';

import { api } from "~/trpc/query-client";
import { ProjectCard } from "../_components/projectcard";
import { useRouter } from "next/navigation";
import { useState } from "react";

export default function BrowseProjects() {
  const router = useRouter();
  const [projects, setProjects] = useState<any[]>([]);

  const { data: projectsData } = api.capstoneProjects.getAll.useQuery(undefined, {
    onSuccess: (data) => {
      const activeProjects = data.filter(p => !p.cp_archived); // To-Do: Design a more effective way to retrieve active projects
      setProjects(activeProjects);
    }
  });

  const { mutate } = api.savedProjects.create.useMutation();

  const handleSaveProject = async (projectId: number) => {
    try {
      await mutate({
        cp_id: projectId,
        u_id: 1 // Replace with actual user ID from auth
      });
    } catch (error) {
      console.error("Error saving project:", error);
    }
  };

  return (
    <div className="container mx-auto p-6">
      <h1 className="mb-8 text-3xl font-bold">Browse Active Projects</h1>
      <div className="grid gap-6 md:grid-cols-2">
        {projects.map((project) => (
          <ProjectCard
            key={project.cp_id}
            project={project}
            onSave={handleSaveProject}
          />
        ))}
      </div>
    </div>
  );
}
