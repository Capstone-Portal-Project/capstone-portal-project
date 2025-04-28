"use client";

import { useState, useEffect } from "react";
import { useUser } from "@clerk/nextjs";
import { getProgramsByInstructorClerkId, getActivePrograms } from "~/server/api/routers/program";
import { updateProject, getProjectsByProgram, getProjectById } from "~/server/api/routers/project";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "~/components/ui/select";
import { Alert, AlertDescription, AlertTitle } from "~/components/ui/alert";
import { InfoIcon } from "lucide-react";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "~/components/ui/card";
import { Button } from "~/components/ui/button";
import Link from "next/link";
import { useToast } from "~/components/ui/toaster";

// Type definitions for better type safety
type Program = {
  programId: number;
  programName: string;
  programStatus: string;
  start_term?: {
    season: string;
    year: number;
  };
};

type Project = {
  projectId: number;
  projectTitle: string;
  appDescription: string;
  appOrganization: string;
  appImage: string | null;
  projectStatus: string | null;
};

export default function Projects() {
  const [programs, setPrograms] = useState<Program[]>([]);
  const [selectedProgramId, setSelectedProgramId] = useState<number | null>(null);
  const [allPrograms, setAllPrograms] = useState<Program[]>([]);
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);
  const [projectsLoading, setProjectsLoading] = useState(false);
  const { isSignedIn, user } = useUser();

   const { toast } = useToast();
  
  // Fetch instructor's programs
  useEffect(() => {
    const fetchInstructorPrograms = async () => {
      if (!isSignedIn || !user?.id) return;
      
      try {
        const result = await getProgramsByInstructorClerkId(user.id);
        if (!result.error && result.programs.length > 0) {
          setPrograms(result.programs);
          setSelectedProgramId(result.programs[0]?.programId || null);
        }
      } catch (error) {
        console.error("Failed to fetch instructor programs:", error);
      } finally {
        setLoading(false);
      }
    };
    
    fetchInstructorPrograms();
  }, [isSignedIn, user?.id]);
  
  // Fetch projects when a program is selected
  useEffect(() => {
    const fetchProjects = async () => {
      if (!selectedProgramId) return;
      
      setProjectsLoading(true);
      try {
        const result = await getProjectsByProgram(selectedProgramId);
        if (result && !result.error && Array.isArray(result.projects)) {
          setProjects(result.projects as Project[]);
        } else {
          setProjects([]);
          console.error("Failed to fetch projects:", result?.message || "Unknown error");
        }
      } catch (error) {
        setProjects([]);
        console.error("Error fetching projects:", error);
      } finally {
        setProjectsLoading(false);
      }
    };
    
    fetchProjects();
  }, [selectedProgramId]);

