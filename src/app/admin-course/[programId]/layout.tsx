"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { ReactNode } from "react";

export default function InstructorLayout({ children }: { children: ReactNode }) {
  const pathname = usePathname();

  const basePath = pathname.split("/").slice(0, 3).join("/"); // /admin/course/[programId]

  const links = [
    { href: "", label: "Manage Course" },
    { href: "projects", label: "Course Projects" },
    { href: "project-submissions", label: "Project Submissions" },
    { href: "project-assignments", label: "Project Assignments" },
    { href: "add-project", label: "Add Project" },
  ];

  return (
    <div className="flex flex-1">
      {/* Nested Sidebar */}
      <aside className="w-64 bg-gray-50 border-r p-4">
        <h2 className="text-lg font-bold mb-6">Admin Course Tools</h2>
        <nav className="space-y-2">
          {links.map(({ href, label }) => {
            const fullHref = `${basePath}/${href}`;
            const isActive = pathname === fullHref;

            return (
              <Link
                key={label}
                href={fullHref}
                className={`block px-3 py-2 rounded font-medium ${
                  isActive ? "bg-blue-100 text-blue-800" : "text-gray-700 hover:bg-gray-200"
                }`}
              >
                {label}
              </Link>
            );
          })}
        </nav>
      </aside>

      {/* Main content */}
      <main className="flex-1 p-6">{children}</main>
    </div>
  );
}
