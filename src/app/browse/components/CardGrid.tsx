const CardGrid = ({ children }: { children?: React.ReactNode }) => {
    return(
      <div className="grid gap-8 2xl:gap-12 md:grid-cols-3 2xl:grid-cols-5 2xl:grid-rows-2 
      md:w-5/6 2xl:w-[90%] h-3/4"
      > 
        {children}
      </div>
    );
}

export default CardGrid;