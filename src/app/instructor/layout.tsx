// app/instructor/layout.tsx
import Link from "next/link";
import { cn } from "../../lib/utils"; // Optional if using a `cn` utility for classNames
import { ReactNode } from "react";

export default function InstructorLayout({ children }: { children: ReactNode }) {
  const links = [
    { href: "/instructor", label: "Manage Course" },
    { href: "/instructor/projects", label: "Course Projects" },
    { href: "/instructor/project-submissions", label: "Project Submissions" },
    { href: "/instructor/project-assignments", label: "Projects Assignments" },
    { href: "/instructor/add-project", label: "Add Project" },
  ];

  return (
    <div className="flex min-h-screen">
      {/* Sidebar */}
      <aside className="w-64 bg-gray-100 border-r p-4">
        <h2 className="text-lg font-bold mb-6">Course Tools</h2>
        <nav className="space-y-2">
          {links.map(({ href, label }) => (
            <Link
              key={href}
              href={href}
              className="block px-3 py-2 rounded hover:bg-gray-200 text-gray-700 font-medium"
            >
              {label}
            </Link>
          ))}
        </nav>
      </aside>

      {/* Main content */}
      <main className="flex-1 p-6">
        {children}
      </main>
    </div>
  );
}
