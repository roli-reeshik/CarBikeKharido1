import type { ReactNode } from "react";

/**
 * 70 / 30 vehicle details shell used on every car and bike page.
 */
export function VehicleDetailsLayout({
  main,
  sidebar,
}: {
  main: ReactNode;
  sidebar: ReactNode;
}) {
  return (
    <div className="mx-auto grid w-full max-w-7xl gap-8 px-4 py-8 sm:px-6 lg:grid-cols-[minmax(0,7fr)_minmax(280px,3fr)] lg:px-8 lg:py-10">
      <div className="min-w-0 space-y-10">{main}</div>
      <div className="min-w-0">{sidebar}</div>
    </div>
  );
}
