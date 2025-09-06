"use client";

import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { useMobileOS } from "@/hooks/use-mobile-os";
import { useStandalone } from "@/hooks/use-standalone";
import { cn } from "@/lib/utils";
import { CircleCheckIcon, CircleIcon } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";

export function Onboarding() {
  const isStandalone = useStandalone();
  const os = useMobileOS();

  const [accordionValue, setAccordionValue] = useState<"installation" | "auth">(
    "installation"
  );

  useEffect(() => {
    setAccordionValue(isStandalone ? "auth" : "installation");
  }, [isStandalone]);

  return (
    <main
      className={cn(
        "flex flex-col items-center max-w-lg mx-auto gap-4 px-4",
        isStandalone ? "h-screen" : "h-svh"
      )}
      style={{
        paddingTop: "env(safe-area-inset-top)",
        paddingBottom: "env(safe-area-inset-bottom)",
      }}
    >
      <div className="flex flex-col justify-center items-center grow gap-4">
        <div className="flex flex-col gap-8 items-center">
          <Image src="/emma-logo.png" width={85} height={85} alt="Emma Logo" />

          <div className="flex flex-col items-center gap-2">
            <h1 className="tracking-tight text-2xl font-semibold text-center text-balance">
              Welcome to the EBC Intranet
            </h1>

            <p className="text-balance text-center">
              Quick, <em>secure</em> access to boat club resources specific to{" "}
              <span className="underline underline-offset-4">you</span>.
            </p>
          </div>
        </div>

        <Accordion
          type="single"
          collapsible
          className="w-full"
          defaultValue="installation"
          value={accordionValue}
          onValueChange={(value) =>
            setAccordionValue(value as "installation" | "auth")
          }
        >
          <AccordionItem value="installation">
            <AccordionTrigger>
              <div className="flex items-center gap-2">
                {isStandalone ? (
                  <CircleCheckIcon className="text-green-500 size-4" />
                ) : (
                  <CircleIcon className="text-border size-4" />
                )}
                Installation
                {os && (
                  <Badge variant="secondary" className="text-xs">
                    {{ ios: "iOS", android: "Android" }[os]}
                  </Badge>
                )}
              </div>
            </AccordionTrigger>
            <AccordionContent className="flex flex-col gap-4 text-balance">
              {os === "android" ? (
                <ol className="flex flex-col gap-2">
                  <li className="flex items-center gap-2">
                    <p className="text-muted-foreground">1.</p>
                    <p>
                      Tap the <span className="font-semibold">menu</span> button
                      (<span className="font-mono">⋮</span>).
                    </p>
                  </li>
                  <li className="flex items-center gap-2">
                    <p className="text-muted-foreground">2.</p>
                    <p>
                      Select <span className="font-semibold">Install app</span>.
                    </p>
                  </li>
                  <li className="flex items-center gap-2">
                    <p className="text-muted-foreground">3.</p>
                    <p>
                      Tap <span className="font-semibold">Install</span> to
                      confirm.
                    </p>
                  </li>
                </ol>
              ) : (
                <ol className="flex flex-col gap-2">
                  <li className="flex items-center gap-2">
                    <p className="text-muted-foreground">1.</p>
                    <p>
                      Tap <span className="font-semibold">Share</span>.
                    </p>
                  </li>
                  <li className="flex items-center gap-2">
                    <p className="text-muted-foreground">2.</p>
                    <p>
                      Select{" "}
                      <span className="font-semibold">Add to Home Screen</span>.
                    </p>
                  </li>
                  <li className="flex items-center gap-2">
                    <p className="text-muted-foreground">3.</p>
                    <p>
                      Tap <span className="font-semibold">Add</span>.
                    </p>
                  </li>
                </ol>
              )}
            </AccordionContent>
          </AccordionItem>
          <AccordionItem value="auth">
            <AccordionTrigger>
              <div className="flex items-center gap-2">
                <CircleIcon className="text-border size-4" />
                Authentication
              </div>
            </AccordionTrigger>
            <AccordionContent className="flex flex-col gap-4">
              <p className="text-xs text-muted-foreground">
                Use your University of Cambridge email address to sign in. If
                you have issues signing in contact your captains.
              </p>

              <p className="text-xs text-muted-foreground">
                By signing in, you consent to the use of cookies for
                authentication purposes only.
              </p>

              <Button className="rounded-full" asChild>
                <Link href="/sign-in">Sign in</Link>
              </Button>
            </AccordionContent>
          </AccordionItem>
        </Accordion>
      </div>

      <p className="text-xs text-muted-foreground text-center pb-4 px-4">
        Made with ❤️ by{" "}
        <Link
          className="underline underline-offset-4 decoration-border"
          href="https://www.github.com/tahmidazam/"
        >
          Tahmid Azam
        </Link>
      </p>
    </main>
  );
}
