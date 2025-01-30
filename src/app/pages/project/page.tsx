
import Detail from "./components/detail";
import Hero from "./components/hero";
import Content from "./components/content";

export default async function ProjectPage() {
  return (
    <main className="w-full h-full bg-white-off grid grid-rows-[100vh]">
        <Hero />
        <div className="px-16 py-4">
          <div className="grid grid-cols-2">
            <Content />
            <div className="flex justify-self-end">
              <span className="shrink-0 bg-border h-full w-[1px] block bg-copy"></span>
              <Detail />
            </div>            
          </div>
        </div>
    </main>
  );
}

