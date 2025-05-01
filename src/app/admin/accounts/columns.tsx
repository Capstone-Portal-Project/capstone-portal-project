"use client"

import { ColumnDef } from "@tanstack/react-table"
import { ArrowUpDown, Edit, Trash } from "lucide-react"
import { Button } from "../../../components/ui/button"
import { Badge } from "../../../components/ui/badge"
import { AdminUser } from "./page"
import { Checkbox } from "../../../components/ui/checkbox"

interface ColumnActions {
  onEdit: (user: AdminUser) => void
  onDelete: (userId: number) => void
}

export const columns = ({ onEdit, onDelete }: ColumnActions): ColumnDef<AdminUser>[] => [
  {
    accessorKey: "username",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Username
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      )
    },
  },
  {
    accessorKey: "email",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Email
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      )
    },
  },
  {
    accessorKey: "isAdmin",
    header: "Admin",
    cell: ({ row }) => {
      const isAdmin = row.getValue("isAdmin") as boolean;
      return (
        <Checkbox 
          checked={isAdmin} 
          disabled
        />
      )
    },
  },
  {
    accessorKey: "isInstructor",
    header: "Instructor",
    cell: ({ row }) => {
      const isInstructor = row.getValue("isInstructor") as boolean;
      return (
        <Checkbox 
          checked={isInstructor} 
          disabled
        />
      )
    },
  },
  {
    id: "actions",
    cell: ({ row }) => {
      const user = row.original;
      
      return (
        <div className="flex items-center gap-2">
          <Button variant="ghost" size="icon" onClick={() => onEdit(user)}>
            <Edit className="h-4 w-4" />
          </Button>
          <Button 
            variant="ghost" 
            size="icon" 
            onClick={() => onDelete(user.id)}
            className="text-red-500 hover:text-red-700"
          >
            <Trash className="h-4 w-4" />
          </Button>
        </div>
      )
    },
  },
] 