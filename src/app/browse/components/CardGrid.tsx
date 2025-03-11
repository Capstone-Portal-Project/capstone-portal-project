import React from "react";

const CardGrid = ({ children }: { children?: React.ReactNode }) => {
  return(
    <div className="grid grid-flow-rows lg:auto-rows-[126px] 2xl:auto-rows-[156px] w-full">
      {React.Children.map(children, (child) => (
        <div className="flex flex-col">
          <div className="shrink-0 bg-[#e9e5e4] h-[2px] w-full my-1"/>
          {child}
        </div>
      ))

      }

    </div>
  );
}

export default CardGrid;