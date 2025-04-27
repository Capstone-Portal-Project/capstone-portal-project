"use client"

import { ColumnDef } from "@tanstack/react-table"
import { AdminUser } from "../page"
import { Badge } from "~/components/ui/badge"

export const columns: ColumnDef<AdminUser>[] = [
  {
    accessorKey: "username",
    header: "Username",
  },
  {
    accessorKey: "email",
    header: "Email",
  },
  {
    accessorKey: "type",
    header: "Type",
    cell: ({ row }) => {
      const type = row.getValue("type") as string
      return (
        <Badge variant={type === "admin" ? "default" : "secondary"}>
          {type}
        </Badge>
      )
    }
  },
  {
    accessorKey: "clerk_user_id",
    header: "Clerk ID",
    cell: ({ row }) => {
      const clerkId = row.getValue("clerk_user_id") as string
      return <span className="text-xs text-gray-500">{clerkId || "N/A"}</span>
    }
  }
] 