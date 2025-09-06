"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  InputOTP,
  InputOTPGroup,
  InputOTPSlot,
} from "@/components/ui/input-otp";
import { useAuthActions } from "@convex-dev/auth/react";
import { useConvex } from "convex/react";
import { useState } from "react";
import { api } from "../../../convex/_generated/api";
import { useRouter } from "next/navigation";

export default function SignIn() {
  const convex = useConvex();
  const router = useRouter();
  const { signIn } = useAuthActions();
  const [error, setError] = useState<string | null>(null);
  const [step, setStep] = useState<"signIn" | { email: string }>("signIn");
  return step === "signIn" ? (
    <div className="max-w-md mx-auto flex min-h-screen flex-col justify-center">
      <form
        className="flex flex-col gap-8 p-4"
        onSubmit={async (event) => {
          event.preventDefault();
          const formData = new FormData(event.currentTarget);

          const existingUser = await convex.query(api.user.getByEmail, {
            email: formData.get("email") as string,
          });

          if (!existingUser) {
            setError("No user found with that email");
            return;
          }

          try {
            await signIn("resend-otp", {
              email: formData.get("email") as string,
            });
            setStep({ email: formData.get("email") as string });
            setError(null);
          } catch (e) {
            setError((e as Error).message);
          }
        }}
      >
        <div className="flex flex-col gap-1">
          <h2 className="font-semibold text-center">Sign in to EBC Intranet</h2>
          <p className="text-sm text-muted-foreground text-center text-balance">
            Welcome back! Please sign in to continue
          </p>
        </div>

        <Input
          placeholder="CRSid@cam.ac.uk"
          autoComplete="email"
          autoFocus
          name="email"
          type="text"
          className="rounded-full"
        />

        {error && (
          <p className="text-sm text-red-500 text-center text-balance line-clamp-2">
            {error}
          </p>
        )}

        <Button className="rounded-full" type="submit">
          Continue
        </Button>
      </form>
    </div>
  ) : (
    <div className="max-w-md mx-auto flex min-h-screen flex-col justify-center">
      <form
        className="flex flex-col gap-8 p-4"
        onSubmit={async (event) => {
          event.preventDefault();
          const formData = new FormData(event.currentTarget);

          try {
            await signIn("resend-otp", {
              email: formData.get("email") as string,
              code: formData.get("code") as string,
            });
            router.push("/");
          } catch (e) {
            setError((e as Error).message);
          }
        }}
      >
        <div className="flex flex-col gap-1">
          <h2 className="font-semibold text-center">Check your email</h2>
          <p className="text-sm text-muted-foreground text-center text-balance">
            to continue to EBC Intranet
          </p>
          <p className="text-sm text-muted-foreground text-center text-balance">
            {step.email}
          </p>
        </div>

        <div className="mx-auto">
          <InputOTP maxLength={6} name="code" type="text" autoFocus>
            <InputOTPGroup>
              <InputOTPSlot index={0} />
              <InputOTPSlot index={1} />
              <InputOTPSlot index={2} />
              <InputOTPSlot index={3} />
              <InputOTPSlot index={4} />
              <InputOTPSlot index={5} />
            </InputOTPGroup>
          </InputOTP>
        </div>

        <input name="email" value={step.email} type="hidden" />

        {error && (
          <p className="text-sm text-red-500 text-center text-balance line-clamp-2">
            {error}
          </p>
        )}

        <div className="grid grid-cols-2 gap-4 w-full">
          <Button
            className="rounded-full"
            variant="outline"
            onClick={() => setStep("signIn")}
          >
            Cancel
          </Button>

          <Button className="rounded-full" type="submit">
            Continue
          </Button>
        </div>
      </form>
    </div>
  );
}
