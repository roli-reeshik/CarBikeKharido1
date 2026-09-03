"use client";

import { useState } from "react";

import { GuidedMatcherModal } from "@/components/GuidedMatcherModal";
import { HeroBanner } from "@/components/HeroBanner";
import { HeroShowcase } from "@/components/HeroShowcase";
import { requestCatalogLens } from "@/lib/catalogFocus";
import type { VehicleWithRelations } from "@/lib/catalogue/types";

function scrollToId(id: string) {
  document.getElementById(id)?.scrollIntoView({ behavior: "smooth", block: "start" });
}

export function HeroSearch({ vehicles }: { vehicles: VehicleWithRelations[] }) {
  const [matcherOpen, setMatcherOpen] = useState(false);

  const showCatalog = (lens: "cars" | "bikes") => {
    requestCatalogLens(lens);
    scrollToId("trending");
  };

  return (
    <section id="top" className="relative isolate">
      <h1 className="sr-only">
        Find your perfect car or dream bike on CarBikeKharido.com
      </h1>

      <HeroBanner
        onAdvancedSearch={() => setMatcherOpen(true)}
        onSearch={({ segment }) => {
          showCatalog(segment === "bikes" ? "bikes" : "cars");
        }}
      />

      <HeroShowcase
        onSelect={(kind) => showCatalog(kind === "CAR" ? "cars" : "bikes")}
      />

      <GuidedMatcherModal
        open={matcherOpen}
        onClose={() => setMatcherOpen(false)}
        vehicles={vehicles}
      />
    </section>
  );
}
