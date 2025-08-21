"use client";

import { Home } from "@/components/home";
import { Onboarding } from "@/components/onboarding";
import { SignedIn, SignedOut } from "@clerk/nextjs";

export default function Page() {
  return (
    <>
      <SignedIn>
        <Home />
      </SignedIn>
      <SignedOut>
        <Onboarding />
      </SignedOut>
    </>
  );
}
