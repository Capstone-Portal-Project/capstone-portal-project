const mockData = {
    details: {
        "Project Partner": "Mike Bailey",
        "NDA/IPA": "Not Applicable",
        "Number of Groups": 1,
        "Project Status": "Accepting Applicants",
    },
    keywords: [
        "Gaming", "Augmented Reality (AR)", "New Product or Game"
    ],
}

const mockImg = "https://eecs.engineering.oregonstate.edu/capstone/submission/assets/img/capstone_test.jpg"

export default async function Detail() {
    return (
        <div className="h-[480px] w-[400px] grid grid-cols-1 gap-3 p-3 text-copy">
            {/* Thumbnail */}
            <img src={mockImg} className="" />

            {/* Description */}
            <p>
                I dunno, some random quick or short description and abstract goes here I guess, but what am I suppose to put here for three lines
            </p>

            {/* Details */}
            {/* Individual Details are organized as two spans, key and value */}
            <div>
                { Object.entries(mockData.details).map(([key, value], index) => (
                    // eslint-disable-next-line react/jsx-key
                    <div key={index} className="grid grid-cols-2">
                        <span className="text-orange-beaver">{key}:</span>
                        <span>{value}</span>
                    </div>
                ))}
            </div>

            {/* Tags */}
            <div>
                <p className="text-orange-beaver">Keywords:</p>
                <div className="flex gap-2">
                    {mockData.keywords.map((keyword, index) => (
                        <div key={index} 
                            className="text-center text-sm tracking-tight p-1 bg-copy text-white-off rounded-sm"
                        >{keyword}</div>
                    ))}
                </div>
            </div>

        </div>
    );
}