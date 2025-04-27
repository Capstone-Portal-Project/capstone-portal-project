"use client";

import { useState, useEffect } from "react";
import { ProgramLogs } from "~/app/_components/ProgramLogs";
import { Button } from "~/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "~/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "~/components/ui/tabs";
import { useUser } from "@clerk/nextjs";
import { getProgramsByInstructorClerkId } from "~/server/api/routers/program";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "~/components/ui/select";
import { Alert, AlertDescription, AlertTitle } from "~/components/ui/alert";
import { InfoIcon } from "lucide-react";

// Program interface for type safety
type Program = {
  programId: number;
  programName: string;
  programStatus: string;
  start_term?: {
    season: string;
    year: number;
  };
};

export default function InstructorProjectLogs() {
  const [programs, setPrograms] = useState<Program[]>([]);
  const [selectedProgramId, setSelectedProgramId] = useState<number | null>(null);
  const [loading, setLoading] = useState(true);
  const { isSignedIn, user } = useUser();
  
  // Fetch instructor's programs
  useEffect(() => {
    const fetchInstructorPrograms = async () => {
      if (!isSignedIn || !user?.id) return;
      
      try {
        const result = await getProgramsByInstructorClerkId(user.id);
        if (!result.error && result.programs.length > 0) {
          setPrograms(result.programs);
          // Auto-select the first program
          setSelectedProgramId(result.programs[0]?.programId || null);
        }
      } catch (error) {
        console.error("Failed to fetch instructor programs:", error);
      } finally {
        setLoading(false);
      }
    };
    
    fetchInstructorPrograms();
  }, [isSignedIn, user?.id]);
  
  if (loading) {
    return <div className="py-8 text-center">Loading your programs...</div>;
  }
  
  if (programs.length === 0) {
    return (
      <div className="py-8">
        <Alert variant="destructive">
          <InfoIcon className="h-4 w-4" />
          <AlertTitle>No Programs Found</AlertTitle>
          <AlertDescription>
            You are not assigned to any programs as an instructor. Contact an administrator for assistance.
          </AlertDescription>
        </Alert>
      </div>
    );
  }

  const selectedProgram = programs.find(p => p.programId === selectedProgramId);
  
  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold">Project Logs</h1>
          <p className="text-muted-foreground">
            Track all project activities and communications
          </p>
        </div>
        <div className="flex gap-2 items-center">
          {programs.length > 1 && (
            <Select 
              value={selectedProgramId?.toString()} 
              onValueChange={(value) => setSelectedProgramId(Number(value))}
            >
              <SelectTrigger className="w-[200px]">
                <SelectValue placeholder="Select program" />
              </SelectTrigger>
              <SelectContent>
                {programs.map((program) => (
                  <SelectItem key={program.programId} value={program.programId.toString()}>
                    {program.programName}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          )}
          <Button variant="outline" onClick={() => window.location.reload()}>
            Refresh
          </Button>
        </div>
      </div>
      
      {selectedProgram && (
        <>
          <div className="text-lg">
            <span className="font-medium">Current program:</span> {selectedProgram.programName}
          </div>
          
          <Tabs defaultValue="all">
            <TabsList>
              <TabsTrigger value="all">All Logs</TabsTrigger>
              <TabsTrigger value="submissions">Submissions</TabsTrigger>
              <TabsTrigger value="messages">Communications</TabsTrigger>
            </TabsList>
            
            <TabsContent value="all" className="pt-4">
              <ProgramLogs programId={selectedProgramId!} />
            </TabsContent>
            
            <TabsContent value="submissions" className="pt-4">
              <ProgramLogs 
                programId={selectedProgramId!}
                logTypes={['submission', 'approval', 'deferment']} 
              />
            </TabsContent>
            
            <TabsContent value="messages" className="pt-4">
              <ProgramLogs 
                programId={selectedProgramId!}
                logTypes={['partner_message', 'instructor_admin_message']} 
              />
            </TabsContent>
          </Tabs>
        </>
      )}
    </div>
  );
} 