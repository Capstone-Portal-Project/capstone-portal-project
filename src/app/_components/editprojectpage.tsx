"use client";

import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { z } from "zod"

import { Button } from "../../components/ui/button"
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "../../components/ui/form"
import { Input } from "../../components/ui/input"
import { Textarea } from "../../components/ui/textarea"
import { Switch } from "../../components/ui/switch"
import { useState, useEffect, useCallback } from 'react';
// import { updateProjectById } from "~/server/api/routers/capstoneProject";
import { Alert, AlertDescription, AlertTitle } from "../../components/ui/alert"
import { AlertCircle, CircleCheckBig } from "lucide-react"
import { ScrollArea } from "../../components/ui/scroll-area"

const formSchema = z.object({
  projectTitle: z.string(),
  programsId: z.number(),
  appImage: z.string().optional(),
  appVideo: z.string().optional(),
  appOrganization: z.string().optional(),
  appDescription: z.string(),
  appObjectives: z.string(),
  appMotivations: z.string(),
  appMinQualifications: z.string(),
  appPrefQualifications: z.string(),
  showcaseDescription: z.string().optional(),
  showcaseImage: z.string().optional(),
  showcaseVideo: z.string().optional(),
  isShowcasePublished: z.boolean().optional(),
  sequenceId: z.number().optional(),
  sequenceReport: z.string().optional(),
  projectGithubLink: z.string().optional()
});

export interface ProjectSchema {
  projectId: number;
  programsId: number;
  projectTitle: string;
  appImage: string | null;
  appVideo: string | null;
  appOrganization: string;
  appDescription: string;
  appObjectives: string;
  appMotivations: string;
  appMinQualifications: string;
  appPrefQualifications: string;
  showcaseDescription: string | null;
  showcaseImage: string | null;
  showcaseVideo: string | null;
  isShowcasePublished: boolean | null;
  sequenceId: number | null;
  sequenceReport: string | null;
  projectGithubLink: string | null;
}

// This is dummy data to be inputted later
const courseOptions: Record<number, string> = {
  1 : "Placeholder Course 1",
  2 : "Placeholder Course 2",
  3 : "Placeholder Course 3",
};

const courseOptionsReversed: Record<string, number> = {
  "Placeholder Course 1": 1,
  "Placeholder Course 2": 2,
  "Placeholder Course 3": 3,
};

export default function ProjectEditSidebarPopout({ project, className }: { project: ProjectSchema, className?: string }) {
  const [sidebarWidth, setSidebarWidth] = useState(350); // Initial sidebar width
  const [isResizing, setIsResizing] = useState(false);

  // Constants for sidebar structure
  const SIDEBAR_PADDING = 20; // Total padding (left + right)
  const HANDLE_WIDTH = 2; // Width of the draggable handle
  const MIN_WIDTH = 350; // Minimum sidebar width
  const MAX_WIDTH = 1000; // Maximum sidebar width

  const handleMouseMove = useCallback((e: MouseEvent) => {
    if (isResizing) {
      // Calculate width relative to the left edge
      const newWidth = Math.max(
        MIN_WIDTH, 
        Math.min(
          MAX_WIDTH, 
          e.clientX - SIDEBAR_PADDING // Width is determined by how far the cursor moves from the left
        )
      );
      setSidebarWidth(newWidth);
    }
  }, [isResizing]);  

  useEffect(() => {
    if (isResizing) {
      document.addEventListener("mousemove", handleMouseMove);
      document.addEventListener("mouseup", handleMouseUp);
    } else {
      document.removeEventListener("mousemove", handleMouseMove);
      document.removeEventListener("mouseup", handleMouseUp);
    }

    return () => {
      document.removeEventListener("mousemove", handleMouseMove);
      document.removeEventListener("mouseup", handleMouseUp);
    };
  }, [handleMouseMove, isResizing]);

  const handleMouseDown = () => {
    setIsResizing(true);
  };

  const handleMouseUp = () => {
    setIsResizing(false);
  };

  return (
    <div className={"flex flex-row fixed left-0 top-1/2 transform -translate-y-1/2 h-3/4 bg-white shadow-lg border-l border-gray-200 rounded-lg" + (className ? ` ${className}` : "")}>

      {/* Sidebar Container: fixed height with scrolling */}
      <ScrollArea>
        <div
          className="bg-gray-100 border-l border-gray-300 px-5 py-5 overflow-y-auto"
          style={{ width: sidebarWidth }}
        >
          <div className="w-full">
            <h1 className="mb-4 text-xl font-bold">Edit Project</h1>
            <ProjectEditForm {...project} />
          </div>
        </div>
      </ScrollArea>


      {/* Resizing Handle */}
      <div
        className="cursor-ew-resize"
        style={{ width: HANDLE_WIDTH }}
        onMouseDown={handleMouseDown}
      />

    </div>
  );
}

