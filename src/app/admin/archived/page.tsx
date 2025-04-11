'use client';

import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "~/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "~/components/ui/tabs";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "~/components/ui/select";
import { getArchivedProjects } from "~/server/api/routers/project";
import { Badge } from "~/components/ui/badge";
import Link from "next/link";
import { Toaster } from "~/components/ui/toaster";

type Project = {
  projectId: number;
  projectTitle: string;
  appDescription: string;
  appImage: string | null;
  appOrganization: string;
  projectStatus: "draft" | "submitted" | "deferred" | "active" | "archived" | "incomplete" | null;
};

export default function ArchivedPage() {
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchArchivedProjects = async () => {
      try {
        const result = await getArchivedProjects();
        if (!result.error) {
          setProjects(result.projects);
        }
      } catch (error) {
        console.error("Failed to fetch archived projects:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchArchivedProjects();
  }, []);

  const handleStatusChange = async (projectId: number, newStatus: Project['projectStatus']) => {
    console.log(`Changing status of project ${projectId} to ${newStatus}`);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-background">
        <div className="animate-spin h-8 w-8 border-4 border-primary border-t-transparent rounded-full" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background py-8">
      <div className="container max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <h1 className="text-2xl font-bold tracking-tight">Archive Management</h1>
          </div>
          
          <Tabs defaultValue="projects" className="w-full">
            <TabsList className="w-full mb-8 bg-card">
              <TabsTrigger value="projects" className="flex-1">Archived Projects</TabsTrigger>
              <TabsTrigger value="courses" className="flex-1">Archived Courses</TabsTrigger>
            </TabsList>

            <TabsContent value="projects">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {projects.map((project) => (
                  <Card key={project.projectId} className="group hover:shadow-lg transition-shadow duration-200">
                    <CardHeader className="space-y-1">
                      <div className="flex items-start justify-between">
                        <CardTitle className="text-xl font-bold line-clamp-1">
                          {project.projectTitle}
                        </CardTitle>
                        <Badge variant="secondary" className="ml-2 shrink-0">
                          {project.projectStatus}
                        </Badge>
                      </div>
                      <p className="text-sm text-muted-foreground">
                        {project.appOrganization}
                      </p>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-4">
                        <p className="text-sm text-muted-foreground line-clamp-2">
                          {project.appDescription}
                        </p>
                        <div className="flex items-center justify-between pt-2">
                          <Link 
                            href={`/project/${project.projectId}`}
                            className="text-sm font-medium text-primary hover:underline"
                          >
                            View Details
                          </Link>
                          <Select
                            onValueChange={(value) => 
                              handleStatusChange(project.projectId, value as Project['projectStatus'])
                            }
                            defaultValue={project.projectStatus || 'archived'}
                          >
                            <SelectTrigger className="w-[140px]">
                              <SelectValue placeholder="Status" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="active">Active</SelectItem>
                              <SelectItem value="archived">Archived</SelectItem>
                              <SelectItem value="hidden">Hidden</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </TabsContent>

            <TabsContent value="courses">
              <div className="flex items-center justify-center h-[400px] bg-card rounded-lg border">
                <p className="text-lg text-muted-foreground">
                  Course archive functionality coming soon...
                </p>
              </div>
            </TabsContent>
          </Tabs>
        </div>
      </div>
      <Toaster />
    </div>
  );
}
