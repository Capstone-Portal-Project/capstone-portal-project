"use client";

import { useEffect, useState } from "react";
import { useUser } from "@clerk/nextjs";
import { DndContext, closestCenter } from "@dnd-kit/core";
import { arrayMove, SortableContext, sortableKeyboardCoordinates, verticalListSortingStrategy } from "@dnd-kit/sortable";
import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";

interface Project {
  saveId: number;
  studentId: number;
  projectId: number;
  saveIndex: number;
  preferenceDescription?: string;
}

export default function SavedProjectsPage() {
  const { user } = useUser();
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchProjects() {
      try {
        const response = await fetch("/api/savedProjects");
        const data = await response.json();
        if (!data.error) {
          setProjects(data.projects);
        } else {
          console.error("Error fetching projects:", data.message);
        }
      } catch (error) {
        console.error("Failed to fetch projects", error);
      } finally {
        setLoading(false);
      }
    }
    fetchProjects();
  }, []);

  const updateRank = async (saveId: number, newIndex: number) => {
    try {
      const response = await fetch("/api/savedProjects/update-rank", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ saveId, saveIndex: newIndex }),
      });

      if (response.ok) {
        setProjects((prev) =>
          prev.map((project) =>
            project.saveId === saveId ? { ...project, saveIndex: newIndex } : project
          )
        );
      } else {
        console.error("Failed to update rank:", await response.text());
      }
    } catch (error) {
      console.error("Failed to update rank", error);
    }
  };

  const handleDragEnd = (event: any) => {
    const { active, over } = event;
    if (!over || active.id === over.id) return;

    const oldIndex = projects.findIndex((project) => project.saveId === active.id);
    const newIndex = projects.findIndex((project) => project.saveId === over.id);

    if (oldIndex !== newIndex) {
      const newProjects = arrayMove(projects, oldIndex, newIndex);
      setProjects(newProjects);

      // Update rankings in the backend
      newProjects.forEach((project, index) => {
        updateRank(project.saveId, index + 1); // Assuming index starts from 1
      });
    }
  };

  if (loading) return <p>Loading...</p>;

  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold mb-4 text-center">Saved Projects</h1> {}
      <DndContext collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
        <SortableContext items={projects.map((p) => p.saveId)} strategy={verticalListSortingStrategy}>
          <ul className="flex flex-col items-center"> {}
            {projects.length > 0 ? (
              projects.map((project) => <SortableProject key={project.saveId} project={project} />)
            ) : (
              <p>No saved projects found.</p>
            )}
          </ul>
        </SortableContext>
      </DndContext>
    </div>
  );
}

function SortableProject({ project }: { project: Project }) {
  const { attributes, listeners, setNodeRef, transform, transition } = useSortable({ id: project.saveId });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  return (
    <li
      ref={setNodeRef}
      style={style}
      {...attributes}
      {...listeners}
      className="flex items-center justify-between px-4 py-6 border-b bg-white rounded-xl shadow-md cursor-grab active:cursor-grabbing w-3/4"
>
      <span className="font-semibold text-lg">Project ID: {project.projectId}</span>
      <span className="text-base text-gray-600">Rank: {project.saveIndex}</span>
    </li>
  );
}

