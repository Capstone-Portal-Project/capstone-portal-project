"use client";

import { useState } from "react";
import { createProjectLog } from "~/server/api/routers/projectLog";
import { Button } from "~/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "~/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "~/components/ui/select";
import { Textarea } from "~/components/ui/textarea";
import { useToast } from "~/components/ui/toaster";

export type ProjectLogType = 'submission' | 'deferment' | 'approval' | 'partner_message' | 'instructor_admin_message' | 'course_transfer';

type AddProjectLogProps = {
  projectId: number;
  userId: number;
  onLogAdded?: () => void;
  allowedLogTypes?: ProjectLogType[];
  defaultLogType?: ProjectLogType;
  buttonLabel?: string;
  buttonVariant?: "default" | "destructive" | "outline" | "secondary" | "ghost" | "link";
};

const logTypeNames: Record<ProjectLogType, string> = {
  'submission': 'Project Submission',
  'deferment': 'Project Deferment',
  'approval': 'Project Approval',
  'partner_message': 'Partner Message',
  'instructor_admin_message': 'Instructor Message',
  'course_transfer': 'Course Transfer'
};

export function AddProjectLog({
  projectId,
  userId,
  onLogAdded,
  allowedLogTypes = ['submission', 'deferment', 'approval', 'partner_message', 'instructor_admin_message', 'course_transfer'],
  defaultLogType = 'instructor_admin_message',
  buttonLabel = "Add Log Entry",
  buttonVariant = "default",
}: AddProjectLogProps) {
  const [open, setOpen] = useState(false);
  const [content, setContent] = useState("");
  const [memo, setMemo] = useState("");
  const [logType, setLogType] = useState<ProjectLogType>(defaultLogType);
  const [submitting, setSubmitting] = useState(false);
  const { toast } = useToast();

  const handleSubmit = async () => {
    if (!content && !memo) {
      toast({
        title: "Error",
        description: "Please provide either content or a memo.",
        variant: "destructive",
      });
      return;
    }

    setSubmitting(true);

    try {
      const result = await createProjectLog({
        projectId,
        userId,
        content: content || undefined,
        memo: memo || undefined,
        projectLogType: logType,
      });

      if (result.error) {
        toast({
          title: "Error",
          description: result.message || "Failed to create log entry.",
          variant: "destructive",
        });
      } else {
        toast({
          title: "Success",
          description: "Log entry created successfully.",
        });

        setContent("");
        setMemo("");
        setLogType(defaultLogType);
        setOpen(false);
        
        if (onLogAdded) {
          onLogAdded();
        }
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "An unexpected error occurred.",
        variant: "destructive",
      });
      console.error(error);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant={buttonVariant}>{buttonLabel}</Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Add Project Log Entry</DialogTitle>
          <DialogDescription>
            Create a new log entry for this project. This will be visible to admins and instructors.
          </DialogDescription>
        </DialogHeader>
        <div className="space-y-4 py-4">
          <div className="space-y-2">
            <label htmlFor="logType" className="text-sm font-medium">
              Log Type
            </label>
            <Select
              value={logType}
              onValueChange={(value) => setLogType(value as ProjectLogType)}
            >
              <SelectTrigger id="logType">
                <SelectValue placeholder="Select log type" />
              </SelectTrigger>
              <SelectContent>
                {allowedLogTypes.map((type) => (
                  <SelectItem key={type} value={type}>
                    {logTypeNames[type]}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-2">
            <label htmlFor="content" className="text-sm font-medium">
              Message Content
            </label>
            <Textarea
              id="content"
              placeholder="Enter the message content here..."
              value={content}
              onChange={(e) => setContent(e.target.value)}
              rows={4}
            />
          </div>
          <div className="space-y-2">
            <label htmlFor="memo" className="text-sm font-medium">
              System Memo (Optional)
            </label>
            <Textarea
              id="memo"
              placeholder="Enter a system memo here (optional)..."
              value={memo}
              onChange={(e) => setMemo(e.target.value)}
              rows={2}
            />
            <p className="text-xs text-muted-foreground">
              Memos are typically automated but can be manually added for context.
            </p>
          </div>
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={() => setOpen(false)}>
            Cancel
          </Button>
          <Button
            onClick={handleSubmit}
            disabled={submitting || (!content && !memo)}
          >
            {submitting ? "Creating..." : "Create Log Entry"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
} 