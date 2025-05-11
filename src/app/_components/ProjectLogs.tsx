"use client";

import { useState, useEffect } from "react";
import { getProjectLogsWithUsers } from "~/server/api/routers/projectLog";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "~/components/ui/card";
import { Badge } from "~/components/ui/badge";
import { ScrollArea } from "~/components/ui/scroll-area";

// Type for log entries
type LogEntry = {
  projectLogId: number;
  projectId: number;
  dateCreated: Date | string;
  content: string | null;
  memo: string | null;
  userId: number;
  projectLogType: 'submission' | 'deferment' | 'approval' | 'partner_message' | 'instructor_admin_message' | 'course_transfer';
  user?: {
    username: string;
    email: string;
    type: string;
  };
};

// Helper function to format log type text
const formatLogType = (type: LogEntry['projectLogType']) => {
  const typeMap: Record<LogEntry['projectLogType'], string> = {
    'submission': 'Project Submission',
    'deferment': 'Project Deferred',
    'approval': 'Project Approved',
    'partner_message': 'Partner Message',
    'instructor_admin_message': 'Instructor Message',
    'course_transfer': 'Course Transfer'
  };
  
  return typeMap[type] || type;
};

// Helper to get badge color by log type
const getBadgeVariant = (type: LogEntry['projectLogType']): "default" | "secondary" | "destructive" | "outline" => {
  switch (type) {
    case "submission":
      return "default";
    case "approval":
      return "default";
    case "deferment":
      return "destructive";
    case "partner_message":
      return "secondary";
    case "instructor_admin_message":
      return "secondary";
    case "course_transfer":
      return "outline";
    default:
      return "default";
  }
};

// Component for displaying logs
export function ProjectLogs({ projectId, maxHeight = "400px" }: { projectId: number; maxHeight?: string }) {
  const [logs, setLogs] = useState<LogEntry[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchLogs = async () => {
      setLoading(true);
      setError(null);
      
      try {
        const result = await getProjectLogsWithUsers(projectId);
        if (result.error) {
          setError(result.message || "Failed to fetch logs");
        } else {
          setLogs(result.logs as LogEntry[]);
        }
      } catch (err) {
        setError("An unexpected error occurred");
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchLogs();
  }, [projectId]);

  if (loading) {
    return <div className="text-center py-4">Loading logs...</div>;
  }

  if (error) {
    return <div className="text-red-500 text-center py-4">Error: {error}</div>;
  }

  if (logs.length === 0) {
    return <div className="text-center py-4 text-muted-foreground">No logs available for this project</div>;
  }

  // Function to format date
  const formatDate = (date: Date | string) => {
    const dateObj = typeof date === 'string' ? new Date(date) : date;
    return new Intl.RelativeTimeFormat('en', { numeric: 'auto' }).format(
      Math.round((dateObj.getTime() - Date.now()) / (1000 * 60 * 60 * 24)),
      'day'
    );
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Project Activity Log</CardTitle>
        <CardDescription>History of actions and messages for this project</CardDescription>
      </CardHeader>
      <CardContent>
        <ScrollArea className="h-[var(--log-height)]" style={{"--log-height": maxHeight} as React.CSSProperties}>
          <div className="space-y-4">
            {logs.map((log) => (
              <div key={log.projectLogId} className="flex gap-4 pb-4 border-b last:border-b-0">
                <div className="h-10 w-10 rounded-full bg-gray-200 flex items-center justify-center">
                  <span className="text-sm font-semibold">
                    {(log.user?.username || "User").substring(0, 2).toUpperCase()}
                  </span>
                </div>
                <div className="flex-1 space-y-1">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <span className="font-medium">{log.user?.username || "User"}</span>
                      <Badge variant={getBadgeVariant(log.projectLogType)}>
                        {formatLogType(log.projectLogType)}
                      </Badge>
                    </div>
                    <span className="text-xs text-muted-foreground">
                      {new Date(log.dateCreated).toLocaleDateString()}
                    </span>
                  </div>
                  {log.memo && <p className="text-sm">{log.memo}</p>}
                  {log.content && <p className="text-sm mt-1">{log.content}</p>}
                </div>
              </div>
            ))}
          </div>
        </ScrollArea>
      </CardContent>
    </Card>
  );
} 