"use client";

import {
  NavigationMenu,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  navigationMenuTriggerStyle
} from "../../components/ui/navigation-menu"
import { Button } from "../../components/ui/button"
import { SignInButton, SignedIn, SignedOut, UserButton } from "@clerk/nextjs";
import { useRouter } from "next/navigation";
import Link from "next/link"
import Image from 'next/image'

export function TopNav() {
  const router = useRouter();
  return (
    <nav className="flex w-full items-center justify-between p-2 text-primary-foreground bg-gray-800">
      <div className="flex items-center gap-2">
        <Image
          src="/oregonStateLogo.png"
          width={60}
          height={60}
          alt="Oregon State Logo"
        />
        <h2 className="text-2xl font-semibold">Engineering Capstone</h2>
      </div>
      <NavigationMenu>
        <NavigationMenuList>
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
            <Link href="/projectPartner/projectSubmission" legacyBehavior passHref>
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