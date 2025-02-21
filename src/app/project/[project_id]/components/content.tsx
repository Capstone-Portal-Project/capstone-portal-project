type content = {
    textcontent: {heading: string, text: string}[]
};

export default function Content(content: content) {
    return (
        <div className="grid gap-3 grid-rows-4">
            {content.textcontent.map((data, index) => (
                <div key={index} className="flex flex-col">
                    <h3 className="mb-2 text-xl text-copy font-semibold">{data.heading}</h3>
                    <p className="text-base text-copy tracking-tight">{data.text}</p>
                </div>
            ))}
        </div>
    );
}