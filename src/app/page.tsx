"use client";

import { Home } from "@/components/home";
import { Onboarding } from "@/components/onboarding";
import { Authenticated, Unauthenticated } from "convex/react";

export default function Page() {
  return (
    <>
      <Authenticated>
        <Home />
      </Authenticated>
      <Unauthenticated>
        <Onboarding />
      </Unauthenticated>
    </>
  );
}
