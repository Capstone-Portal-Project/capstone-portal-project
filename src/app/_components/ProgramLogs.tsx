"use client";

import { useState, useEffect } from "react";
import { getProgramLogsWithDetails } from "~/server/api/routers/projectLog";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "~/components/ui/card";
import { Badge } from "~/components/ui/badge";
import { ScrollArea } from "~/components/ui/scroll-area";
import Link from "next/link";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "~/components/ui/select";
import { ProjectLogType } from "./AddProjectLog";
import { Separator } from "~/components/ui/separator";

// Type for log entries with project title
type ProgramLogEntry = {
  projectLogId: number;
  projectId: number;
  projectTitle: string;
  dateCreated: Date | string;
  content: string | null;
  memo: string | null;
  userId: number;
  projectLogType: ProjectLogType;
  user?: {
    username: string;
    email: string;
    type: string;
  };
};

// Mapping log types to display names
const logTypeNames: Record<ProjectLogType, string> = {
  submission: "Project Submission",
  deferment: "Project Deferment",
  approval: "Project Approval",
  partner_message: "Partner Message",
  instructor_admin_message: "Instructor Message",
  course_transfer: "Course Transfer",
};

// Helper to get badge color by log type
const getBadgeVariant = (
  type: ProgramLogEntry["projectLogType"],
): "default" | "secondary" | "destructive" | "outline" => {
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

type ProgramLogsProps = {
  programId: number;
  maxHeight?: string;
  limit?: number;
  logTypes?: ProjectLogType[];
};

export function ProgramLogs({
  programId,
  maxHeight = "600px",
  limit,
  logTypes,
}: ProgramLogsProps) {
  const [logs, setLogs] = useState<ProgramLogEntry[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedLogType, setSelectedLogType] = useState<string>("all");

  useEffect(() => {
    const fetchLogs = async () => {
      setLoading(true);
      setError(null);

      try {
        // If logTypes prop is provided, use it directly
        // Otherwise, if a specific log type is selected in the dropdown, filter by it
        const filterLogTypes =
          logTypes ||
          (selectedLogType !== "all"
            ? [selectedLogType as ProjectLogType]
            : undefined);

        const result = await getProgramLogsWithDetails(
          programId,
          limit,
          filterLogTypes,
        );
        if (result.error) {
          setError(result.message || "Failed to fetch logs");
        } else {
          setLogs(result.logs as ProgramLogEntry[]);
        }
      } catch (err) {
        setError("An unexpected error occurred");
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchLogs();
  }, [programId, limit, selectedLogType, logTypes]);

  if (error) {
    return <div className="py-4 text-center text-red-500">Error: {error}</div>;
  }

  return (
    <Card>
      <CardHeader className="pb-0">
        <div className="flex items-center justify-between">
          <div>
            <CardTitle>Program Activity Logs</CardTitle>
            <CardDescription>
              History of actions and messages across all projects
            </CardDescription>
          </div>
          {/* Only show filter if logTypes prop is not provided */}
          {!logTypes && (
            <div className="w-48">
              <Select
                value={selectedLogType}
                onValueChange={setSelectedLogType}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Filter by type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Log Types</SelectItem>
                  {Object.entries(logTypeNames).map(([value, label]) => (
                    <SelectItem key={value} value={value}>
                      {label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          )}
        </div>
        <Separator orientation="horizontal" />
      </CardHeader>
      <CardContent>
        {loading ? (
          <div className="py-4 text-center">Loading logs...</div>
        ) : (
          <ScrollArea
            className="h-[var(--log-height)] pr-6"
            style={{ "--log-height": maxHeight } as React.CSSProperties}
          >
            <div className="space-y-4">
              {logs.length === 0 ? (
                <div className="py-4 text-center text-muted-foreground">
                  No logs available for this program
                </div>
              ) : (
                logs.map((log) => (
                  <div
                    key={log.projectLogId}
                    className="flex gap-4 border-b py-4 last:border-b-0"
                  >
                    <div className="flex h-10 w-10 items-center justify-center rounded-full bg-gray-200">
                      <span className="text-sm font-semibold">
                        {(log.user?.username || "User")
                          .substring(0, 2)
                          .toUpperCase()}
                      </span>
                    </div>
                    <div className="flex-1 space-y-1">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <span className="font-medium">
                            {log.user?.username || "User"}
                          </span>
                          <Badge variant={getBadgeVariant(log.projectLogType)}>
                            {logTypeNames[log.projectLogType]}
                          </Badge>
                        </div>
                        <span className="text-xs text-muted-foreground">
                          {new Date(log.dateCreated).toLocaleDateString()}
                        </span>
                      </div>
                      <div className="flex items-center gap-1 text-sm text-muted-foreground">
                        <span>Project:</span>
                        <Link
                          href={`/project/${log.projectId}`}
                          className="text-blue-600 hover:underline"
                        >
                          {log.projectTitle}
                        </Link>
                      </div>
                      {log.memo && <p className="text-sm">{log.memo}</p>}
                      {log.content && (
                        <p className="mt-1 text-sm">{log.content}</p>
                      )}
                    </div>
                  </div>
                ))
              )}
            </div>
          </ScrollArea>
        )}
      </CardContent>
    </Card>
  );
}
