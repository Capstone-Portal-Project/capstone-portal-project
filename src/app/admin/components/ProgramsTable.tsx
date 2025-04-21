"use client";

import Link from "next/link";
import { Program } from "../types";
import { Button } from "../../../components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "../../../components/ui/table";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../../../components/ui/select";

interface ProgramsTableProps {
  programs: Program[];
  handleUpdateProgramStatus: (programId: number, newStatus: Program["programStatus"]) => Promise<void>;
  onEditClick: (program: Program) => void;
  onDeleteClick: (programId: number) => void;
}

export function ProgramsTable({
  programs,
  handleUpdateProgramStatus,
  onEditClick,
  onDeleteClick,
}: ProgramsTableProps) {
  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Program Name</TableHead>
          <TableHead>Description</TableHead>
          <TableHead>Start Term</TableHead>
          <TableHead>End Term</TableHead>
          <TableHead>Status</TableHead>
          <TableHead>Instructors</TableHead>
          <TableHead>Actions</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {programs.map((program) => (
          <TableRow key={program.programId}>
            <TableCell>{program.programName}</TableCell>
            <TableCell>{program.programDescription}</TableCell>
            <TableCell>
              {program.start_term?.season} {program.start_term?.year}
            </TableCell>
            <TableCell>
              {program.end_term?.season} {program.end_term?.year}
            </TableCell>
            <TableCell>
              <Select
                value={program.programStatus}
                onValueChange={(value) =>
                  handleUpdateProgramStatus(program.programId, value as Program["programStatus"])
                }
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="submissions">Submissions</SelectItem>
                  <SelectItem value="matching">Matching</SelectItem>
                  <SelectItem value="active">Active</SelectItem>
                  <SelectItem value="ending">Ending</SelectItem>
                  <SelectItem value="archived">Archived</SelectItem>
                  <SelectItem value="hidden">Hidden</SelectItem>
                </SelectContent>
              </Select>
            </TableCell>
            <TableCell>
              {program.instructors?.map((instructor) => instructor.username).join(", ")}
            </TableCell>
            <TableCell>
              <div className="flex gap-2">
                <Link href={`/admin-course/${program.programId}`}>
                  <Button size="sm">Manage</Button>
                </Link>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => onEditClick(program)}
                >
                  Edit
                </Button>
                <Button
                  variant="destructive"
                  size="sm"
                  onClick={() => onDeleteClick(program.programId)}
                >
                  Delete
                </Button>
              </div>
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
}
