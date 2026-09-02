"use client";

import { createContext, useCallback, useContext, useMemo, useState } from "react";

import type { VehicleWithRelations } from "@/lib/catalogue/types";

interface SelectedVehicleContextValue {
  vehicle: VehicleWithRelations;
  slug: string;
  setSlug: (slug: string) => void;
  /** Selects a vehicle and scrolls the calculators into view. */
  openPriceBreakdown: (slug: string) => void;
}

const SelectedVehicleContext = createContext<SelectedVehicleContextValue | null>(
  null,
);

/**
 * Links vehicle cards to the calculators further down the page. Vehicles are
 * passed in from the server so a live database catalogue and the bundled seed
 * data take the same code path.
 */
export function SelectedVehicleProvider({
  vehicles,
  initialSlug,
  children,
}: {
  vehicles: VehicleWithRelations[];
  initialSlug?: string;
  children: React.ReactNode;
}) {
  const [slug, setSlug] = useState(initialSlug ?? vehicles[0]?.slug ?? "");

  const openPriceBreakdown = useCallback((next: string) => {
    setSlug(next);
    const target =
      document.getElementById("price") ?? document.getElementById("money");
    target?.scrollIntoView({ behavior: "smooth", block: "start" });
  }, []);

  const vehicle =
    vehicles.find((item) => item.slug === slug) ?? vehicles[0] ?? null;

  const value = useMemo<SelectedVehicleContextValue | null>(() => {
    if (!vehicle) return null;
    return { vehicle, slug: vehicle.slug, setSlug, openPriceBreakdown };
  }, [vehicle, setSlug, openPriceBreakdown]);

  if (!value) return children;

  return (
    <SelectedVehicleContext.Provider value={value}>
      {children}
    </SelectedVehicleContext.Provider>
  );
}

export function useSelectedVehicle(): SelectedVehicleContextValue {
  const context = useContext(SelectedVehicleContext);
  if (!context) {
    throw new Error(
      "useSelectedVehicle must be used inside a SelectedVehicleProvider",
    );
  }
  return context;
}
