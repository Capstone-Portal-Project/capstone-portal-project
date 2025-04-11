"use client";

import { Program } from "../types";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "../../../../components/ui/alert-dialog";

interface DeleteProgramDialogProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  programToDelete: number | null;
  programs: Program[];
  handleConfirmDelete: () => Promise<void>;
}

export function DeleteProgramDialog({
  isOpen,
  onOpenChange,
  programToDelete,
  programs,
  handleConfirmDelete,
}: DeleteProgramDialogProps) {
  const programName = programs.find(p => p.programId === programToDelete)?.programName;

  return (
    <AlertDialog open={isOpen} onOpenChange={onOpenChange}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Delete Program</AlertDialogTitle>
          <AlertDialogDescription>
            Are you sure you want to delete "{programName}"? This action cannot be undone and will permanently delete the program and all associated data.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter className="flex gap-2 justify-end">
          <AlertDialogCancel className="mt-0">Cancel</AlertDialogCancel>
          <AlertDialogAction onClick={handleConfirmDelete} className="bg-destructive text-destructive-foreground hover:bg-destructive/90">
            Delete Program
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
} 