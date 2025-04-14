import React from "react";

const defaultImgUrl =
  "https://eecs.engineering.oregonstate.edu/capstone/submission/assets/img/capstone_test.jpg";

type InfoCard = {
  img: string;
  desc: string;
  details: {
    "Project Partner": string;
    "NDA/IPA": boolean;
    "Number of Groups": number;
    "Project Status": boolean;
    "Teammates": string[];
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
    <div className="flex flex-col gap-4 p-4 text-copy border border-copy rounded-sm max-w-1/4">
      {/* Thumbnail */}
      <img
        src={img || defaultImgUrl}
        alt="Project thumbnail"
        className="w-full h-auto object-cover rounded"
      />

      {/* Description */}
      <p>{desc}</p>

      {/* Details */}
      <div className="space-y-2">
        <div className="grid grid-cols-2">
          <span className="text-orange-beaver">Project Partner Email:</span>
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

        {/* Teammates Emails */}
<div className="grid grid-cols-2 items-start">
  <span className="text-orange-beaver">Teammate Emails:</span>
  <div className="flex flex-col gap-1">
    {details["Teammates"].map((email, index) => (
      <span key={index}>{email}</span>
    ))}
  </div>
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
