"use client";

import { CityProvider } from "@/components/providers/CityProvider";
import { ThemeProvider } from "@/components/providers/ThemeProvider";

export function AppProviders({ children }: { children: React.ReactNode }) {
  return (
    <ThemeProvider>
      <CityProvider>{children}</CityProvider>
    </ThemeProvider>
  );
}
