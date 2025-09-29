"use client";

import { Home } from "@/components/home";
import { Onboarding } from "@/components/onboarding";
import { QueryClientProvider } from "@tanstack/react-query";
import { Authenticated, Unauthenticated } from "convex/react";

import { QueryClient } from "@tanstack/react-query";

const queryClient = new QueryClient();

export default function Page() {
  return (
    <>
      <Authenticated>
        <QueryClientProvider client={queryClient}>
          <Home />
        </QueryClientProvider>
      </Authenticated>
      <Unauthenticated>
        <Onboarding />
      </Unauthenticated>
    </>
  );
}
