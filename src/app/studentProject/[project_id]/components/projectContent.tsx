import React from "react";
import Detail from "./detail";
import Header from "./header";
import Content from "./content";
import type { ProjectProps } from "../utils/getDummyData";

export default function ProjectContent(pageContent: ProjectProps) {
  return (
    <main className="flex flex-col w-full h-auto bg-white-off">
      {/* Hero Section */}
      <Header {...pageContent.header} />

      {/* Main Content Section */}
      <section className="flex flex-row w-full px-8 py-8 gap-8">
        {/* Left Column: Text Content */}
        <div className="flex-1">
          <Content {...pageContent.content} />
        </div>

        {/* Divider */}
        <div className="w-px bg-copy" />

        {/* Right Column: Detail Card */}
        <div className="flex-initial">
          <Detail
            {...{
              ...pageContent.infoCard,
              details: {
                ...pageContent.infoCard.details,
                "Project Status":
                  pageContent.infoCard.details["Project Status"] ?? false,
              },
              keywords: pageContent.infoCard.keywords.map(
                (keyword) => keyword.tag ?? ""
              ),
            }}
          />
        </div>
      </section>
    </main>
  );
}
