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
import {
  MultiSelector,
  MultiSelectorContent,
  MultiSelectorInput,
  MultiSelectorItem,
  MultiSelectorList,
  MultiSelectorTrigger,
} from "../../components/ui/extension/multi-select";
import { Textarea } from "../../components/ui/textarea"
import { Switch } from "../../components/ui/switch"
import { useState, useEffect, useCallback } from 'react';
import { updateProjectById } from "~/server/api/routers/capstoneProject";
import { Toaster, toast } from "react-hot-toast";

// Adjust this zod object
const formSchema = z.object({
  course_id: z.array(z.string()).min(1, {
    message: "Please select at least one course.",
  }), // INTEGER NOT NULL
  cp_title: z.string().max(256, {
    message: "Title must be at most 256 characters.",
  }).min(2, {
    message: "Title must be larger than 2 characters",
  }), // VARCHAR(256) NOT NULL
  cp_description: z.string().min(10, {
    message: "Description must be at least 10 characters.",
  }), // TEXT
  cp_objectives: z.string().min(10, {
    message: "Objectives must be at least 10 characters.",
  }), // TEXT
  cp_archived: z.boolean(), // BOOLEAN NOT NULL
  cp_image: z.string().max(512).optional(), // VARCHAR(512) (nullable, so optional)
});

interface Project {
  cp_id: number; // Primary Key, auto-generated
  course_id: number[]; // NOT NULL
  cp_title: string; // NOT NULL, max length 256
  cp_description?: string; // TEXT, nullable
  cp_objectives?: string; // TEXT, nullable
  cp_date_created: string; // TIMESTAMP WITH TIME ZONE, default CURRENT_TIMESTAMP
  cp_date_updated: string; // TIMESTAMP WITH TIME ZONE, default CURRENT_TIMESTAMP
  cp_archived: boolean; // NOT NULL
  cp_image?: string; // VARCHAR(512), default empty string
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

export default function ProjectEditSidebarPopout( project : Project) {
  const [sidebarWidth, setSidebarWidth] = useState(320); // Initial sidebar width
  const [isResizing, setIsResizing] = useState(false);

  // Constants for sidebar structure
  const SIDEBAR_PADDING = 20; // Total padding (left + right)
  const HANDLE_WIDTH = 8; // Width of the draggable handle
  const MIN_WIDTH = 200; // Minimum sidebar width
  const MAX_WIDTH = 1000; // Maximum sidebar width

  const handleMouseMove = useCallback((e: MouseEvent) => {
    if (isResizing) {
      // Calculate width relative to the right edge, adjusting for padding and handle width
      const newWidth = Math.max(
        MIN_WIDTH, 
        Math.min(
          MAX_WIDTH, 
          window.innerWidth - e.clientX - HANDLE_WIDTH - SIDEBAR_PADDING
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
    <>
      <Toaster position="bottom-right" reverseOrder={false} />
      <div className="flex flex-row h-screen">
        
        {/* Resizing Handle */}
        <div
          className="cursor-ew-resize"
          style={{ width: HANDLE_WIDTH }}
          onMouseDown={handleMouseDown}
        />

        {/* Sidebar Container: fixed height with scrolling */}
        <div
          className="bg-gray-100 border-l border-gray-300 px-5 py-5 h-screen overflow-y-auto"
          style={{ width: sidebarWidth }}
        >
          <div className="w-full">
            <h1 className="mb-4 text-xl font-bold">Edit Project</h1>
            <ProjectEditForm {...project} />
          </div>
        </div>
      </div>
    </>
  );
}

export function ProjectEditForm(project : Project) {

    // TODO : Set default values to values of current project page
    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
          course_id: project.course_id?.map((id: number) => courseOptions[id] ?? ""),
          cp_title: project.cp_title,
          cp_description: project.cp_description,
          cp_objectives: project.cp_objectives,
          cp_archived: false,
          cp_image: project.cp_image,
        },
      });

    function onSubmit(values: z.infer<typeof formSchema>) {
        
        // Get values from the form
        const submittedValues = { 
          course_ids: values.course_id.map((x: string) => courseOptionsReversed[x]),
          cp_title: values.cp_title,
          cp_description: values.cp_description,
          cp_objectives: values.cp_objectives,
          cp_archived: values.cp_archived,
          cp_image: (values.cp_image ? values.cp_image : undefined),
        }

        console.log(submittedValues)

        updateProjectById(project.cp_id, {
          course_ids: submittedValues.course_ids.filter((id): id is number => id !== undefined),
          cp_title: submittedValues.cp_title,
          cp_description: submittedValues.cp_description,
          cp_objectives: submittedValues.cp_objectives,
          cp_image: submittedValues.cp_image,
          cp_archived: submittedValues.cp_archived,
        }).then(({ message }) => {
          toast.success("Project updated successfully!");
          console.log(message); // Show a success message
        }).catch((error) => {
          toast.error("Failed to update project.");
          console.error(error); // Show an error message
        });
    }
    
      return (
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">

              <FormField
                control={form.control}
                name="course_id"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Select Course</FormLabel>
                    <MultiSelector
                      onValuesChange={(value) => {
                        console.log(value)
                        field.onChange(value); 
                      }}
                      defaultValue={field.value.join(", ")} // Ensure values are strings
                      values={field.value}
                    >                      
                      <MultiSelectorTrigger>
                        <MultiSelectorInput placeholder={field.value.length > 0 ? undefined : "Select courses"} />
                      </MultiSelectorTrigger>
                      <MultiSelectorContent>
                        <MultiSelectorList>
                          {Object.entries(courseOptions).map(([key, value]) => (
                            <MultiSelectorItem key={value} value={value}>
                              <span>{value}</span>
                            </MultiSelectorItem>
                          ))}
                        </MultiSelectorList>
                      </MultiSelectorContent>
                    </MultiSelector>
                    <FormDescription>
                      Select courses to assign this project to.
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="cp_title"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Title</FormLabel>
                    <FormControl>
                      <Input
                        type=""
                        placeholder="Enter a title for the course"
                        {...field}
                      />
                    </FormControl>
                    <FormDescription>Provide a title for the course (max 256 characters).</FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
                
              <FormField
                control={form.control}
                name="cp_description"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Description</FormLabel>
                    <FormControl>
                      <Textarea
                        placeholder="Description" 
                        className="resize-none"
                        {...field}
                      />
                    </FormControl>
                    <FormDescription>Optional: Provide a description for the course.</FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="cp_objectives"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Objectives</FormLabel>
                    <FormControl>
                      <Textarea
                          placeholder="Description" 
                          className="resize-none"
                          {...field}
                        />
                    </FormControl>
                    <FormDescription>Optional: Specify the objectives of the course.</FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="cp_archived"
                render={({ field }) => (
                  <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                    <div className="space-y-0.5 mr-10">
                      <FormLabel>Archive Project</FormLabel>
                      <FormDescription>Archive this project in &quot;Browse Projects&quot; page</FormDescription>
                    </div>
                    <FormControl>
                      <Switch checked={field.value} onCheckedChange={field.onChange} aria-readonly />
                    </FormControl>
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="cp_image"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Project Image</FormLabel>
                    <FormControl>
                      <Input
                        type="file"
                        placeholder="Image"
                        {...field}
                      />
                    </FormControl>
                    <FormDescription>Upload an image</FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <Button type="submit">Submit</Button>
            </form>
          </Form>
      );
      
  }
