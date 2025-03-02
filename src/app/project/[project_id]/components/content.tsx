import React from "react";

type ContentItem = {
  heading: string;
  text: string;
};

type ContentProps = {
  textcontent: ContentItem[];
};

export default function Content({ textcontent }: ContentProps) {
  return (
    <div className="grid grid-cols-[max-content_1fr] gap-x-12 w-full text-copy">
      {textcontent.map((data, index) => (
        <React.Fragment key={index}>
          {/* Heading cell */}
          <div className="py-4">
            <h3 className="text-2xl font-semibold">{data.heading}</h3>
          </div>
          {/* Text cell */}
          <div className="py-4">
            <p className="text-lg tracking-tight">{data.text}</p>
          </div>
          {/* Horizontal rule spanning both columns (if not the last item) */}
          {index !== textcontent.length - 1 && (
            <div className="col-span-2">
              <hr className="border-gray-300" />
            </div>
          )}
        </React.Fragment>
      ))}
    </div>
  );
}
