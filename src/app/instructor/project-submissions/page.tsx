"use client";

import React, { useEffect, useState } from 'react';
import { getSubmittedProjects, updateProjectStatus } from '~/server/api/routers/project';
import { Button } from "~/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "~/components/ui/card";
import { Toaster, useToast } from "~/components/ui/toaster";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "~/components/ui/dialog";

type Project = {
  projectId: number;
  projectTitle: string;
  appDescription: string;
  appOrganization: string;
  programsId: number;
};

export default function ProjectSubmissions() {
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    async function fetchProjects() {
      try {
        const result = await getSubmittedProjects();
        if (!result.error) {
          setProjects(result.projects);
        } else {
          toast({
            variant: "destructive",
            title: "Error",
            description: result.message || "Failed to fetch projects",
          });
        }
      } catch (error) {
        toast({
          variant: "destructive",
          title: "Error",
          description: "Failed to fetch submitted projects",
        });
        console.error('Failed to fetch projects:', error);
      } finally {
        setLoading(false);
      }
    }

    fetchProjects();
  }, [toast]);

  const handleStatusChange = async (projectId: number, status: 'approved' | 'rejected') => {
    try {
      const result = await updateProjectStatus(projectId, status);
      
      if (!result.error) {
        setProjects(projects.filter(project => project.projectId !== projectId));
        toast({
          title: "Success",
          description: `Project ${status} successfully`,
        });
      } else {
        toast({
          variant: "destructive",
          title: "Error",
          description: result.message || `Failed to ${status} project`,
        });
      }
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Error",
        description: `Failed to ${status} project`,
      });
      console.error('Status update failed:', error);
    }
  };

  if (loading) {
    return (
      <div className="container mx-auto p-6">
        <div className="flex items-center justify-center">
          <div className="animate-spin h-8 w-8 border-4 border-primary border-t-transparent rounded-full"></div>
          <span className="ml-2">Loading submissions...</span>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">Project Submissions</h1>
        <p className="text-muted-foreground">
          {projects.length} pending {projects.length === 1 ? 'submission' : 'submissions'}
        </p>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {projects.map(project => (
          <Card key={project.projectId} className="flex flex-col">
            <CardHeader>
              <CardTitle className="line-clamp-1">{project.projectTitle}</CardTitle>
              <CardDescription className="line-clamp-1">{project.appOrganization}</CardDescription>
            </CardHeader>
            <CardContent>
              <p className="line-clamp-2 text-sm text-muted-foreground mb-4">
                {project.appDescription}
              </p>
            </CardContent>
            <CardFooter className="mt-auto space-x-2">
              <Dialog>
                <DialogTrigger asChild>
                  <Button variant="outline" size="sm">View Details</Button>
                </DialogTrigger>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>{project.projectTitle}</DialogTitle>
                    <DialogDescription>{project.appOrganization}</DialogDescription>
                  </DialogHeader>
                  <div className="py-4">
                    <h4 className="font-medium mb-2">Project Description</h4>
                    <p className="text-muted-foreground">{project.appDescription}</p>
                  </div>
                  <div className="flex gap-4 justify-end">
                    <Button 
                      onClick={() => handleStatusChange(project.projectId, 'approved')}
                      variant="default"
                    >
                      Approve
                    </Button>
                    <Button 
                      onClick={() => handleStatusChange(project.projectId, 'rejected')}
                      variant="destructive"
                    >
                      Reject
                    </Button>
                  </div>
                </DialogContent>
              </Dialog>
              <div className="flex gap-2">
                <Button 
                  onClick={() => handleStatusChange(project.projectId, 'approved')}
                  variant="default"
                  size="sm"
                >
                  Approve
                </Button>
                <Button 
                  onClick={() => handleStatusChange(project.projectId, 'rejected')}
                  variant="destructive"
                  size="sm"
                >
                  Reject
                </Button>
              </div>
            </CardFooter>
          </Card>
        ))}
        {projects.length === 0 && (
          <div className="col-span-full text-center py-10">
            <p className="text-muted-foreground">No pending submissions</p>
          </div>
        )}
      </div>
      <Toaster />
    </div>
  );
}
