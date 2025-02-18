"use client";

import { useEffect, useState } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { Button } from "~/components/ui/button";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "~/components/ui/form";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "~/components/ui/select";
import { Input } from "~/components/ui/input";
import { Textarea } from "~/components/ui/textarea";
import { useRouter } from "next/navigation";
import { UploadButton } from "../../utils/uploadthing";
import { createProject } from "~/server/api/routers/project";
import { getActivePrograms } from "~/server/api/routers/program";
import { Toaster, useToast } from "~/components/ui/toaster";

type Program = {
  programId: number;
  programName: string;
  programDescription: string | null;
};

const formSchema = z.object({
  programsId: z.number({
    required_error: "Program ID is required",
  }),
  projectTitle: z.string().min(2, {
    message: "Title must be at least 2 characters.",
  }).max(256, {
    message: "Title cannot exceed 256 characters."
  }),
  appDescription: z.string().min(10, {
    message: "Description must be at least 10 characters."
  }),
  appObjectives: z.string().min(10, {
    message: "Objectives must be at least 10 characters."
  }),
  appOrganization: z.string().min(2, {
    message: "Organization must be at least 2 characters."
  }).max(512, {
    message: "Organization cannot exceed 512 characters."
  }),
  appMotivations: z.string().min(10, {
    message: "Motivations must be at least 10 characters."
  }),
  appMinQualifications: z.string().min(10, {
    message: "Minimum qualifications must be at least 10 characters."
  }),
  appPrefQualifications: z.string().min(10, {
    message: "Preferred qualifications must be at least 10 characters."
  }),
  appImage: z.string().optional(),
  appVideo: z.string().optional(),
  projectGithubLink: z.union([z.string().url(), z.string().length(0)]).optional(),
  showcaseDescription: z.string().optional(),
  showcaseImage: z.string().optional(),
  showcaseVideo: z.string().optional(),
  isShowcasePublished: z.boolean().optional(),
  sequenceId: z.number().optional(),
  sequenceReport: z.string().optional(),
});

export default function SubmitProjectForm() {
  const router = useRouter();
  const { toast } = useToast();
  const [programs, setPrograms] = useState<Program[]>([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      programsId: undefined,
      projectTitle: "",
      appDescription: "",
      appObjectives: "",
      appOrganization: "",
      appMotivations: "",
      appMinQualifications: "",
      appPrefQualifications: "",
      appImage: "",
      appVideo: "",
      projectGithubLink: "",
      showcaseDescription: "",
      showcaseImage: "",
      showcaseVideo: "",
      isShowcasePublished: false,
      sequenceId: undefined,
      sequenceReport: "",
    },
  });

  useEffect(() => {
    async function fetchPrograms() {
      try {
        const result = await getActivePrograms();
        if (!result.error && result.programs) {
          setPrograms(result.programs);
        } else {
          toast({
            variant: "destructive",
            title: "Error",
            description: result.message || "Failed to fetch programs",
          });
        }
      } catch (error) {
        toast({
          variant: "destructive",
          title: "Error",
          description: "Failed to fetch available programs",
        });
        console.error('Failed to fetch programs:', error);
      } finally {
        setLoading(false);
      }
    }

    fetchPrograms();
  }, [toast]);

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    try {
      setSubmitting(true);
      const result = await createProject(values);
      
      if (!result.error) {
        toast({
          title: "Success",
          description: "Project created successfully!",
        });
        router.push(`/browse`);
      } else {
        toast({
          variant: "destructive",
          title: "Error",
          description: result.message || "Failed to create project",
        });
      }
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "An unexpected error occurred while creating the project",
      });
      console.error("Submission failed:", error);
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="container mx-auto p-6">
        <div className="flex items-center justify-center">
          <div className="animate-spin h-8 w-8 border-4 border-primary border-t-transparent rounded-full"></div>
          <span className="ml-2">Loading available programs...</span>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-6">
      <h1 className="mb-8 text-3xl font-bold">Submit a New Project</h1>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
          <FormField
            control={form.control}
            name="projectTitle"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Project Title</FormLabel>
                <FormControl>
                  <Input placeholder="Enter project title" {...field} />
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
                    placeholder="Enter project description" 
                    className="min-h-32"
                    {...field} 
                  />
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
                <FormLabel>Select Program/Course</FormLabel>
                <Select
                  onValueChange={(value) => field.onChange(parseInt(value))}
                  defaultValue={field.value?.toString()}
                >
                  <FormControl>
                    <SelectTrigger className="w-full">
                      <SelectValue placeholder="Select a program or course" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    {programs.map((program) => (
                      <SelectItem
                        key={program.programId}
                        value={program.programId.toString()}
                      >
                        <div>
                          <div className="font-medium">{program.programName}</div>
                          {program.programDescription && (
                            <div className="text-sm text-gray-500">
                              {program.programDescription}
                            </div>
                          )}
                        </div>
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <FormDescription>
                  Choose the program or course this project belongs to
                </FormDescription>
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
                    placeholder="Enter project objectives"
                    className="min-h-32" 
                    {...field} 
                  />
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
                  <Input placeholder="Enter organization name" {...field} />
                </FormControl>
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
                    placeholder="Enter project motivations"
                    className="min-h-32" 
                    {...field} 
                  />
                </FormControl>
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
                  <Textarea 
                    placeholder="Enter minimum qualifications"
                    className="min-h-32" 
                    {...field} 
                  />
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
                  <Textarea 
                    placeholder="Enter preferred qualifications"
                    className="min-h-32" 
                    {...field} 
                  />
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
                <FormLabel>Project Image</FormLabel>
                <FormControl>
                  <div className="flex flex-col gap-4">
                    <UploadButton
                      endpoint="imageUploader"
                      onClientUploadComplete={(res) => {
                        if (res?.[0]) {
                          field.onChange(res[0].url);
                          toast({
                            title: "Success",
                            description: "Image uploaded successfully",
                          });
                        }
                      }}
                      onUploadError={(error: Error) => {
                        toast({
                          variant: "destructive",
                          title: "Error",
                          description: `Failed to upload image: ${error.message}`,
                        });
                      }}
                    />
                    {field.value && (
                      <div className="mt-4">
                        <img 
                          src={field.value} 
                          alt="Project preview" 
                          className="max-w-xs rounded-lg shadow-md" 
                        />
                      </div>
                    )}
                  </div>
                </FormControl>
                <FormDescription>
                  Upload a project image (max 4MB)
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="projectGithubLink"
            render={({ field }) => (
              <FormItem>
                <FormLabel>GitHub Repository Link (Optional)</FormLabel>
                <FormControl>
                  <Input 
                    placeholder="https://github.com/username/repository" 
                    {...field} 
                  />
                </FormControl>
                <FormDescription>
                  Link to the project's GitHub repository
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />

          <Button type="submit" disabled={submitting}>
            {submitting ? (
              <div className="flex items-center">
                <div className="animate-spin h-4 w-4 border-2 border-current border-t-transparent rounded-full mr-2" />
                <span>Submitting...</span>
              </div>
            ) : (
              'Submit Project'
            )}
          </Button>
        </form>
      </Form>
      <Toaster />
    </div>
  );
}