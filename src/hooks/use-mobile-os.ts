import { useEffect, useState } from "react";

export function useMobileOS(): "ios" | "android" | undefined {
  const [os, setOS] = useState<"ios" | "android" | undefined>(undefined);

  useEffect(() => {
    if (typeof navigator === "undefined") return;

    const userAgent = navigator.userAgent.toLowerCase();

    if (/android/.test(userAgent)) {
      setOS("android");
    } else if (/iphone|ipad|ipod/.test(userAgent)) {
      setOS("ios");
    }
  }, []);

  return os;
}
