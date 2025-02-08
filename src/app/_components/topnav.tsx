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
import { SignInButton, SignedIn, SignedOut, UserButton } from "@clerk/nextjs";
import Link from "next/link"
import Image from 'next/image'
import { cn } from "../../lib/utils"


export function TopNav() {

  const instructorLinks: { title: string; href: string; }[] = [
    {
      title: "Manage Course",
      href: "/instructor/manage-courses",
    },
    {
      title: "Project Submissions",
      href: "/instructor/project-submissions",
    },
  ]

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
          <NavigationMenuItem>
            <NavigationMenuTrigger>Instructor Tools</NavigationMenuTrigger>
            <NavigationMenuContent>
              <ul className="grid w-[150px] gap-3 p-2 md:w-[200px] md:grid-cols-1 lg:w-[300px] ">
                {instructorLinks.map((link) => (
                  <ListItem
                    key={link.title}
                    title={link.title}
                    href={link.href}
                  />
                ))}
              </ul>
            </NavigationMenuContent>
          </NavigationMenuItem>
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
              <UserButton />
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
  )
})
ListItem.displayName = "ListItem"