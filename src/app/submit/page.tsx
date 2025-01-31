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
  course_id: z.number(),
});

export default function SubmitProjectForm() {
  const router = useRouter();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      cp_title: "",
      cp_description: "",
      cp_objectives: "",
      course_id: 1,
    },
  });

  const { mutate } = api.capstoneProjects.create.useMutation({
    onSuccess: () => {
      router.push("/browse");
    },
    onError: (error) => {
      console.error("Mutation error:", error);
    }
  });

  function onSubmit(values: z.infer<typeof formSchema>) {
    mutate({
      ...values,
      cp_archived: false,
    });
  }

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
                  <Input 
                    placeholder="Enter your project title" 
                    {...field} 
                  />
                </FormControl>
                <FormDescription>
                  Give your project a clear, descriptive title that reflects its purpose.
                </FormDescription>
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
                    placeholder="Describe your project in detail"
                    className="min-h-[120px]"
                    {...field}
                  />
                </FormControl>
                <FormDescription>
                  Provide a comprehensive description of your project.
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="cp_objectives"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Project Objectives</FormLabel>
                <FormControl>
                  <Textarea
                    placeholder="List your project objectives"
                    className="min-h-[120px]"
                    {...field}
                  />
                </FormControl>
                <FormDescription>
                  Outline the main goals and objectives of your project.
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />

          <Button type="submit" className="w-full sm:w-auto">
            Submit Project
          </Button>
        </form>
      </Form>
    </div>
  );
}