"use client";

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
import { Input } from "~/components/ui/input";
import { Textarea } from "~/components/ui/textarea";
import { api } from "~/trpc/query-client";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { UploadButton } from "../utils/uploadthing";

const formSchema = z.object({
  cp_title: z.string().min(2, {
    message: "Title must be at least 2 characters.",
  }).max(256, {
    message: "Title cannot exceed 256 characters."
  }),
  cp_description: z.string().min(10, {
    message: "Description must be at least 10 characters."
  }),
  cp_objectives: z.string().min(10, {
    message: "Objectives must be at least 10 characters."
  }),
  course_ids: z.array(z.number()).min(1, {
    message: "Please select at least one course"
  }),
  cp_image: z.string(),
});

export default function SubmitProjectForm() {
  const router = useRouter();
  const [courses, setCourses] = useState<any[]>([]);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      cp_title: "",
      cp_description: "",
      cp_objectives: "",
      course_ids: [],
      cp_image: "",
    },
  });

  const { data: coursesData } = api.courses.getAll.useQuery(undefined, {
    onSuccess: (data) => {
      setCourses(data);
    }
  });

  const { mutate } = api.capstoneProjects.create.useMutation({
    onSuccess: () => {
      router.push("/browse");
    },
  });

  function onSubmit(values: z.infer<typeof formSchema>) {
    mutate({
      ...values,
      cp_archived: false,
    });
  }

  const handleCourseSelection = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const selectedOptions = Array.from(e.target.selectedOptions).map(option => Number(option.value));
    form.setValue('course_ids', selectedOptions);
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
                    onChange={handleCourseSelection}
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