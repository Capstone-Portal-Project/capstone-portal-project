const Tag = ({ tag }: { tag: string }) => {
    return (
        <div 
            className="
                inline-flex items-center rounded-md border px-2.5 py-0.5 
                text-xs font-semibold transition-colors 
                border-transparent bg-nav text-copy
            "
        >
            {tag}
        </div>
    );
}

export default Tag;