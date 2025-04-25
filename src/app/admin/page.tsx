"use client";

import { useState, useEffect } from "react";
import { useToast } from "../../components/ui/toaster";
import { Toaster } from "../../components/ui/toaster";
import { 
  createProgram, 
  getAllPrograms, 
  updateProgramStatus,
  updateProgram,
  deleteProgram 
} from "~/server/api/routers/program";
import { getAllTerms } from "~/server/api/routers/term";
import { getAllUsers } from "~/server/api/routers/user";
import { Program, Term, User } from "./types";
import { CreateProgramDialog } from "./components/CreateProgramDialog";
import { EditProgramDialog } from "./components/EditProgramDialog";
import { DeleteProgramDialog } from "./components/DeleteProgramDialog";
import { ProgramsTable } from "./components/ProgramsTable";

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
        endTermId: parseInt(String(newProgram.endTermId)),
        selected_instructors: newProgram.selected_instructors
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
        endTermId: editingProgram.endTermId,
        selected_instructors: editingProgram.selected_instructors || []
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
        <CreateProgramDialog
          isOpen={isCreateDialogOpen}
          onOpenChange={setIsCreateDialogOpen}
          newProgram={newProgram}
          setNewProgram={setNewProgram}
          handleCreateProgram={handleCreateProgram}
          terms={terms}
          instructors={instructors}
        />
      </div>

      <div className="space-y-4">
        <ProgramsTable
          programs={programs}
          handleUpdateProgramStatus={handleUpdateProgramStatus}
          onEditClick={(program) => {
            setEditingProgram(program);
            setIsEditDialogOpen(true);
          }}
          onDeleteClick={handleDeleteClick}
        />
      </div>

      <EditProgramDialog
        isOpen={isEditDialogOpen}
        onOpenChange={setIsEditDialogOpen}
        editingProgram={editingProgram}
        setEditingProgram={setEditingProgram}
        handleEditProgram={handleEditProgram}
        terms={terms}
        instructors={instructors}
      />

      <DeleteProgramDialog
        isOpen={isDeleteDialogOpen}
        onOpenChange={setIsDeleteDialogOpen}
        programToDelete={programToDelete}
        programs={programs}
        handleConfirmDelete={handleConfirmDelete}
      />

      <Toaster />
    </div>
  );
}