//gets all active programs
useEffect(() => {
  const fetchPrograms = async () => {
    const { programs, error } = await getActivePrograms();
    if (!error) {
      setAllPrograms(programs); // ✅ now correct
    } else {
      console.error("Failed to load programs");
    }
  };
  fetchPrograms();
}, []);


  if (loading) {
    return <div className="py-8 text-center">Loading your programs...</div>;
  }
  
  if (programs.length === 0) {
    return (
      <div className="py-8">
        <Alert variant="destructive">
          <InfoIcon className="h-4 w-4" />
          <AlertTitle>No Programs Found</AlertTitle>
          <AlertDescription>
            You are not assigned to any programs as an instructor. Contact an administrator for assistance.
          </AlertDescription>
        </Alert>
      </div>
    );
  }

  const selectedProgram = programs.find(p => p.programId === selectedProgramId);
  
  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold">Course Projects</h1>
          <p className="text-muted-foreground">
            Manage projects for your course
          </p>
        </div>
        <div className="flex gap-2 items-center">
          {programs.length > 1 && (
            <Select 
              value={selectedProgramId?.toString()} 
              onValueChange={(value) => setSelectedProgramId(Number(value))}
            >
              <SelectTrigger className="w-[200px]">
                <SelectValue placeholder="Select program" />
              </SelectTrigger>
              <SelectContent>
                {programs.map((program) => (
                  <SelectItem key={program.programId} value={program.programId.toString()}>
                    {program.programName}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          )}
          <Button variant="outline" onClick={() => window.location.reload()}>
            Refresh
          </Button>
        </div>
      </div>
      
      {selectedProgram && (
        <>
          <div className="text-lg">
            <span className="font-medium">Current program:</span> {selectedProgram.programName}
          </div>
          
          {projectsLoading ? (
            <div className="py-8 text-center">Loading projects...</div>
          ) : projects.length === 0 ? (
            <div className="py-8">
              <Alert>
                <InfoIcon className="h-4 w-4" />
                <AlertTitle>No Projects Found</AlertTitle>
                <AlertDescription>
                  There are no projects in this program yet. You can add new projects using the "Add Project" tool.
                </AlertDescription>
              </Alert>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {projects.map((project) => (
                <Card key={project.projectId} className="h-full flex flex-col">
                  <CardHeader>
                    <CardTitle className="line-clamp-2">{project.projectTitle}</CardTitle>
                    <CardDescription>{project.appOrganization}</CardDescription>
                  </CardHeader>
                  <CardContent className="flex-grow">
                    {project.appImage && (
                      <div className="mb-4">
                        <img 
                          src={project.appImage} 
                          alt={project.projectTitle} 
                          className="w-full h-40 object-cover rounded-md" 
                        />
                      </div>
                    )}
                    <p className="text-muted-foreground line-clamp-3">
                      {project.appDescription}
                    </p>
                  </CardContent>
                 <CardFooter className="flex justify-between items-center">
                    <div className="flex gap-2">
                      <Link href={`/project/${project.projectId}`}>
                        <Button variant="outline">Details</Button>
                      </Link>

                      <Select
                        onValueChange={async (value) => {
                          try {
                            const { project: fetchedProject, error } = await getProjectById(project.projectId);
                            if (error || !fetchedProject) {
                              toast({ title: "Error", description: "Failed to fetch project data." });
                              return;
                            }

                            const dataToUpdate = {
                              ...fetchedProject,
                              programsId: Number(value), // Now updating programsId!
                              showcaseDescription: fetchedProject.showcaseDescription ?? "",
                              showcaseImage: fetchedProject.showcaseImage ?? "",
                              showcaseVideo: fetchedProject.showcaseVideo ?? "",
                              projectGithubLink: fetchedProject.projectGithubLink ?? "",
                              sequenceReport: fetchedProject.sequenceReport ?? "",
                            };

                            const result = await updateProject(project.projectId, dataToUpdate);

                            if (!result.error) {
                              toast({ title: "Success", description: `Program updated!` });
                            } else {
                              toast({ title: "Error", description: result.message || "Failed to update program." });
                            }
                          } catch (error) {
                            console.error("Error updating program:", error);
                            toast({ title: "Error", description: "An error occurred while updating." });
                          }
                        }}
                      >
                        <SelectTrigger className="w-[160px]">
                          <SelectValue placeholder="Change Program" />
                        </SelectTrigger>
                        <SelectContent>
                          {allPrograms.map((program) => (
                            <SelectItem key={program.programId} value={program.programId.toString()}>
                              {program.programName}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>

                    {project.projectStatus && (
                      <span className={`px-2 py-1 text-xs rounded-full ${
                        project.projectStatus === 'active' ? 'bg-green-100 text-green-800' :
                        project.projectStatus === 'archived' ? 'bg-gray-100 text-gray-800' :
                        'bg-blue-100 text-blue-800'
                      }`}>
                        {project.projectStatus.charAt(0).toUpperCase() + project.projectStatus.slice(1)}
                      </span>
                    )}
                  </CardFooter>

                </Card>
              ))}
            </div>
          )}
        </>
      )}
    </div>
  );
}