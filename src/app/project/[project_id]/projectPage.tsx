"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import ProjectContent from "./components/projectContent";
import type { ProjectProps } from "./utils/getDummyData";
import ProjectEditSidebarPopout from "~/app/_components/editprojectpage";
import type { ProjectSchema } from "~/app/_components/editprojectpage";
import { Button } from "src/components/ui/button";
import { SquarePenIcon } from "lucide-react";
import getProjectProps from "./utils/getProjectProps";
import { EyeOffIcon } from "lucide-react";

export interface ProjectPageClientProps {
  pageContent: ProjectProps;
  project: ProjectSchema;
}

export default function ProjectPageClient({
  pageContent: initialProject,
  project: projectDetails,
}: ProjectPageClientProps) {
  const [pageContent, setPageContent] = useState<ProjectProps>(initialProject);
  const [isSidebarVisible, setSidebarVisible] = useState(false);
  const router = useRouter();

  const handleRefresh = (editData: ProjectSchema) => {
    console.log("Refreshing page...");
    setPageContent(() => getProjectProps(editData, undefined, undefined));
    router.refresh();
  };

  const handleSidebarVisibility = (state: boolean) => {
    setSidebarVisible(!state)
  }

  if (!pageContent) return <div>Loading...</div>;

  return (
    <>
      {isSidebarVisible && (
        <ProjectEditSidebarPopout
          project={projectDetails}
          refreshPage={handleRefresh}
          onClose={() => setSidebarVisible(false)}
        />
      )}
      
      <ProjectContent {...pageContent} />

      {/* Optionally, you could have another button elsewhere to re-open the sidebar */}
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