export function ProjectEditForm(project : ProjectSchema) {

  const [alertMessage, setAlertMessage] = useState<{ type: "success" | "error" | null; message: string | null }>({
    type: null,
    message: null,
  });

  // TODO : Set default values to values of current project page
  const form = useForm<z.infer<typeof formSchema>>({
      resolver: zodResolver(formSchema),
      defaultValues: {
        
      },
    });

  function onSubmit(values: z.infer<typeof formSchema>) {
      
      // Get values from the form
      const submittedValues = { 
        
      }

      console.log(submittedValues)

      // updateProjectById(project.cp_id, {
      //   course_ids: submittedValues.course_ids.filter((id): id is number => id !== undefined),
      //   cp_title: submittedValues.cp_title,
      //   cp_description: submittedValues.cp_description,
      //   cp_objectives: submittedValues.cp_objectives,
      //   cp_image: submittedValues.cp_image,
      //   cp_archived: submittedValues.cp_archived,
      // }).then(() => {
      //   setAlertMessage({ type: "success", message: "Project updated successfully!" });
      // })
      // .catch((error) => {
      //   setAlertMessage({ type: "error", message: "Failed to update project." });
      //   console.error(error);
      // });
  }
  
    return (
        <>
          {alertMessage.type && (
            <Alert variant={ alertMessage.type === "success" ? undefined : "destructive" }>
              {alertMessage.type === "success" ? <CircleCheckBig className="h-4 w-4" /> : <AlertCircle className="h-4 w-4" />}
              <AlertTitle>{alertMessage.type === "success" ? "Success!" : "Error!"}</AlertTitle>
              <AlertDescription>{alertMessage.message}</AlertDescription>
            </Alert>
          )}
        <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8 max-w-3xl mx-auto py-10">
              <FormField
                control={form.control}
                name="projectTitle"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Project Title</FormLabel>
                    <FormControl>
                      <Input 
                      placeholder="title"
                      
                      type="text"
                      {...field} />
                    </FormControl>
                    
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                  control={form.control}
                  name="programsId"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Program</FormLabel>
                      <FormControl>
                        <Input 
                        placeholder=""
                        
                        type="number"
                        {...field} />
                      </FormControl>
                      
                      <FormMessage />
                    </FormItem>
                  )}
                />

              <FormField
                control={form.control}
                name="appImage"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Image</FormLabel>
                    <FormControl>
                      <Input 
                      placeholder=""
                      
                      type="text"
                      {...field} />
                    </FormControl>
                    <FormDescription>This image will be displayed in this page</FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <FormField
                control={form.control}
                name="appVideo"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Video Link</FormLabel>
                    <FormControl>
                      <Input 
                      placeholder="Link to your video"
                      
                      type="text"
                      {...field} />
                    </FormControl>
                    
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <FormField
                control={form.control}
                name="appOrganization"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Organization</FormLabel>
                    <FormControl>
                      <Input 
                      placeholder="Oregon State Unviersity"
                      
                      type="text"
                      {...field} />
                    </FormControl>
                    
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <FormField
                control={form.control}
                name="appDescription"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Description</FormLabel>
                    <FormControl>
                      <Textarea
                        placeholder="Lorem Ipsum"
                        className="resize-none"
                        {...field}
                      />
                    </FormControl>
                    <FormDescription>This should describe details about the project.</FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <FormField
                control={form.control}
                name="appObjectives"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Objectives</FormLabel>
                    <FormControl>
                      <Textarea
                        placeholder="Lorem Ipsum"
                        className="resize-none"
                        {...field}
                      />
                    </FormControl>
                    <FormDescription>This should describe the objectives of the project</FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <FormField
                control={form.control}
                name="appMotivations"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Motivations</FormLabel>
                    <FormControl>
                      <Textarea
                        placeholder="Lorem Ipsum"
                        className="resize-none"
                        {...field}
                      />
                    </FormControl>
                    <FormDescription>This should describe the motive of this project.</FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <FormField
                control={form.control}
                name="appMinQualifications"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Minimum Qualifications</FormLabel>
                    <FormControl>
                      <Input 
                      placeholder="Breathes"
                      
                      type="text"
                      {...field} />
                    </FormControl>
                    
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <FormField
                control={form.control}
                name="appPrefQualifications"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Preferred Qualifications</FormLabel>
                    <FormControl>
                      <Input 
                      placeholder="Genius"
                      
                      type="text"
                      {...field} />
                    </FormControl>
                    
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <FormField
                control={form.control}
                name="showcaseDescription"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Showcase Description</FormLabel>
                    <FormControl>
                      <Textarea
                        placeholder=""
                        className="resize-none"
                        {...field}
                      />
                    </FormControl>
                    
                    <FormMessage />
                  </FormItem>
                )}
              />
              
                  
              <FormField
                control={form.control}
                name="showcaseImage"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Showcase Image</FormLabel>
                    <FormControl>
                      <Input 
                      placeholder=""
                      
                      type="text"
                      {...field} />
                    </FormControl>
                    
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <FormField
                control={form.control}
                name="showcaseVideo"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Showcase Video</FormLabel>
                    <FormControl>
                      <Input 
                      placeholder=""
                      
                      type="text"
                      {...field} />
                    </FormControl>
                    
                    <FormMessage />
                  </FormItem>
                )}
              />
              
                <FormField
                    control={form.control}
                    name="isShowcasePublished"
                    render={({ field }) => (
                      <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                        <div className="space-y-0.5">
                          <FormLabel>Publish on Showcase</FormLabel>
                          <FormDescription>Allow this project to be viewed in the project showcase</FormDescription>
                        </div>
                        <FormControl>
                          <Switch
                            checked={field.value}
                            onCheckedChange={field.onChange}
                            disabled
                            aria-readonly
                          />
                        </FormControl>
                      </FormItem>
                    )}
                  />
              
              <div className="grid grid-cols-12 gap-4">
                
                <div className="col-span-6">
                  
              <FormField
                control={form.control}
                name="sequenceId"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Sequence ID</FormLabel>
                    <FormControl>
                      <Input 
                      placeholder=""
                      
                      type="number"
                      {...field} />
                    </FormControl>
                    
                    <FormMessage />
                  </FormItem>
                )}
              />
                </div>
                
                <div className="col-span-6">
                  
              <FormField
                control={form.control}
                name="sequenceReport"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Sequence Report</FormLabel>
                    <FormControl>
                      <Input 
                      placeholder=""
                      
                      type="text"
                      {...field} />
                    </FormControl>
                    
                    <FormMessage />
                  </FormItem>
                )}
              />
                </div>
                
              </div>
              
              <FormField
                control={form.control}
                name="projectGithubLink"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Project Github Link</FormLabel>
                    <FormControl>
                      <Input 
                      placeholder=""
                      
                      type="text"
                      {...field} />
                    </FormControl>
                    
                    <FormMessage />
                  </FormItem>
                )}
              />
              <Button type="submit">Submit</Button>
            </form>
          </Form>
        </>
    );
  }
