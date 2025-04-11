export interface Program {
  programId: number;
  programName: string;
  programDescription: string | null;
  programStatus: "submissions" | "matching" | "active" | "ending" | "archived" | "hidden";
  startTermId: number;
  endTermId: number;
  start_term?: Term;
  end_term?: Term;
  instructors?: User[];
  selected_instructors?: number[];
}

export interface Term {
  id: number;
  season: "winter" | "spring" | "summer" | "fall";
  year: number;
  is_published: boolean;
}

export interface User {
  user_id: number;
  username: string;
  email: string;
  type: "project_partner" | "student" | "instructor" | "admin";
} 