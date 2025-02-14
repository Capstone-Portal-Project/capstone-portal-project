
import Card from "./components/Card";
import CardGrid from "./components/CardGrid";

const mockData = {
    imgUrl: "https://eecs.engineering.oregonstate.edu/capstone/submission/assets/img/capstone_test.jpg",
    title: "4-H Record Books (Year 2)",
    tags: ["Web", "React"]
}

const BrowsePage = async () => {
    return (
        <main className="w-full h-full bg-white-off grid grid-rows-[100vh]">
            <div className="flex justify-center">
                <CardGrid>
                    {Array.from({ length: 6}, (_, index) => <Card key={index} {...mockData} /> )}
                </CardGrid>
            </div>
        </main>
    );
}

export default BrowsePage;
