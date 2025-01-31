"use client";

import { api } from "~/trpc/query-client";
import { ProjectCard } from "../_components/projectcard";
import { useState } from "react";

export default function ShowcaseProjects() {
  const [projects, setProjects] = useState<any[]>([]);

  const { data: projectsData } = api.capstoneProjects.getAll.useQuery(undefined, {
    onSuccess: (data) => {
      const archivedProjects = data.filter(p => p.cp_archived); //To-Do: Design a more effective way to retrieve archieved projects
      setProjects(archivedProjects);
    }
  });

  return (
    <div className="container mx-auto p-6">
      <h1 className="mb-8 text-3xl font-bold">Project Showcase</h1>
      <div className="grid gap-6 md:grid-cols-2">
        {projects.map((project) => (
          <ProjectCard
            key={project.cp_id}
            project={project}
          />
        ))}
      </div>
    </div>
  );
}