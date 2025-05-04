"use client";

import Link from "next/link";
import { cn } from "../../lib/utils"; // Optional if using a `cn` utility for classNames
import { ReactNode } from "react";
import { usePathname } from "next/navigation";


export default function AdminLayout({ children }: { children: ReactNode }) {
  const pathname = usePathname();

  const links = [
    { href: "/admin/accounts", label: "Account Management" },
    { href: "/admin", label: "Program Management" },
    { href: "/admin/instructor-assignments", label: "Instructor Assignments" },
    { href: "/admin/archived", label: "Archived Projects" },
    { href: "/admin/update-home", label: "Update Home" },
  ];

  return (
    <div className="flex min-h-screen">
      {/* Sidebar */}
      <aside className="w-64 bg-gray-100 border-r p-4">
        <h2 className="text-lg font-bold mb-6">Admin Tools</h2>
        <nav className="space-y-2">
          {links.map(({ href, label }) => {
            const isActive = pathname === href;

            return (
              <Link
                key={href}
                href={href}
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
      <main className="flex-1 p-6">
        {children}
      </main>
    </div>
  );
}
