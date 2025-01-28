"use client"

import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { z } from "zod"


// See capstone-portal-project_capstone_project db table for details
const formSchema = z.object({
  course_id: z.number().int().nonnegative(), // INTEGER NOT NULL
  track_id: z.number().int().nonnegative().optional(), // INTEGER (nullable in the DB, so optional here)
  cp_title: z.string().max(256), // VARCHAR(256) NOT NULL
  cp_description: z.string().optional(), // TEXT (nullable, so optional)
  cp_objectives: z.string().optional(), // TEXT (nullable, so optional)
  cp_date_created: z.string().datetime().optional(), // TIMESTAMP WITH TIME ZONE, auto-set
  cp_date_updated: z.string().datetime().optional(), // TIMESTAMP WITH TIME ZONE, auto-set
  cp_archived: z.boolean(), // BOOLEAN NOT NULL
});


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
          cp_date_created: undefined, // Optional datetime, undefined by default (auto-set in DB)
          cp_date_updated: undefined, // Optional datetime, undefined by default (auto-set in DB)
          cp_archived: false, // Required boolean, default to `false`
        },
      });
      

    return (
        <div></div>
      )    
  }
