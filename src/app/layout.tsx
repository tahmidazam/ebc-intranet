import ConvexClientProvider from "@/components/convex-client-provider";
import {
  ClerkProvider,
  SignedIn,
  SignedOut,
  SignInButton,
} from "@clerk/nextjs";
import type { Metadata } from "next";
import "./globals.css";
import { Button } from "@/components/ui/button";

export const metadata: Metadata = {
  title: "EBC",
  description: "The Emmanuel Boat Club Intranet",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>
        <ClerkProvider>
          <ConvexClientProvider>
            <SignedIn>{children}</SignedIn>

            <SignedOut>
              <main className="flex flex-col items-center justify-center h-screen max-w-sm mx-auto gap-4">
                <SignInButton>
                  <Button className="rounded-full">Sign in</Button>
                </SignInButton>

                <p className="text-center text-xs text-muted-foreground text-balance">
                  By continuing, you consent to the use of cookies for
                  authentication purposes only.
                </p>
              </main>
            </SignedOut>
          </ConvexClientProvider>
        </ClerkProvider>
      </body>
    </html>
  );
}
