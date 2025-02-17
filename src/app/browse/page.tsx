'use client'

import { Toaster } from "~/components/ui/toaster";
import ProjectCard from "./components/ProjectCard";
import * as PortalPrimitive from "@radix-ui/react-portal";
import CardGrid from "./components/CardGrid";

const mockData = {
  imgUrl: "https://eecs.engineering.oregonstate.edu/capstone/submission/assets/img/capstone_test.jpg",
  title: "4-H Record Books (Year 2)",
  description: "4-H Record Books is logging and reporting software that tracks a youth’s journey through the 4-H program. It digitizes current handwritten reports to give youth a new, modern approach to record keeping. This software allows youth to log their progress and then automatically generate formatted PDF reports. Record Books allows users to track their 4-H resume and project records. Record Books is a PWA application.", 
  tags: ["Web", "React", "React", "React", "React", "React", "React"]
}

const BrowsePage = () => {
  return (
    <main className="bg-[#f7f5f5] w-full min-h-[100vh] place-items-center 
      flex justify-center py-10 2xl:py-[40px]">
      <PortalPrimitive.Root><Toaster /></PortalPrimitive.Root>
      <CardGrid>
        <ProjectCard {...mockData} />
        <ProjectCard {...mockData} />
        <ProjectCard {...mockData} />
        <ProjectCard {...mockData} />
        <ProjectCard {...mockData} />
        <ProjectCard {...mockData} />
        <ProjectCard {...mockData} />
        <ProjectCard {...mockData} />        
      </CardGrid>
    </main>
  );
}
 export default BrowsePage;