"use client"

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
  Select,
  SelectContent,
  SelectItem,
  SelectValue,
} from "../../components/ui/select"
import { Textarea } from "../../components/ui/textarea"
import { Switch } from "../../components/ui/switch"


// See capstone-portal-project_capstone_project db table for details
const formSchema = z.object({
  course_id: z.number().int().nonnegative(), // INTEGER NOT NULL
  track_id: z.number().int().nonnegative().optional(), // INTEGER (nullable in the DB, so optional here)
  cp_title: z.string().max(256, {
    message: "Title must be at most 256 characters.",
  }), // VARCHAR(256) NOT NULL
  cp_description: z.string().optional(), // TEXT (nullable, so optional)
  cp_objectives: z.string().optional(), // TEXT (nullable, so optional)
  cp_date_created: z.string().datetime().optional(), // TIMESTAMP WITH TIME ZONE, auto-set
  cp_date_updated: z.string().datetime().optional(), // TIMESTAMP WITH TIME ZONE, auto-set
  cp_archived: z.boolean(), // BOOLEAN NOT NULL
});

const courseOptions: Record<string, string> = {
  "1": "CS",
  "2": "EE",
  "3": "Online CS",
};

const trackOptions: Record<string, string> = {
  "1": "CS",
  "2": "EE",
  "3": "Online CS",
};



export function ProjectPageEditForm() {

    // TODO : Set default values to values of current project page
    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
          course_id: 0, // Default for a required integer
          track_id: 0, // Optional integer (nullable)
          cp_title: "", // Required string, default empty
          cp_description: "", // Optional string, empty by default
          cp_objectives: "", // Optional string, empty by default
          cp_date_updated: undefined, // Optional datetime, undefined by default (auto-set in DB)
          cp_archived: false, // Required boolean, default to `false`
        },
      });

    function onSubmit(values: z.infer<typeof formSchema>) {
        // Get the values from the form
        // Dont change the create date
        // Update the date updated to current time
        console.log(values)
    }
    
      return (
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
            <FormField
              control={form.control}
              name="course_id"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Course</FormLabel>
                  <Select onValueChange={field.onChange} defaultValue={String(field.value)}>
                    <FormControl>
                    <SelectValue placeholder="Select a course">
                      {field.value ? courseOptions[String(field.value)] : "Select a course"}
                    </SelectValue>
                    </FormControl>
                    <SelectContent> {/* TODO : Get names for the coruses dynamically */}
                      <SelectItem value="1">CS</SelectItem>
                      <SelectItem value="2">EE</SelectItem>
                      <SelectItem value="3">Online CS</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormDescription></FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="track_id"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Track ID</FormLabel>
                  <Select onValueChange={field.onChange} defaultValue={String(field.value)}>
                    <FormControl>
                    <SelectValue placeholder="Select a track">
                      {field.value ? trackOptions[String(field.value)] : "Select a track"}
                    </SelectValue>
                    </FormControl>
                    <SelectContent> {/* TODO : Get names for the coruses dynamically */}
                      <SelectItem value="1">CS</SelectItem>
                      <SelectItem value="2">EE</SelectItem>
                      <SelectItem value="3">Online CS</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormDescription>Optional: Provide the ID of the track.</FormDescription>
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
                      type="text"
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
                    /> {/* Dynamically get this value */}
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
                      /> {/* Dynamically get this value */}
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
                <FormItem>
                  <FormLabel>Archived</FormLabel>
                  <FormControl>
                    <Switch
                        checked={field.value}
                        onCheckedChange={field.onChange}
                      />
                  </FormControl>
                  <FormDescription>
                    Mark if the course is archived.
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
            <Button type="submit">Submit</Button>
          </form>
        </Form>
      );
      
  }
