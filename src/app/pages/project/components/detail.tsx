type infoCard = {
    img: string,
    desc: string,
    details: {
        'Project Partner': string,
        'NDA/IPA': boolean,
        'Number of Groups': number,
        'Project Status': boolean
    },
    keywords: string[]
};

export default async function Detail(infoCard: infoCard) {
    const { img, desc, details, keywords } = infoCard;

    return (
        <div className="h-[480px] w-[400px] grid grid-cols-1 gap-3 p-3 text-copy">
            {/* Thumbnail */}
            <img src={img} />

            <p>{desc}</p>

            {/* Details */}
            {/* Individual Details are organized as two spans, key and value */}
            <div>
                <div  className="grid grid-cols-2">
                    <span className="text-orange-beaver">Project Partner:</span>
                    <span>{details["Project Partner"]}</span>
                </div>
                <div  className="grid grid-cols-2">
                    <span className="text-orange-beaver">NDA/IPA:</span>
                    <span>{details["NDA/IPA"] ? "Agreement Required" : "Non-applicable"}</span>
                </div>
                <div  className="grid grid-cols-2">
                    <span className="text-orange-beaver">Number of Groups:</span>
                    <span>{details["Number of Groups"]}</span>
                </div>
                <div  className="grid grid-cols-2">
                    <span className="text-orange-beaver">Project Status:</span>
                    <span>{details["Project Status"] ? "Accepting Students" : "Closed"}</span>
                </div>                                                
            </div>

            {/* Tags */}
            <div>
                <p className="text-orange-beaver">Keywords:</p>
                <div className="flex gap-2">
                    {keywords.map((keyword, index) => (
                        <div key={index} 
                            className="text-center text-sm tracking-tight p-1 bg-copy text-white-off rounded-sm"
                        >{keyword}</div>
                    ))}
                </div>
            </div>
        </div>
    );
}