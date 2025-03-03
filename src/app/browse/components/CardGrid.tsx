import React from "react";

import React from "react";

const CardGrid = ({ children }: { children?: React.ReactNode }) => {
  return(
    <div className="grid grid-cols-1 grid-rows-3 w-full">
      {React.Children.map(children, (child) => (
        <div className="">
          <div className="shrink-0 bg-[#e9e5e4] h-[2px] w-full my-1"/>
          {child}
        </div>
      ))

      }

    </div>
  );
}

export default CardGrid;