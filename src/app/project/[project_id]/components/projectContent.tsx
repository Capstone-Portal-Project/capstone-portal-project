
import Detail from "./detail";
import Hero from "./hero";
import Content from "./content";
import type { ProjectProps } from "../utils/getDummyData";

export default function ProjectContent(pageContent : ProjectProps) {
    
    return (
        <main className="w-full h-full bg-white-off grid grid-rows-[100vh]">
            <Hero {...pageContent.hero} />
            <div className="px-16 py-4">
                <div className="grid grid-cols-2">
                    <Content {...pageContent.content} />
                    <div className="flex justify-self-end">
                    <span className="shrink-0 bg-border h-full w-[1px] block bg-copy"></span>
                    <Detail
                        {...{
                        ...pageContent.infoCard,
                        details: {
                            ...pageContent.infoCard.details,
                            "Project Status": pageContent.infoCard.details["Project Status"] ?? false,
                        },
                        keywords: pageContent.infoCard.keywords.map(keyword => keyword.tag ?? ""),
                        }}
                    />
                    </div>
                </div>
            </div>
        </main>
        );
}