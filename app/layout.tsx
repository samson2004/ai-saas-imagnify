import type { Metadata } from "next";
import "./globals.css";
import {IBM_Plex_Sans} from 'next/font/google';
import { cn } from "@/lib/utils";
  // SignInButton,
  // SignedIn,
  // SignedOut,
  // UserButton
import {ClerkProvider} from '@clerk/nextjs';



const IBMPlex=IBM_Plex_Sans({
  subsets:['latin'],
  weight:[
    '400','500','600','700'
  ],
  variable:'--font-ibm-plex'
});



export const metadata: Metadata = {
  title: "Imagify",
  description: "AI-powered Gen",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <ClerkProvider>
      <html lang="en">
        <body
          className={cn('font-IBMPlex antialiased',IBMPlex.variable)}
        >
          {children}
        </body>
      </html>
   </ClerkProvider>

  );
}
