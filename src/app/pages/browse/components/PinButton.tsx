import { useState } from "react";
import { Pin } from "lucide-react";

type PinButtonProps = {
    saved?: boolean
}

const PinButton = (props: PinButtonProps) => {
    const { saved = false } = props;
    const [click, setClick] = useState(saved);

    const clickHandler = () => {
        setClick(!click);
    }

    return(
        <div 
        onClick={clickHandler}
        data-state={ click ? 'active': 'default' }
        className="
            inline-flex items-center justify-center gap-2 
            whitespace-nowrap rounded-sm text-sm font-medium transition-colors
            cursor-pointer bg-white-off text-copy hover:bg-nav h-7 w-7
            [&_svg]:size-5 [&_svg]:shrink-0 [&_svg]:data-[state=default]:fill-white-off
            [&_svg]:duration-500 [&_svg]:ease-in-out [&_svg]:data-[state=active]:fill-[#C4D6A4]
        ">
            <Pin />
        </div>
    );
}

export default PinButton