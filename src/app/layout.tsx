import "~/styles/globals.css";
import "@uploadthing/react/styles.css";

import { ClerkProvider } from "@clerk/nextjs";
import { type Metadata } from "next";
import { TopNav } from "./_components/topnav";
import { Inter } from "next/font/google";
import { Provider } from "./providers";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Capstone Project Portal",
  description: "Created by the 2024/2025 capstone team.",
  icons: [{ rel: "icon", url: "/favicon.ico" }],
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <ClerkProvider afterSignOutUrl={"/"}>
      <html lang="en">
        <head>
          <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        </head>
        <body className={inter.className}>
          <TopNav />
          <Provider>{children}</Provider>
        </body>
      </html>
    </ClerkProvider>
  );
}