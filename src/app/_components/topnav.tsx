"use client";

import * as React from "react"
import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
  navigationMenuTriggerStyle,
} from "../../components/ui/navigation-menu"
import { Button } from "../../components/ui/button"
import { SignInButton, SignedIn, SignedOut, UserButton, useAuth } from "@clerk/nextjs";
import Link from "next/link"
import Image from 'next/image'
import { cn } from "../../lib/utils"

export function TopNav() {
  const { orgRole } = useAuth();

  const isAdmin = orgRole === "org:admin";
  const isInstructor = orgRole === "org:instructor" || isAdmin;

  const adminLinks: { title: string; href: string; }[] = [
    {
      title: "Program Management",
      href: "/admin",
    },
    {
      title: "Course Project Logs",
      href: "/admin-course/1/project-logs",
    },
    {
      title: "Archived Projects",
      href: "/admin/archived",
    },
    {
      title: "Update Home",
      href: "/admin/update-home",
    },
    {
      title: "Assign Instructors",
      href: "/admin/instructor-assignments",
    }
  ];

  const instructorLinks: { title: string; href: string; }[] = [
    {
      title: "Manage Course",
      href: "/instructor",
    },
    {
      title: "Course Projects",
      href: "/instructor/projects",
    },
    {
      title: "Project Logs",
      href: "/instructor/project-logs",
    },
    {
      title: "Project Submissions",
      href: "/instructor/project-submissions",
    },
    {
      title: "Project Assignments",
      href: "/instructor/project-assignments",
    },
    {
      title: "Add Project",
      href: "/instructor/add-project",
    },
  ];

  return (
    <nav className="flex w-full items-center justify-between p-2 text-primary-foreground bg-gray-800">
      <Link href="/">
        <div className="flex items-center gap-2">
          <Image
            src="/oregonStateLogo.png"
            width={60}
            height={60}
            alt="Oregon State Logo"
          />
          <h2 className="text-2xl font-semibold">Engineering Capstone</h2>
        </div>
      </Link>
      <NavigationMenu>
        <NavigationMenuList>
          {isAdmin && (
            <>
              <NavigationMenuItem>
                <Link href="/organization-switcher" legacyBehavior passHref>
                  <NavigationMenuLink className={navigationMenuTriggerStyle()}>
                    Select Organization
                  </NavigationMenuLink>
                </Link>
              </NavigationMenuItem>
              <NavigationMenuItem>
                <Link href="/admin" passHref>
                  <NavigationMenuTrigger
                    onPointerDown={(e) => e.stopPropagation()} // prevent dropdown toggle override
                    onClick={(e) => {
                      // When clicked, it will navigate via the <Link>, and NOT toggle the menu
                      // If you want it to ALSO open the dropdown on click, remove this
                    }}
                  >
                    Admin Tools
                  </NavigationMenuTrigger>
                </Link>
                <NavigationMenuContent>
                  <ul className="grid w-[150px] gap-3 p-2 md:w-[200px] md:grid-cols-1 lg:w-[300px]">
                    {adminLinks.map((link) => (
                      <ListItem key={link.title} title={link.title} href={link.href} />
                    ))}
                  </ul>
                </NavigationMenuContent>
              </NavigationMenuItem>
            </>
          )}

          {isInstructor && (
            <NavigationMenuItem>
              <Link href="/instructor" passHref>
                <NavigationMenuTrigger
                  onPointerDown={(e) => e.stopPropagation()} // prevent dropdown toggle override
                >
                  Instructor Tools
                </NavigationMenuTrigger>
              </Link>
              <NavigationMenuContent>
                <ul className="grid w-[150px] gap-3 p-2 md:w-[200px] md:grid-cols-1 lg:w-[300px]">
                  {instructorLinks.map((link) => (
                    <ListItem key={link.title} title={link.title} href={link.href} />
                  ))}
                </ul>
              </NavigationMenuContent>
            </NavigationMenuItem>
          )}

          <NavigationMenuItem>
            <Link href="/browse" legacyBehavior passHref>
              <NavigationMenuLink className={navigationMenuTriggerStyle()}>
                Browse Current Projects
              </NavigationMenuLink>
            </Link>
          </NavigationMenuItem>

          <NavigationMenuItem>
            <Link href="/showcase" legacyBehavior passHref>
              <NavigationMenuLink className={navigationMenuTriggerStyle()}>
                Showcase
              </NavigationMenuLink>
            </Link>
          </NavigationMenuItem>

          <NavigationMenuItem>
            <Link href="/submit" legacyBehavior passHref>
              <NavigationMenuLink className={navigationMenuTriggerStyle()}>
                Submit a Project
              </NavigationMenuLink>
            </Link>
          </NavigationMenuItem>

          <NavigationMenuItem>
            <SignedOut>
              <SignInButton>
                <Button className="rounded-md bg-gray-800 px-4 py-2 text-md font-light transition-colors hover:bg-gray-700 hover:text-accent-background focus:bg-accent focus:text-accent-foreground">
                  Sign In
                </Button>
              </SignInButton>
            </SignedOut>
            <SignedIn>
              <UserButton 
                afterSignOutUrl="/"
              />
            </SignedIn>
          </NavigationMenuItem>
        </NavigationMenuList>
      </NavigationMenu>
    </nav>
  );
}

const ListItem = React.forwardRef<
  React.ElementRef<"a">,
  React.ComponentPropsWithoutRef<"a">
>(({ className, title, children, ...props }, ref) => {
  return (
    <li>
      <NavigationMenuLink asChild>
        <a
          ref={ref}
          className={cn(
            "block select-none space-y-1 rounded-md p-3 leading-none no-underline outline-none transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground",
            className
          )}
          {...props}
        >
          <div className="text-sm font-medium leading-none">{title}</div>
          <p className="line-clamp-2 text-sm leading-snug text-muted-foreground">
            {children}
          </p>
        </a>
      </NavigationMenuLink>
    </li>
  );
});
ListItem.displayName = "ListItem";
