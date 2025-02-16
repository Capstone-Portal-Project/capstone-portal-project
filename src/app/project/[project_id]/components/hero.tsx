type hero = {
    title: string,
    desc: string,
}

export default async function Hero(hero: hero) {
    const {title, desc} = hero;

    return (
        <div className="w-full bg-orange-beaver px-12 py-24 flex flex-col items-center">
            <div className="font-bold text-6xl mb-8">{title}</div>
            <div className="text-xl tracking-tight px-16">{desc}</div>
        </div>
    );
}