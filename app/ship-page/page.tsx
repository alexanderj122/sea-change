"use client";

import { useEffect, useState } from "react";
import {
  vtypeMap,
  powerCoefficients,
  energyCostsGBPPerKWh,
  emissionsTaxPerKWh,
} from "@/types";

function estimatePower(gt: string | null, vtype: number): number | null {
  const gtNum = parseFloat(gt || "");
  if (isNaN(gtNum)) return null;

  const typeName = vtypeMap[vtype] || "Unknown Vessel Type";
  const coef = powerCoefficients[typeName] ?? 0.26;

  return coef * Math.pow(gtNum, 0.67);
}

type Ship = {
  mmsi: number;
  imo: string | null;
  name: string;
  arrived: string | null;
  vtype: number;
  vessel_type: string;
  flag: string;
  gt: string | null;
  dwt: string | null;
  built: string | null;
  length: number;
  width: number;
};

export default function PortsmouthShipsPage() {
  const [ships, setShips] = useState<Ship[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedVtypes, setSelectedVtypes] = useState<number[]>([]);
  const [showFilter, setShowFilter] = useState(false);

  useEffect(() => {
    fetch("/api/ships")
      .then((res) => res.json())
      .then((response) => {
        const shipsData = Array.isArray(response.data) ? response.data : [];
        setShips(shipsData);
        setLoading(false);
      })
      .catch((error) => {
        console.error("Error fetching ships:", error);
        setShips([]);
        setLoading(false);
      });
  }, []);

  const uniqueVtypes = Array.from(new Set(ships.map((ship) => ship.vtype)));

  // Define vtypes you want to exclude
  // const excludedVTypes = [3, 6, 9, 10];
  const filteredShips = ships.filter(
    (ship) => !selectedVtypes.includes(ship.vtype)
  );

  if (loading) return <p>Loading ships...</p>;

  const handleCheckboxChange = (value: number) => {
    setSelectedVtypes((prev) => {
      const newSelected = prev.includes(value)
        ? prev.filter((v) => v !== value)
        : [...prev, value];
      return newSelected;
    });
  };

  const handleFilterClick = () => {
    setShowFilter((prev) => !prev);
  };

  return (
    <div className="p-4">
      <div className="relative inline-block">
        <button
          className="px-4 py-2 border rounded bg-black"
          onClick={() => handleFilterClick()}
        >
          Filter
        </button>

        {showFilter && (
          <div className="absolute bg-black border rounded shadow-md mt-2 p-2 w-48">
            {uniqueVtypes.map((type) => (
              <label key={type} className="flex items-center gap-2 p-1">
                <input
                  type="checkbox"
                  checked={!selectedVtypes.includes(type)}
                  onChange={() => handleCheckboxChange(type)}
                />
                Type {type}
              </label>
            ))}
          </div>
        )}
      </div>

      <h1 className="text-xl font-bold mb-4">Ships at Portsmouth Port</h1>
      <ul className="space-y-4">
        {filteredShips.map((ship) => {
          const estimatedPower = estimatePower(ship.gt, ship.vtype); // in kW
          const durationHours = 1;

          const energyCosts = Object.entries(energyCostsGBPPerKWh).map(
            ([source, rate]) => {
              let cost =
                estimatedPower != null
                  ? estimatedPower * durationHours * rate
                  : null;

              if (
                source === "MarineFuel" &&
                cost !== null &&
                estimatedPower !== null
              ) {
                cost += estimatedPower * durationHours * emissionsTaxPerKWh;
              }

              return { source, cost };
            }
          );

          const emissionsKg =
            estimatedPower != null
              ? estimatedPower * 0.28 * durationHours
              : null;

          return (
            <li key={ship.mmsi} className="p-4 border rounded shadow">
              <strong className="text-lg">{ship.name}</strong> -{" "}
              {ship.vessel_type}
              <br />
              Gross Tonnage: {ship.gt || "N/A"}
              <br />
              Estimated Power:{" "}
              {estimatedPower ? `${estimatedPower.toFixed(0)} kW` : "N/A"}
              <br />
              {emissionsKg && (
                <div className="text-sm text-gray-600 mt-1">
                  Estimated CO₂ Emissions (1h): {emissionsKg.toFixed(1)} kg
                </div>
              )}
              <div className="mt-2">
                <span className="font-medium">
                  Estimated Cost per {durationHours} hour:
                </span>
                <ul className="text-sm mt-1 ml-4 list-disc">
                  <li>
                    Plugged into Grid:{" "}
                    {estimatedPower != null
                      ? `£${(
                          estimatedPower *
                          durationHours *
                          energyCostsGBPPerKWh["GridAverage"]
                        ).toFixed(2)}`
                      : "N/A"}
                  </li>
                  <li>
                    Using Engines (incl. Emissions Tax):{" "}
                    {estimatedPower != null
                      ? `£${(
                          estimatedPower *
                          durationHours *
                          (energyCostsGBPPerKWh["MarineFuel"] +
                            emissionsTaxPerKWh)
                        ).toFixed(2)}`
                      : "N/A"}
                  </li>
                </ul>

                <div className="mt-2 text-sm">
                  <span className="font-medium">
                    Alternative Power Source Costs:
                  </span>
                  <ul className="ml-4 list-disc">
                    {Object.entries(energyCostsGBPPerKWh)
                      .filter(
                        ([source]) =>
                          !["GridAverage", "MarineFuel"].includes(source)
                      )
                      .map(([source, rate]) => (
                        <li key={source}>
                          {source}:{" "}
                          {estimatedPower != null
                            ? `£${(
                                estimatedPower *
                                durationHours *
                                rate
                              ).toFixed(2)}`
                            : "N/A"}
                        </li>
                      ))}
                  </ul>
                </div>
              </div>
            </li>
          );
        })}
      </ul>
    </div>
  );
}
