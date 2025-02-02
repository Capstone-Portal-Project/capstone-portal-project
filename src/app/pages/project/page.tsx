
import Detail from "./components/detail";
import Hero from "./components/hero";
import Content from "./components/content";
import getProjectProps from "./utils/getProjectProps";

export default async function ProjectPage() {
  const project = getProjectProps();

  return (
    <main className="w-full h-full bg-white-off grid grid-rows-[100vh]">
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
  );
}

