"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { Button } from "~/components/ui/button";
import { Select } from "~/components/ui/select";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "~/components/ui/form";
import { Input } from "~/components/ui/input";
import { Textarea } from "~/components/ui/textarea";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { UploadButton } from "../utils/uploadthing";
import { createProject } from "~/server/api/routers/capstoneProject";
import { getActiveCourses } from "~/server/api/routers/course";

const formSchema = z.object({
  cp_title: z.string().min(2, {
    message: "Title must be at least 2 characters.",
  }).max(256, {
    message: "Title cannot exceed 256 characters."
  }),
  cp_company: z.string().min(2, {
    message: "Company must be at least 2 characters.",
  }).max(256, {
    message: "Company cannot exceed 256 characters."
  }),
  cp_video: z.string().min(2, {
    message: "Video Link must be at least 2 characters.",
  }).max(256, {
    message: "Video Link cannot exceed 256 characters."
  }),
  cp_description: z.string().min(10, {
    message: "Description must be at least 10 characters."
  }),
  cp_qualifications: z.string().min(10, {
    message: "Qualifications must be at least 10 characters."
  }),
  cp_students_needed: z.number().min(1, {
    message: "At least 1 student is required."
  }).max(10, {
    message: "Cannot exceed 10 students."
  }),
  cp_objectives: z.string().min(10, {
    message: "Objectives must be at least 10 characters."
  }),
  course_ids: z.array(z.number()).min(1, {
    message: "Please select at least one course"
  }),
  cp_image: z.string().optional(),
});

export default function SubmitProjectForm() {
  const router = useRouter();
  const [courses, setCourses] = useState<any[]>([]);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      cp_title: "",
      cp_company: "",
      cp_video: "",
      cp_description: "",
      cp_qualifications: "",
      cp_students_needed: 0,
      cp_objectives: "",
      course_ids: [],
      cp_image: "",
    },
  });

  useEffect(() => {
    const fetchCourses = async () => {
      const result = await getActiveCourses();
      if (!result.error) {
        setCourses(result.courses);
      } else {
        console.error(result.message);
      }
    };

    fetchCourses();
  }, []);

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    const result = await createProject(values);
    if (!result.error) {
      router.push('/browse');
    } else {
      console.error(result.message);
    }
  };

  return (
    <div className="container mx-auto p-6">
      <h1 className="mb-8 text-3xl font-bold">Submit a New Project</h1>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
          <FormField
            control={form.control}
            name="cp_title"
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
            name="cp_company"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Project Partner Company</FormLabel>
                <FormControl>
                  <Input placeholder="Enter partner company" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
            />

<FormField
            control={form.control}
            name="cp_video"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Video Link</FormLabel>
                <FormControl>
                  <Input type="url" placeholder="Enter video link" {...field} />
                </FormControl>
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
                  <Textarea placeholder="Enter project description" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="cp_qualifications"
            render={({ field }) => (
              <FormItem className="col-span-3">
                <FormLabel>Qualifications</FormLabel>
                <FormControl>
                  <Textarea placeholder="List required qualifications" {...field} />
                </FormControl>
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
                  <Textarea placeholder="Enter project objectives" {...field} />
                </FormControl>
                <FormMessage />
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
                  <div className="flex flex-col gap-4">
                    <UploadButton
                      endpoint="imageUploader"
                      onClientUploadComplete={(res) => {
                        if (res?.[0]) {
                          field.onChange(res[0].url);
                        }
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
            name="cp_students_needed"
            render={({ field }) => (
              <FormItem className="col-span-3">
                <FormLabel>Students Needed </FormLabel>
                <FormControl>
                  <select {...field}>
                    {[...Array(10)].map((_, i) => (
                      <option key={i} value={i + 1}>{i + 1}</option>
                    ))}
                  </select>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />


          <FormField
            control={form.control}
            name="course_ids"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Associated Courses</FormLabel>
                <FormControl>
                  <select
                    multiple
                    className="w-full rounded-md border p-2"
                    onChange={(e) => {
                      const selectedOptions = Array.from(e.target.selectedOptions).map(option => Number(option.value));
                      form.setValue('course_ids', selectedOptions);
                    }}
                    value={field.value.map(String)}
                  >
                    {courses.map((course) => (
                      <option key={course.course_id} value={course.course_id}>
                        {course.name} - {course.term}
                      </option>
                    ))}
                  </select>
                </FormControl>
                <FormDescription>
                  Hold Ctrl/Cmd to select multiple courses
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />

          <Button type="submit">Submit Project</Button>
        </form>
      </Form>
    </div>
  );
}