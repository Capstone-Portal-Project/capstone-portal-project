import { useState } from "react";
import { Button } from "../../components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "../../components/ui/dialog";

type ViewDetailsProps = {
  project: {
    projectId: number;
    projectTitle: string;
    appDescription: string | null;
    appImage?: string;
    cp_date_created: Date;
    cp_archived: boolean;
    appObjectives: string;
    appOrganization: string;
    appMotivations: string;
    appMinQualifications: string;
    appPrefQualifications: string;
    showcaseDescription?: string;
    showcaseImage?: string;
    showcaseVideo?: string;
    isShowcasePublished?: boolean;
  };
};

export function ViewDetails({ project }: ViewDetailsProps) {
  const [open, setOpen] = useState(false);

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="outline">View Details</Button>
      </DialogTrigger>
      <DialogContent className="w-full max-w-2xl max-h-2xl">
        <DialogHeader>
          <DialogTitle>{project.projectTitle}</DialogTitle>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          {project.appImage && (
            <div className="mb-4">
              <img
                src={project.appImage}
                alt={project.projectTitle}
                className="w-full rounded-lg object-cover h-48"
              />
            </div>
          )}
          <p><strong>Description:</strong> {project.appDescription || "No description available"}</p>
          <p><strong>Objectives:</strong> {project.appObjectives}</p>
          <p><strong>Organization:</strong> {project.appOrganization}</p>
          <p><strong>Motivations:</strong> {project.appMotivations}</p>
          <p><strong>Minimum Qualifications:</strong> {project.appMinQualifications}</p>
          <p><strong>Preferred Qualifications:</strong> {project.appPrefQualifications}</p>
          {project.showcaseDescription && (
            <p><strong>Showcase Description:</strong> {project.showcaseDescription}</p>
          )}
          {project.showcaseImage && (
            <div className="mb-4">
              <img
                src={project.showcaseImage}
                alt="Showcase"
                className="w-full rounded-lg object-cover h-48"
              />
            </div>
          )}
          {project.showcaseVideo && (
            <div className="mb-4">
              <video
                src={project.showcaseVideo}
                controls
                className="w-full rounded-lg"
              />
            </div>
          )}
          {project.isShowcasePublished !== undefined && (
            <p><strong>Showcase Published:</strong> {project.isShowcasePublished ? "Yes" : "No"}</p>
          )}
        </div>
        <DialogFooter>
          <Button variant="secondary" onClick={() => setOpen(false)}>Close</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}