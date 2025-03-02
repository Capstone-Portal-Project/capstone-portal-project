import React from "react";
import type { Header } from "../utils/getDummyData";
import { Button } from "../../../../components/ui/button";
import { GithubIcon, VideoIcon } from "lucide-react";

export default function Header({
  title,
  organization,
  program,
  sequence,
  githubLink,
  videoLink,
}: Header) {
  console.log(title, organization, program, sequence);

  return (
    <div className="w-full bg-[#DC4405] px-8 py-16 flex flex-col items-start text-white relative">
      <h1 className="font-bold text-5xl mb-4">{title}</h1>
      <h2 className="text-2xl mb-2">{program}</h2>
      <h2 className="text-2xl mb-2">{organization}</h2>
      <h2 className="text-2xl mb-2">{sequence}</h2>
      
      <div className="absolute bottom-4 right-4 flex gap-2">
        {githubLink && (
          <a
            href={githubLink}
            target="_blank"
            rel="noopener noreferrer"
          >
            <Button className="rounded-full px-6 py-3 text-lg">
              <GithubIcon className="mr-2" /> Github
            </Button>
          </a>
        )}
        {videoLink && (
          <a
            href={videoLink}
            target="_blank"
            rel="noopener noreferrer"
          >
            <Button className="rounded-full px-6 py-3 text-lg">
              <VideoIcon className="mr-2" /> Video
            </Button>
          </a>
        )}
      </div>
    </div>
  );
}
