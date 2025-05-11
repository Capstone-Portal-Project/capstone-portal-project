"use client";

import { useState, useEffect } from "react";
import { ProgramLogs } from "~/app/_components/ProgramLogs";
import { Button } from "~/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "~/components/ui/tabs";
import { useParams } from "next/navigation";
import { getProgramById } from "~/server/api/routers/program";

export default function AdminProgramLogs() {
  const params = useParams();
  const [programId, setProgramId] = useState<number | null>(null);
  const [programName, setProgramName] = useState<string>("");
  const [loading, setLoading] = useState(true);
  
  // Extract program ID from URL
  useEffect(() => {
    if (params?.programId) {
      const id = Number(params.programId);
      setProgramId(id);
      
      // Fetch program details
      const fetchProgram = async () => {
        try {
          const result = await getProgramById(id);
          if (!result.error && result.program) {
            setProgramName(result.program.programName);
          }
        } catch (error) {
          console.error("Failed to fetch program details:", error);
        } finally {
          setLoading(false);
        }
      };
      
      fetchProgram();
    } else {
      setLoading(false);
    }
  }, [params]);
  
  if (loading) {
    return <div className="py-8 text-center">Loading...</div>;
  }
  
  if (!programId) {
    return (
      <div className="py-8 text-center">
        <h2 className="text-xl font-semibold mb-2">Program Not Found</h2>
        <p className="text-muted-foreground">Invalid program ID.</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold">Project Logs: {programName}</h1>
          <p className="text-muted-foreground">
            Track all project activities and communications
          </p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" onClick={() => window.location.reload()}>
            Refresh
          </Button>
        </div>
      </div>

      <Tabs defaultValue="all">
        <TabsList>
          <TabsTrigger value="all">All Logs</TabsTrigger>
          <TabsTrigger value="submissions">Submissions & Approvals</TabsTrigger>
          <TabsTrigger value="messages">Communications</TabsTrigger>
          <TabsTrigger value="transfers">Transfers</TabsTrigger>
        </TabsList>
        
        <TabsContent value="all" className="pt-4">
          <ProgramLogs programId={programId} />
        </TabsContent>
        
        <TabsContent value="submissions" className="pt-4">
          <ProgramLogs 
            programId={programId}
            logTypes={['submission', 'approval', 'deferment']} 
          />
        </TabsContent>
        
        <TabsContent value="messages" className="pt-4">
          <ProgramLogs 
            programId={programId}
            logTypes={['partner_message', 'instructor_admin_message']} 
          />
        </TabsContent>
        
        <TabsContent value="transfers" className="pt-4">
          <ProgramLogs 
            programId={programId}
            logTypes={['course_transfer']} 
          />
        </TabsContent>
      </Tabs>
    </div>
  );
} 