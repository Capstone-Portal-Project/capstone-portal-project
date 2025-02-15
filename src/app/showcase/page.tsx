"use client"

import { ProjectCard } from "../_components/projectcard"
import { useEffect, useState } from "react"
import { getShowcaseProjects } from "~/server/api/routers/project"

export default function ShowcaseProjects() {
  const [projects, setProjects] = useState<any[]>([])

  useEffect(() => {
    const fetchProjects = async () => {
      const result = await getShowcaseProjects()
      if (!result.error) {
        setProjects(result.projects)
      } else {
        console.error(result.message)
      }
    }

    fetchProjects()
  }, [])

  function handleSaveProject(projectId: number): void {
    throw new Error("Function not implemented.")
  }

  return (
    <div className="container mx-auto p-6">
      <h1 className="mb-8 text-3xl font-bold">Project Showcase</h1>
      <div className="grid gap-6 md:grid-cols-2">
        {projects.map((project) => (
          <ProjectCard
            key={project.projectId}
            project={project}
            onSave={handleSaveProject}
          />
        ))}
      </div>
    </div>
  )
}