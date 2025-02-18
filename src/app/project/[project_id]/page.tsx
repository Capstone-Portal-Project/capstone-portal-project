import ProjectPageClient from "./projectPage";
import getProjectProps from "./utils/getProjectProps";

interface BrowseProjectsParams {
  params: { project_id: string };
}

export default async function ProjectPage({ params }: BrowseProjectsParams) {
  const project = await getProjectProps(Number(params.project_id));
  return <ProjectPageClient project={project} />;
}
