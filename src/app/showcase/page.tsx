"use client"

import ProjectCard from "../browse/components/ProjectCard"
import React, { useEffect, useState } from "react"
import { getShowcaseProjects } from "~/server/api/routers/project"
import CardGrid from "../browse/components/CardGrid"
import { Separator } from "~/components/ui/separator"
import CourseFilter from "./_components/CourseFilter"
import RangeSlider from "./_components/RangeSlider"

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
    <div className="max-w-dvw flex">
      <div className="flex mx-[20px] h-screen w-full overflow-y-hidden pt-20">
        <div className="grid grid-cols-[1fr_240px] px-16">
          <main className="h-full flex overflow-y-scroll">
            <Separator orientation="vertical" />
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
          </main>
          <aside className="sticky flex space-x-3">
            <Separator orientation="vertical" />
            <div className="flex flex-col gap-3 pt-4 grow">
              <section className="course_filter space">
                <h4 className="tracking-tight font-semibold">Filter by Courses</h4> 
                <CourseFilter />
              </section>
              <section className="year_filter">
                <h4 className="tracking-tight font-semibold">Year Range</h4>
                <RangeSlider />
              </section>
            </div>
            <Separator orientation="vertical" />
          </aside>  
        </div>
      </div>  
    </div>
  )
}