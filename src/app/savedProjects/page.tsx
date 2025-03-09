"use client";

import { useEffect, useState } from "react";
import { Toaster } from "~/components/ui/toaster";
import ProjectCard from "./components/ProjectCard";
import * as PortalPrimitive from "@radix-ui/react-portal";
import { getSavedProjectsByUser, updateSavedProject, deleteSavedProject } from "~/server/api/routers/savedProjects";
import CardGrid from "./components/CardGrid";
import Sidebar from "./components/Sidebar";
import { useAuth } from "@clerk/clerk-react";
import { getUserByClerkId } from '~/server/api/routers/user';

type SavedProject = {
  saveId: number;
  userId: number;
  projectId: number;
  saveIndex: number;
  preferenceDescription: string | null;
};

const SavedProjectsPage = () => {
  const [savedProjects, setProjects] = useState<SavedProject[]>([]);
  const [loading, setLoading] = useState(true);
  const [userId, setUserId] = useState<number | null>(null); // State for userId

  const { userId: clerkUserId, isSignedIn } = useAuth(); // Fetch Clerk userId

  useEffect(() => {
    const fetchUserId = async () => {
      if (isSignedIn && clerkUserId) {
        try {
          // Use Clerk ID to fetch user info
          const { user: fetchedUser, error } = await getUserByClerkId(clerkUserId);
          if (error) {
            console.error("Failed to fetch user by Clerk ID:", error);
            return;
          }

          // Set the userId after fetching from Clerk
          setUserId(fetchedUser?.userId ?? null);
          console.log("Fetched userId:", fetchedUser?.userId);
        } catch (error) {
          console.error("Error fetching userId:", error);
        }
      } else {
        console.log("User is not signed in");
      }
    };

    fetchUserId();
  }, [isSignedIn, clerkUserId]); // Re-run when user info changes

  useEffect(() => {
    const fetchSavedProjects = async () => {
      if (userId) {
        try {
          const result = await getSavedProjectsByUser(userId);
          if (!result.error) {
            setProjects(result.savedProjects);
          } else {
            console.error(result.message);
          }
        } catch (error) {
          console.error("Failed to fetch saved projects:", error);
        } finally {
          setLoading(false);
        }
      }
    };

    fetchSavedProjects();
  }, [userId]); // Re-run when userId changes

  // Handle project deletion by removing it from the state
  // Inside SavedProjectsPage

  const handleDelete = async (saveId: number) => {
  // Find the project to delete
  const projectToDelete = savedProjects.find(project => project.saveId === saveId);
  if (!projectToDelete) return;

  // Delete the project
  await deleteSavedProject(saveId); // Assuming this is your delete function
  setProjects(prevProjects => prevProjects.filter(project => project.saveId !== saveId));

  // Get the index of the deleted project
  const deletedIndex = projectToDelete.saveIndex;

  // Update the saveIndex for projects with a higher rank
  setProjects(prevProjects => 
    prevProjects.map(project => {
      if (project.saveIndex > deletedIndex) {
        return {
          ...project,
          saveIndex: project.saveIndex - 1, // Decrease the rank of projects after the deleted one
        };
      }
      return project;
    })
  );
};


  // Handle moving project up
const handleMoveUp = async (saveId: number) => {
  const currentProject = savedProjects.find(project => project.saveId === saveId);
  if (!currentProject) return;

  const nextProject = savedProjects.find(project => project.saveIndex === currentProject.saveIndex - 1);
  if (!nextProject) return;

  // Swap the saveIndexes between the two projects
  const updateResult = await updateSavedProject(currentProject.saveId, { saveIndex: currentProject.saveIndex - 1 });
  const nextUpdateResult = await updateSavedProject(nextProject.saveId, { saveIndex: currentProject.saveIndex });

  if (updateResult.error || nextUpdateResult.error) {
    console.error("Failed to update project rank");
    return;
  }

  // After the update, reorder the projects based on the updated saveIndex
  setProjects(prevProjects => {
    const updatedProjects = prevProjects
      .map(project => 
        project.saveId === currentProject.saveId
          ? { ...project, saveIndex: currentProject.saveIndex - 1 }
          : project.saveId === nextProject.saveId
          ? { ...project, saveIndex: currentProject.saveIndex }
          : project
      )
      .sort((a, b) => a.saveIndex - b.saveIndex); // Sort projects by saveIndex to reflect correct order

    return updatedProjects;
  });
};

// Handle moving project down
const handleMoveDown = async (saveId: number) => {
  const currentProject = savedProjects.find(project => project.saveId === saveId);
  if (!currentProject) return;

  const nextProject = savedProjects.find(project => project.saveIndex === currentProject.saveIndex + 1);
  if (!nextProject) return;

  // Swap the saveIndexes between the two projects
  const updateResult = await updateSavedProject(currentProject.saveId, { saveIndex: currentProject.saveIndex + 1 });
  const nextUpdateResult = await updateSavedProject(nextProject.saveId, { saveIndex: currentProject.saveIndex });

  if (updateResult.error || nextUpdateResult.error) {
    console.error("Failed to update project rank");
    return;
  }

  // After the update, reorder the projects based on the updated saveIndex
  setProjects(prevProjects => {
    const updatedProjects = prevProjects
      .map(project => 
        project.saveId === currentProject.saveId
          ? { ...project, saveIndex: currentProject.saveIndex + 1 }
          : project.saveId === nextProject.saveId
          ? { ...project, saveIndex: currentProject.saveIndex }
          : project
      )
      .sort((a, b) => a.saveIndex - b.saveIndex); // Sort projects by saveIndex to reflect correct order

    return updatedProjects;
  });
};


  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="animate-spin h-8 w-8 border-4 border-primary border-t-transparent rounded-full" />
      </div>
    );
  }

  return (
    <main className="flex flex-col bg-[#FFFFFF] w-full place-items-center pb-0 2xl:py-[40px]">
      <div className="layout grid grid-cols-12 h-[32rem]">
        <div className="col-span-3 h-full overflow-hidden"></div>
        <div className="col-span-6 h-full overflow-y-scroll scrollbar-none">
          <CardGrid>
            {savedProjects.map((savedProject) => (
              <ProjectCard
                key={savedProject.saveId}  // Added key to avoid React warning
                saveId={savedProject.saveId}
                userId={savedProject.userId}
                projectId={savedProject.projectId}
                saveIndex={savedProject.saveIndex}
                preferenceDescription={savedProject.preferenceDescription}
                onDelete={handleDelete}  // Pass the handleDeleteProject function to ProjectCard
                onMoveUp={handleMoveUp}  // Pass the onMoveUp function
                onMoveDown={handleMoveDown}  // Pass the onMoveDown function
              />
            ))}
          </CardGrid>
        </div>
        <div className="col-span-3">
          <Sidebar />
        </div>
      </div>
      <PortalPrimitive.Root>
        <Toaster />
      </PortalPrimitive.Root>
    </main>
  );
};

export default SavedProjectsPage;
