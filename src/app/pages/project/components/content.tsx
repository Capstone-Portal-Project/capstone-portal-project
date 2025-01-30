const data = [
    {
        heading: "Objectives",
        text:
            "The deliverable is the interactive program, using a Quest 3, that allows the user to oprtimally fit the 3D objects" +
            "in the box. This can be just a fun excercise, but feel free to turn it into a game with scoring, timing, etc.",
    },
    {
        heading: "Motivations",
        text:
            "Augmented Reality is a hot technology used (among other things) to teach people how to assemble or fix objects, " +
            "such as automobile engines.  That is a perfect example that combines the real-ness of AR with the synthetic-ness of" +
            " VR.  We could do that, but why not do something cooler and funner?",
    },
    {
        heading: "Minimum Qualifications",
        text:
            "All students on this project must have taken, or currently be taking, CS 450. No Exceptions!"
    },
    {
        heading: "Preferred Qualifications",
        text:
            "None Listed"
    }
]

export default async function Content() {
    return (
        <div className="grid gap-3 grid-rows-4">
            {data.map((data, index) => (
                <div key={index} className="flex flex-col">
                    <h3 className="mb-2 text-xl text-copy font-semibold">{data.heading}</h3>
                    <p className="text-base text-copy tracking-tight">{data.text}</p>
                </div>
            ))}
        </div>
    );
}