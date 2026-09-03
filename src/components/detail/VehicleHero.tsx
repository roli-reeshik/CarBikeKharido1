"use client";

import { useState } from "react";

import { ColourPicker } from "@/components/detail/ColourPicker";
import { Vehicle360Viewer } from "@/components/Vehicle360Viewer";
import { imaginMakeName, imaginModelName } from "@/lib/catalogue/copy";
import type { VehicleWithRelations } from "@/lib/catalogue/types";
import type { CarPhoto } from "@/lib/types";

/**
 * Hero of a vehicle page: IMAGIN 360° spin when licensed, OEM photography
 * otherwise, with a colour picker that drives the paint code.
 */
export function VehicleHero({
  vehicle,
  photos,
}: {
  vehicle: VehicleWithRelations;
  photos: CarPhoto[];
}) {
  const [colourId, setColourId] = useState(vehicle.colors[0]?.id);
  const colour =
    vehicle.colors.find((item) => item.id === colourId) ?? vehicle.colors[0];

  return (
    <div className="space-y-4">
      <Vehicle360Viewer
        key={colour?.id ?? "default"}
        make={imaginMakeName(vehicle)}
        model={imaginModelName(vehicle)}
        paintCode={colour?.imaginColorCode ?? colour?.imaginStudioColorCode}
        alt={vehicle.name}
        fallbackPhotos={photos}
      />
      {vehicle.colors.length > 0 ? (
        <ColourPicker
          colours={vehicle.colors.map((item) => ({
            id: item.id,
            name: item.name,
            swatch: [item.hexCode],
          }))}
          value={colourId}
          onChange={setColourId}
        />
      ) : null}
    </div>
  );
}
