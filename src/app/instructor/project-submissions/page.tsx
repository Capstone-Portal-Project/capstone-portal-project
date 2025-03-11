"use client";

import React, { useEffect, useState } from 'react';
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
import { Textarea } from "~/components/ui/textarea";

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
  const [comments, setComments] = useState<string>("");

  useEffect(() => {
    async function fetchProjects() {
      try {
        const response = await fetch('/api/projects/submitted');
        const result = await response.json();
        
        if (response.ok) {
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

  const handleStatusChange = async (projectId: number, status: 'approved' | 'rejected', comments?: string) => {
    try {
      const response = await fetch('/api/projects/status', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ projectId, status, comments }),
      });
      
      const result = await response.json();
      
      if (response.ok) {
        setProjects(projects.filter(project => project.projectId !== projectId));
        setComments("");
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
        <div className="flex items-center justify-center h-screen text-2xl font-semibold">
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
          <Card key={project.projectId} className="flex flex-col h-full">
            <CardHeader>
              <CardTitle className="line-clamp-1">{project.projectTitle}</CardTitle>
              <CardDescription className="line-clamp-1">{project.appOrganization}</CardDescription>
            </CardHeader>
            <CardContent className="flex-grow">
              <p className="text-sm text-muted-foreground mb-4 line-clamp-3">
                {project.appDescription}
              </p>
            </CardContent>
            <CardFooter className="flex justify-center pb-4">
              <Dialog>
                <DialogTrigger asChild>
                  <Button 
                    variant="outline" 
                    size="sm"
                    className="w-full max-w-[200px] transition-all hover:bg-primary hover:text-primary-foreground"
                  >
                    Review Project
                  </Button>
                </DialogTrigger>
                <DialogContent className="max-w-2xl">
                  <DialogHeader>
                    <DialogTitle className="text-xl">{project.projectTitle}</DialogTitle>
                    <DialogDescription className="text-base">{project.appOrganization}</DialogDescription>
                  </DialogHeader>
                  <div className="space-y-6 py-4">
                    <div className="prose dark:prose-invert">
                      <p className="text-sm leading-relaxed">{project.appDescription}</p>
                    </div>
                    <div>
                      <label htmlFor="comments" className="text-sm font-medium block mb-2">
                        Review Comments
                      </label>
                      <Textarea
                        id="comments"
                        placeholder="Add your review comments here..."
                        value={comments}
                        onChange={(e) => setComments(e.target.value)}
                        className="min-h-[100px]"
                      />
                    </div>
                    <div className="flex justify-end gap-3 pt-4">
                      <Button 
                        onClick={() => handleStatusChange(project.projectId, 'rejected', comments)}
                        variant="destructive"
                        className="w-28"
                      >
                        Reject
                      </Button>
                      <Button 
                        onClick={() => handleStatusChange(project.projectId, 'approved', comments)}
                        variant="default"
                        className="w-28"
                      >
                        Approve
                      </Button>
                    </div>
                  </div>
                </DialogContent>
              </Dialog>
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
