const CardGrid = ({ children }: { children:React.ReactNode }) => {
    return (
        <div className="
            grid grid-cols-3 grid-rows-2 gap-6 w-[760px]
        ">
            {children}
        </div>
    );
}

export default CardGrid;