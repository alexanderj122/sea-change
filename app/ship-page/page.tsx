"use client";

import { useEffect, useState } from "react";

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
      <ul className="space-y-2">
        {filteredShips.map((ship) => (
          <li key={ship.mmsi} className="p-2 border rounded">
            <strong>{ship.name}</strong> - {ship.vessel_type}
          </li>
        ))}
      </ul>
    </div>
  );
}
