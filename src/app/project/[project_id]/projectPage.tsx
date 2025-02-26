"use client";

import { useState } from "react";
import ProjectContent from "./components/projectContent";
import type { ProjectProps } from "./utils/getDummyData";
import ProjectEditSidebarPopout from "~/app/_components/editprojectpage";
import type { ProjectSchema } from "~/app/_components/editprojectpage";
import { Button } from "src/components/ui/button";
import { SquarePenIcon, EyeOffIcon } from "lucide-react";

export interface ProjectPageClientProps {
  pageContent: ProjectProps;
  project: ProjectSchema;
}

export default function ProjectPageClient({ pageContent: initialProject, project: projectDetails }: ProjectPageClientProps) {
  const [pageContent, setPageContent] = useState<ProjectProps>(initialProject);
  const [isSidebarVisible, setSidebarVisible] = useState(true);

  if (!pageContent) return <div>Loading...</div>;

  return (
    <>
      {isSidebarVisible && (
        <ProjectEditSidebarPopout
          project={projectDetails}
        />
      )}

      <ProjectContent {...pageContent} />

      <Button
        onClick={() => setSidebarVisible(prev => !prev)}
        variant="outline" className="fixed bottom-4 right-4 border-[#DC4405]"
      >
        {isSidebarVisible ? (
          <>
            <EyeOffIcon />
            <p>Close Editor</p>
          </>
        ) : (
          <>
            <SquarePenIcon />
            <p>Edit Content</p>
          </>
        )}
      </Button>

    </>
  );
}
