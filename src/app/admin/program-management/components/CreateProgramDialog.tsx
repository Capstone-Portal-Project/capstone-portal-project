"use client";

import { Program, Term, User } from "../types";
import { Button } from "../../../../components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "../../../../components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../../../../components/ui/select";
import { Input } from "../../../../components/ui/input";
import { Textarea } from "../../../../components/ui/textarea";
import { Dispatch, SetStateAction } from "react";

type NewProgram = {
  programName: string;
  programDescription: string;
  programStatus: Program["programStatus"];
  startTermId: number;
  endTermId: number;
  selected_instructors: number[];
};

interface CreateProgramDialogProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  newProgram: NewProgram;
  setNewProgram: Dispatch<SetStateAction<NewProgram>>;
  handleCreateProgram: () => Promise<void>;
  terms: Term[];
  instructors: User[];
}

export function CreateProgramDialog({
  isOpen,
  onOpenChange,
  newProgram,
  setNewProgram,
  handleCreateProgram,
  terms,
  instructors,
}: CreateProgramDialogProps) {
  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogTrigger asChild>
        <Button>Create New Program</Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Create New Program</DialogTitle>
        </DialogHeader>
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-1">Program Name</label>
            <Input
              value={newProgram.programName}
              onChange={(e) => setNewProgram({ ...newProgram, programName: e.target.value })}
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Description</label>
            <Textarea
              value={newProgram.programDescription}
              onChange={(e) => setNewProgram({ ...newProgram, programDescription: e.target.value })}
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Status</label>
            <Select
              value={newProgram.programStatus}
              onValueChange={(value) => 
                setNewProgram({ 
                  ...newProgram, 
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
              value={String(newProgram.startTermId)}
              onValueChange={(value) => 
                setNewProgram({ 
                  ...newProgram, 
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
              value={String(newProgram.endTermId)}
              onValueChange={(value) => 
                setNewProgram({ 
                  ...newProgram, 
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
              value={newProgram.selected_instructors.length > 0 ? 'selected' : undefined}
              onValueChange={(value) => {
                if (value === 'all') {
                  setNewProgram({
                    ...newProgram,
                    selected_instructors: instructors.map(i => i.user_id),
                  });
                } else if (value === 'none') {
                  setNewProgram({
                    ...newProgram,
                    selected_instructors: [],
                  });
                }
              }}
            >
              <SelectTrigger className="w-full">
                <SelectValue>
                  {newProgram.selected_instructors.length > 0
                    ? `${newProgram.selected_instructors.length} instructor${
                        newProgram.selected_instructors.length === 1 ? "" : "s"
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
                      setNewProgram((prev: CreateProgramDialogProps["newProgram"]) => ({
                        ...prev,
                        selected_instructors: prev.selected_instructors.includes(userId)
                          ? prev.selected_instructors.filter((id: number) => id !== userId)
                          : [...prev.selected_instructors, userId]
                      }));
                    }}
                  >
                    <div className="flex items-center gap-2">
                      <input
                        type="checkbox"
                        checked={newProgram.selected_instructors.includes(instructor.user_id)}
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
          <Button onClick={handleCreateProgram}>Create Program</Button>
        </div>
      </DialogContent>
    </Dialog>
  );
} 