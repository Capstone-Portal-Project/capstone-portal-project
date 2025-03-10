'use client'

import clsx from "clsx";
import { Pin } from "lucide-react";
import { useState, useEffect } from "react";
import { createSavedProject, deleteSavedProject, getHighestSaveIndex, getSavedProjectsByUser } from "~/server/api/routers/savedProjects";

type PinButtonProps = {
    projectId: number;
    userId: number;
};

const PinButton = ({ projectId, userId }: PinButtonProps) => {
    const [isActive, setIsActive] = useState(false);

    // Fetch saved projects when the component mounts
    useEffect(() => {
        const fetchSavedStatus = async () => {
            try {
                const savedProjectsResult = await getSavedProjectsByUser(userId);
                const isProjectSaved = savedProjectsResult.savedProjects.some(
                    (project) => project.projectId === projectId
                );
                setIsActive(isProjectSaved);  // Set the button state based on whether the project is saved
            } catch (error) {
                console.error("Failed to fetch saved projects:", error);
            }
        };

        fetchSavedStatus();
    }, [userId, projectId]);

    const clickHandler = async (event: React.MouseEvent) => {
        event.preventDefault();

        if (isActive) {
            const savedProjectsResult = await getSavedProjectsByUser(userId);
            const projectToDelete = savedProjectsResult.savedProjects.find(
                (project) => project.projectId === projectId
            );

            if (projectToDelete) {
                const deleteResult = await deleteSavedProject(projectToDelete.saveId);
                if (deleteResult.error) {
                    console.log(deleteResult.message);
                } else {
                    setIsActive(false);  // Set the button to inactive once deleted
                }
            }
        } else {
            // If the project is not saved, save it
            const saveIndex = await getHighestSaveIndex(userId);

            const savedProjectData = {
                userId,
                projectId,
                saveIndex,
            };

            const response = await createSavedProject(savedProjectData);
            if (response.error) {
                console.log(response.message);
            } else {
                setIsActive(true);  // Set the button to active once saved
            }
        }
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
