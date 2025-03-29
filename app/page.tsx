"use client";

import { useEffect, useState } from "react";
import { Ship } from "@/types";
import { ShipCard } from "@/components/ship-card";

export default function Home() {
  const [ships, setShips] = useState<Ship[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedVtypes, setSelectedVtypes] = useState<string[]>([]);
  const [showFilter, setShowFilter] = useState(false);

  useEffect(() => {
    fetch("/api/ships")
      .then((res) => res.json())
      .then(({ data }) => {
        setShips(Array.isArray(data) ? data : []);
        setLoading(false);
      })
      .catch((error) => {
        console.error("Error fetching ships:", error);
        setLoading(false);
      });
  }, []);

  const uniqueVtypes = Array.from(new Set(ships.map((s) => s.vessel_type)));
  const filteredShips = ships.filter(
    (ship) => !selectedVtypes.includes(ship.vessel_type)
  );

  const toggleFilter = () => setShowFilter((prev) => !prev);
  const toggleVtype = (value: string) =>
    setSelectedVtypes((prev) =>
      prev.includes(value) ? prev.filter((v) => v !== value) : [...prev, value]
    );

  if (loading) return <p>Loading ships...</p>;

  return (
    <div className="p-4">
      <div className="flex justify-between items-center mb-4">
        <div className="relative inline-block mb-4">
          <button
            className="px-4 py-2 border rounded bg-black text-white"
            onClick={toggleFilter}
          >
            Filter
          </button>

          {showFilter && (
            <div className="absolute bg-black text-white border rounded shadow-md mt-2 p-2 w-64 z-10 max-h-64 overflow-y-auto">
              {uniqueVtypes.map((type) => (
                <label key={type} className="flex items-center gap-2 p-1">
                  <input
                    type="checkbox"
                    checked={!selectedVtypes.includes(type)}
                    onChange={() => toggleVtype(type)}
                  />
                  {type}
                </label>
              ))}
            </div>
          )}
        </div>
        <h1 className="text-xl font-bold mb-4">Ships at Portsmouth Port</h1>
      </div>
      <div className="flex flex-col content-center">
        <ul className="space-y-4">
          {filteredShips.map((ship) => (
            <ShipCard key={ship.mmsi} ship={ship} />
          ))}
        </ul>
      </div>
    </div>
  );
}
