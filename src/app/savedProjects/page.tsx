"use client";

import { useEffect, useState } from "react";
import { useUser } from "@clerk/nextjs";
import { Button } from "~/components/ui/button";

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
        const response = await fetch("/api/saved");
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
      const response = await fetch("/api/update-rank", {
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

  if (loading) return <p>Loading...</p>;

  return (
    <div className="p-4">
      <h1 className="text-xl font-bold">Saved Projects</h1>
      <ul>
        {projects.length > 0 ? (
          projects.map((project) => (
            <li
              key={project.saveId}
              className="flex items-center justify-between p-2 border-b"
            >
              <span>Project ID: {project.projectId}</span>
              <div className="flex gap-2">
                <span>Save Index: {project.saveIndex}</span>
                <Button onClick={() => updateRank(project.saveId, project.saveIndex + 1)}>
                  +
                </Button>
                <Button onClick={() => updateRank(project.saveId, project.saveIndex - 1)}>
                  -
                </Button>
              </div>
            </li>
          ))
        ) : (
          <p>No saved projects found.</p>
        )}
      </ul>
    </div>
  );
}
