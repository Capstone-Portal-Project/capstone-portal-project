"use client";

import { useEffect, useState } from "react";
import Detail from "./components/detail";
import Hero from "./components/hero";
import Content from "./components/content";
import type { ProjectProps } from "./utils/getDummyData";
import ProjectEditSidebarPopout from "~/app/_components/editprojectpage";
import { Button } from "src/components/ui/button";
import { SquarePenIcon, EyeOffIcon } from "lucide-react";


interface ProjectPageClientProps {
  project: ProjectProps;
}

export default function ProjectPageClient({ project: initialProject }: ProjectPageClientProps) {
  const [project, setProject] = useState<ProjectProps>(initialProject);
  const [isSidebarVisible, setSidebarVisible] = useState(true);

  if (!project) return <div>Loading...</div>;

  return (
    <>
      {isSidebarVisible && (
        <ProjectEditSidebarPopout
          className="border-4 border-gray-300 rounded-lg"
          cp_id={0}
          course_id={[]}
          cp_title={""}
          cp_date_created={""}
          cp_date_updated={""}
          cp_archived={false}
          {...project}
        />
      )}

      <main className="w-full h-full bg-white-off grid grid-rows-[100vh]">
        <Hero {...project.hero} />
        <div className="px-16 py-4">
          <div className="grid grid-cols-2">
            <Content {...project.content} />
            <div className="flex justify-self-end">
              <span className="shrink-0 bg-border h-full w-[1px] block bg-copy"></span>
              <Detail
                {...{
                  ...project.infoCard,
                  details: {
                    ...project.infoCard.details,
                    "Project Status": project.infoCard.details["Project Status"] ?? false,
                  },
                  keywords: project.infoCard.keywords.map(keyword => keyword.tag ?? ""),
                }}
              />
            </div>
          </div>
        </div>
      </main>

      <Button
        onClick={() => setSidebarVisible(prev => !prev)}
        variant="outline" className="fixed bottom-4 right-4 border-[#DC4405]"
      >
        {isSidebarVisible ? (
          <>
            <SquarePenIcon />
            <p>Edit Project</p>
          </>
        ) : (
          <>
            <EyeOffIcon />
            <p>Close Editor</p>
          </>
        )}
      </Button>

    </>
  );
}
