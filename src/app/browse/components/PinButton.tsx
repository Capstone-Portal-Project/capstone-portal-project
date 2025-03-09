'use client'

import clsx from "clsx";
import { Pin } from "lucide-react";
import { useState } from "react";
import { createSavedProject, getHighestSaveIndex } from "~/server/api/routers/savedProjects";

type PinButtonProps = {
    projectId: number;
    userId: number;
};

const PinButton = ({ projectId, userId }: PinButtonProps) => {
    const [isActive, setIsActive] = useState(false);
    const clickHandler = async (event: React.MouseEvent) => {
        event.preventDefault();
        setIsActive(!isActive);

        const saveIndex= await getHighestSaveIndex(userId);

        const savedProjectData = {
            userId,
            projectId,
            saveIndex,
        };

        const response = await createSavedProject(savedProjectData);
        console.log(response);
    };

    return (
        <div
            onClick={clickHandler}
            className={clsx(
                `flex items-center justify-center bg-[#FFFFFF] text-[#423e3c] ease-in-out transition-all
                group-hover:bg-[#f7f5f5] hover:!bg-[#e9e5e4] h-9 w-9 [&_svg]:size-6 rounded-md 
                [&_svg]:transition-colors [&_svg]:duration-500 [&_svg]:ease-in-out`,
                {
                    '[&_svg]:fill-[#C4D6A4]': isActive,
                    '[&_svg]:fill-[#f7f5f5]': !isActive
                }
            )}
        >
            <Pin />
        </div>
    );
};

export default PinButton;
