export default async function Hero() {
    return (
        <div className="w-full bg-orange-beaver px-12 py-24 flex flex-col items-center">
            <div className="font-bold text-6xl mb-8">
                3D Tetris Using Augmented Reality
            </div>
            <div className="text-xl tracking-tight px-16">
                Augmented Reality combines the real-ness of AR with the synthetic-ness of VR. In the project, the real will be a plastic box. The
                synthetic will be a group of weirdly-shaped 3D objects that the user will attempt to fit in the box under the control of real 
                collision physics. This can be just a fun excercise, but feel free to turn it into a game with scoring, timing, etc.
            </div>
        </div>
    );
}