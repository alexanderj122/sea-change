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

  // Define vtypes you want to exclude
  const excludedVTypes = [3, 6, 9, 10];
  const filteredShips = ships.filter((ship) => !excludedVTypes.includes(ship.vtype));

  if (loading) return <p>Loading ships...</p>;

  return (
    <div className="p-4">
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
