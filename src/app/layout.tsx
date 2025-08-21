import ConvexClientProvider from "@/components/convex-client-provider";
import { ClerkProvider } from "@clerk/nextjs";
import { Analytics } from "@vercel/analytics/next";
import { SpeedInsights } from "@vercel/speed-insights/next";
import type { Metadata, Viewport } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "EBC",
  description: "The Emmanuel Boat Club Intranet",
  appleWebApp: {
    capable: true,
    title: "EBC Intranet",
    statusBarStyle: "black-translucent",
  },
};

export const viewport: Viewport = {
  viewportFit: "cover",
  userScalable: false,
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>
        <Analytics />
        <SpeedInsights />
        <ClerkProvider>
          <ConvexClientProvider>{children}</ConvexClientProvider>
        </ClerkProvider>
      </body>
    </html>
  );
}
