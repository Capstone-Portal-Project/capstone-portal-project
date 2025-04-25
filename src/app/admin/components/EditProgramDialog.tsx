"use client";

import { Program, Term, User } from "../types";
import { Button } from "../../../components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "../../../components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../../../components/ui/select";
import { Input } from "../../../components/ui/input";
import { Textarea } from "../../../components/ui/textarea";
import { Dispatch, SetStateAction } from "react";

interface EditProgramDialogProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  editingProgram: Program | null;
  setEditingProgram: Dispatch<SetStateAction<Program | null>>;
  handleEditProgram: () => Promise<void>;
  terms: Term[];
  instructors: User[];
}

export function EditProgramDialog({
  isOpen,
  onOpenChange,
  editingProgram,
  setEditingProgram,
  handleEditProgram,
  terms,
  instructors,
}: EditProgramDialogProps) {
  if (!editingProgram) return null;

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Edit Program</DialogTitle>
        </DialogHeader>
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-1">Program Name</label>
            <Input
              value={editingProgram.programName}
              onChange={(e) => setEditingProgram({ ...editingProgram, programName: e.target.value })}
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Description</label>
            <Textarea
              value={editingProgram.programDescription || ""}
              onChange={(e) => setEditingProgram({ ...editingProgram, programDescription: e.target.value })}
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Status</label>
            <Select
              value={editingProgram.programStatus}
              onValueChange={(value) => 
                setEditingProgram({ 
                  ...editingProgram, 
                  programStatus: value as Program["programStatus"] 
                })
              }
            >
              <SelectTrigger>
                <SelectValue placeholder="Select status" />
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
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Start Term</label>
            <Select
              value={String(editingProgram.startTermId)}
              onValueChange={(value) => 
                setEditingProgram({ 
                  ...editingProgram, 
                  startTermId: parseInt(value) 
                })
              }
            >
              <SelectTrigger>
                <SelectValue placeholder="Select start term" />
              </SelectTrigger>
              <SelectContent>
                {terms.map((term) => (
                  <SelectItem key={term.id} value={term.id.toString()}>
                    {term.season} {term.year}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">End Term</label>
            <Select
              value={String(editingProgram.endTermId)}
              onValueChange={(value) => 
                setEditingProgram({ 
                  ...editingProgram, 
                  endTermId: parseInt(value) 
                })
              }
            >
              <SelectTrigger>
                <SelectValue placeholder="Select end term" />
              </SelectTrigger>
              <SelectContent>
                {terms.map((term) => (
                  <SelectItem key={term.id} value={term.id.toString()}>
                    {term.season} {term.year}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Instructors</label>
            <Select
              value={editingProgram.selected_instructors?.length ? 'selected' : undefined}
              onValueChange={(value) => {
                if (value === 'all') {
                  setEditingProgram({
                    ...editingProgram,
                    selected_instructors: instructors.map(i => i.user_id),
                  });
                } else if (value === 'none') {
                  setEditingProgram({
                    ...editingProgram,
                    selected_instructors: [],
                  });
                }
              }}
            >
              <SelectTrigger className="w-full">
                <SelectValue>
                  {editingProgram.selected_instructors?.length
                    ? `${editingProgram.selected_instructors.length} instructor${
                        editingProgram.selected_instructors.length === 1 ? "" : "s"
                      } selected`
                    : "Select instructors"}
                </SelectValue>
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Select All</SelectItem>
                <SelectItem value="none">Clear Selection</SelectItem>
                {instructors.map((instructor) => (
                  <SelectItem
                    key={instructor.user_id}
                    value={instructor.user_id.toString()}
                    onClick={(e) => {
                      e.preventDefault();
                      const userId = instructor.user_id;
                      setEditingProgram((prev: Program | null) => {
                        if (!prev) return prev;
                        return {
                          ...prev,
                          selected_instructors: prev.selected_instructors?.includes(userId)
                            ? prev.selected_instructors.filter((id: number) => id !== userId)
                            : [...(prev.selected_instructors || []), userId]
                        };
                      });
                    }}
                  >
                    <div className="flex items-center gap-2">
                      <input
                        type="checkbox"
                        checked={editingProgram.selected_instructors?.includes(instructor.user_id)}
                        readOnly
                        className="h-4 w-4 rounded border-gray-300"
                      />
                      <div className="flex flex-col">
                        <span className="font-medium">{instructor.username}</span>
                        <span className="text-sm text-gray-500">{instructor.email}</span>
                      </div>
                    </div>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div className="flex justify-end">
            <Button onClick={handleEditProgram}>
              Save Changes
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
} 