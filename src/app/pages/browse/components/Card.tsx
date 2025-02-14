'use client'

import { useContext, useState } from "react";
import { ModalContext } from "./Modal";
import Tag from "./Tag";
import PinButton from "./PinButton";

type CardProps = {
    imgUrl?: string,
    title?: string,
    tags?: string[],
}

const CardHeader = () => {
    return (
        <div className="flex items-center p-2 pb-1 justify-end">
            <PinButton />
        </div>    
    );
}

const CardTitle = ({ children }: { children: React.ReactNode}) => {
    return (
        <div className="text-base font-semibold leading-none tracking-tight p-2">
            {children}
        </div>
    );
}

const Card = (props: CardProps) => {
    const { imgUrl, title, tags = [] } = props;

    const context = useContext(ModalContext);

    const clickHandler = () => {
        context?.onDisplayToggle();
    }    

    return (
        <div className="rounded-xl border bg-white-off text-card-foreground shadow">
            <CardHeader />
            <img src={imgUrl} onClick={clickHandler} className="cursor-pointer" />
            <CardTitle>{title}</CardTitle>
            {/* Field: Tags */}
            <div className="flex items-center p-2 gap-2">
                {tags.map((tag, index) => (
                    <Tag key={index} tag={ tag } />
                ))}
            </div>
        </div>
    );
}

export default Card;