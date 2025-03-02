import React from "react";

type InfoCard = {
  img: string;
  desc: string;
  details: {
    "Project Partner": string;
    "NDA/IPA": boolean;
    "Number of Groups": number;
    "Project Status": boolean;
  };
  keywords: string[];
};

export default function Detail({
  img,
  desc,
  details,
  keywords,
}: InfoCard) {
  return (
    <div className="flex flex-col gap-4 p-4 text-copy border border-copy rounded-sm">
      {/* Thumbnail */}
      <img
        src={img}
        alt="Project thumbnail"
        className="w-full h-auto object-cover rounded"
      />

      {/* Description */}
      <p>{desc}</p>

      {/* Details */}
      <div className="space-y-2">
        <div className="grid grid-cols-2">
          <span className="text-orange-beaver">Project Partner:</span>
          <span>{details["Project Partner"]}</span>
        </div>
        <div className="grid grid-cols-2">
          <span className="text-orange-beaver">NDA/IPA:</span>
          <span>
            {details["NDA/IPA"] ? "Agreement Required" : "Non-applicable"}
          </span>
        </div>
        <div className="grid grid-cols-2">
          <span className="text-orange-beaver">Number of Groups:</span>
          <span>{details["Number of Groups"]}</span>
        </div>
        <div className="grid grid-cols-2">
          <span className="text-orange-beaver">Project Status:</span>
          <span>
            {details["Project Status"] ? "Accepting Students" : "Closed"}
          </span>
        </div>
      </div>

      {/* Tags */}
      <div>
        <p className="text-orange-beaver">Keywords:</p>
        <div className="flex flex-wrap gap-2 mt-1">
          {keywords.map((keyword, index) => (
            <div
              key={index}
              className="text-center text-sm tracking-tight p-1 bg-copy text-white-off rounded-sm"
            >
              {keyword}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
