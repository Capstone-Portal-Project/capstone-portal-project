
import Detail from "./components/detail";
import Hero from "./components/hero";
import Content from "./components/content";
import getProjectProps from "./utils/getProjectProps";
import ProjectEditSidebarPopout from "~/app/_components/editprojectpage";


export default async function ProjectPage() {
  const project = getProjectProps();

  return (
    <div className="flex flex-row h-screen">

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

      <main className="w-full h-full bg-white-off grid grid-rows-[100vh] pr-[300px]"> {/* Adjust padding based on sidebar width */}
        <Hero {...project.hero} />
        <div className="px-16 py-4">
          <div className="grid grid-cols-2">
            <Content {...project.content} />
            <div className="flex justify-self-end">
              <span className="shrink-0 bg-border h-full w-[1px] block bg-copy"></span>
              <Detail {...project.infoCard} />
            </div>
          </div>
        </div>
      </main>

      {/* Sidebar stays fixed to the right */}



    </div>
  );
}

