"use client";

import { createContext, useContext, useMemo } from "react";

import {
  defaultCityId,
  getServiceCity,
} from "@/lib/catalogue/seedData";
import type { ServiceCity } from "@/lib/catalogue/types";
import { usePersistentString } from "@/lib/persistentStore";

const STORAGE_KEY = "cbk.city";

interface CityContextValue {
  city: ServiceCity;
  cityId: string;
  setCityId: (id: string) => void;
}

const CityContext = createContext<CityContextValue | null>(null);

/**
 * Holds the selected city for the whole page — the navbar picker, the on-road
 * price widget and the EMI defaults all read from here. Road tax itself is
 * looked up per state by the pricing engine, not stored on the city.
 */
export function CityProvider({ children }: { children: React.ReactNode }) {
  const [cityId, setCityId] = usePersistentString(STORAGE_KEY, defaultCityId);

  const value = useMemo<CityContextValue>(
    () => ({ city: getServiceCity(cityId), cityId, setCityId }),
    [cityId, setCityId],
  );

  return <CityContext.Provider value={value}>{children}</CityContext.Provider>;
}

export function useCity(): CityContextValue {
  const context = useContext(CityContext);
  if (!context) throw new Error("useCity must be used inside a CityProvider");
  return context;
}
