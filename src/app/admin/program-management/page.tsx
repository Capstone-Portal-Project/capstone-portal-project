"use client";

import { useState, useEffect } from "react";
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
import { Input } from "../../../components/ui/input";
import { Textarea } from "../../../components/ui/textarea";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "../../../components/ui/dialog";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "../../../components/ui/alert-dialog";
import { useToast } from "../../../components/ui/toaster";
import { Toaster } from "../../../components/ui/toaster";
import { 
  createProgram, 
  getAllPrograms, 
  updateProgramStatus,
  updateProgram,
  deleteProgram 
} from "~/server/api/routers/program";
import { getAllTerms } from "~/server/api/routers/term";
import { getAllUsers } from "~/server/api/routers/user";

interface Program {
  programId: number;
  programName: string;
  programDescription: string | null;
  programStatus: "submissions" | "matching" | "active" | "ending" | "archived" | "hidden";
  startTermId: number;
  endTermId: number;
  start_term?: Term;
  end_term?: Term;
  instructors?: User[];
}

interface Term {
  id: number;
  season: "winter" | "spring" | "summer" | "fall";
  year: number;
  is_published: boolean;
}

interface User {
  user_id: number;
  username: string;
  email: string;
  type: "project_partner" | "student" | "instructor" | "admin";
}

export default function ProgramManagementPage() {
  const [programs, setPrograms] = useState<Program[]>([]);
  const [terms, setTerms] = useState<Term[]>([]);
  const [instructors, setInstructors] = useState<User[]>([]);
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [editingProgram, setEditingProgram] = useState<Program | null>(null);
  const [newProgram, setNewProgram] = useState<{
    programName: string;
    programDescription: string;
    programStatus: Program["programStatus"];
    startTermId: number;
    endTermId: number;
    selected_instructors: number[];
  }>({
    programName: "",
    programDescription: "",
    programStatus: "submissions",
    startTermId: 0,
    endTermId: 0,
    selected_instructors: [],
  });
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [programToDelete, setProgramToDelete] = useState<number | null>(null);
  const { toast } = useToast();

  useEffect(() => {
    fetchPrograms();
    fetchTerms();
    fetchInstructors();
  }, []);

  const fetchPrograms = async () => {
    try {
      const result = await getAllPrograms();
      
      if (!result.error) {
        setPrograms(result.programs);
      } else {
        toast({
          variant: "destructive",
          title: "Error",
          description: result.message || "Failed to fetch programs",
        });
      }
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to fetch programs",
      });
    }
  };

  const fetchTerms = async () => {
    try {
      const result = await getAllTerms();
      if (!result.error) {
        const mappedTerms = result.terms.map(term => ({
          id: term.id,
          season: term.season,
          year: term.year,
          is_published: term.isPublished
        }));
        setTerms(mappedTerms);
      } else {
        toast({
          variant: "destructive",
          title: "Error",
          description: result.message || "Failed to fetch terms",
        });
      }
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to fetch terms",
      });
    }
  };

  const fetchInstructors = async () => {
    try {
      const result = await getAllUsers();
      if (!result.error) {
        const instructors = result.users
          .filter(user => user.type === "instructor")
          .map(user => ({
            user_id: user.userId,
            username: user.username,
            email: user.email,
            type: user.type as User["type"]
          }));
        setInstructors(instructors);
      } else {
        toast({
          variant: "destructive",
          title: "Error",
          description: result.message || "Failed to fetch instructors",
        });
      }
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to fetch instructors",
      });
    }
  };

  const handleCreateProgram = async () => {
    try {
      const result = await createProgram({
        programName: newProgram.programName,
        programDescription: newProgram.programDescription || undefined,
        programStatus: newProgram.programStatus,
        startTermId: parseInt(String(newProgram.startTermId)),
        endTermId: parseInt(String(newProgram.endTermId))
      });

      if (!result.error) {
        toast({
          title: "Success",
          description: "Program created successfully",
        });
        setIsCreateDialogOpen(false);
        fetchPrograms();
        setNewProgram({
          programName: "",
          programDescription: "",
          programStatus: "submissions",
          startTermId: 0,
          endTermId: 0,
          selected_instructors: [],
        });
      } else {
        toast({
          variant: "destructive",
          title: "Error",
          description: result.message || "Failed to create program",
        });
      }
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to create program",
      });
    }
  };

  const handleUpdateProgramStatus = async (programId: number, newStatus: Program["programStatus"]) => {
    try {
      const result = await updateProgramStatus(programId, newStatus);

      if (!result.error) {
        toast({
          title: "Success",
          description: "Program status updated successfully",
        });
        fetchPrograms();
      } else {
        toast({
          variant: "destructive",
          title: "Error",
          description: result.message || "Failed to update program status",
        });
      }
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to update program status",
      });
    }
  };

  const handleEditProgram = async () => {
    if (!editingProgram) return;
    
    try {
      const result = await updateProgram(editingProgram.programId, {
        programName: editingProgram.programName,
        programDescription: editingProgram.programDescription || undefined,
        programStatus: editingProgram.programStatus,
        startTermId: editingProgram.startTermId,
        endTermId: editingProgram.endTermId
      });

      if (!result.error) {
        toast({
          title: "Success",
          description: "Program updated successfully",
        });
        setIsEditDialogOpen(false);
        fetchPrograms();
      } else {
        toast({
          variant: "destructive",
          title: "Error",
          description: result.message || "Failed to update program",
        });
      }
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to update program",
      });
    }
  };

  const handleDeleteClick = (programId: number) => {
    setProgramToDelete(programId);
    setIsDeleteDialogOpen(true);
  };

  const handleConfirmDelete = async () => {
    if (programToDelete === null) return;
    
    try {
      const result = await deleteProgram(programToDelete);

      if (!result.error) {
        toast({
          title: "Success",
          description: "Program deleted successfully",
        });
        setIsDeleteDialogOpen(false);
        setIsEditDialogOpen(false);
        fetchPrograms();
      } else {
        toast({
          variant: "destructive",
          title: "Error",
          description: result.message || "Failed to delete program",
        });
      }
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to delete program",
      });
    }
  };

  return (
    <div className="container mx-auto py-8">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Program Management</h1>
        <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
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
                  value={newProgram.selected_instructors.join(",")}
                  onValueChange={(value) =>
                    setNewProgram({
                      ...newProgram,
                      selected_instructors: value ? value.split(",").map(Number) : [],
                    })
                  }
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select instructors" />
                  </SelectTrigger>
                  <SelectContent>
                    {instructors.map((instructor) => (
                      <SelectItem
                        key={instructor.user_id}
                        value={instructor.user_id.toString()}
                      >
                        {instructor.username}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <Button onClick={handleCreateProgram}>Create Program</Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      <div className="space-y-4">
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
                    <Button 
                      variant="outline" 
                      size="sm"
                      onClick={() => {
                        setEditingProgram(program);
                        setIsEditDialogOpen(true);
                      }}
                    >
                      Edit
                    </Button>
                    <Button 
                      variant="destructive" 
                      size="sm"
                      onClick={() => handleDeleteClick(program.programId)}
                    >
                      Delete
                    </Button>
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Edit Program</DialogTitle>
          </DialogHeader>
          {editingProgram && (
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
              <div className="flex justify-end">
                <Button onClick={handleEditProgram}>
                  Save Changes
                </Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>

      <AlertDialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Program</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete "{programs.find(p => p.programId === programToDelete)?.programName}"? This action cannot be undone and will permanently delete the program and all associated data.
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

      <Toaster />
    </div>
  );
}