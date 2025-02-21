import ProjectPageClient from "./projectPage";
import { getDummyData } from "./utils/getDummyData";
import getProjectProps from "./utils/getProjectProps";

interface BrowseProjectsParams {
  params: Promise<{ project_id: string }>;
}

export default async function ProjectPage({ params }: { params: Promise<{project_id: string}> }) {

  const projectId = (await params).project_id;
  const projectDetails = await getProjectProps(Number(projectId));

  console.log(projectDetails);

  return <ProjectPageClient project={projectDetails} />;

}
