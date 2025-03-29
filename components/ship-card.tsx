import { emissionsTaxPerKWh, energyCostsGBPPerKWh, Ship } from "@/types";
import { estimatePower } from "./estimate-power";

export function ShipCard({ ship }: { ship: Ship }) {
  const estimatedPower = estimatePower(ship.gt, ship.vtype);
  const duration = 1; // in hours

  const emissionsKg =
    estimatedPower != null ? estimatedPower * 0.28 * duration : null;

  const getCost = (rate: number, includeTax = false) =>
    estimatedPower != null
      ? estimatedPower *
        duration *
        (rate + (includeTax ? emissionsTaxPerKWh : 0))
      : null;

  const alternativeSources = Object.entries(energyCostsGBPPerKWh).filter(
    ([source]) => !["GridAverage", "MarineFuel"].includes(source)
  );

  return (
    <li className="p-4 border rounded-2xl shadow flex flex-col gap-2 items-center">
      <strong className="text-lg">{ship.name}</strong> - {ship.vessel_type}
      <br />
      Gross Tonnage: {ship.gt || "N/A"}
      <br />
      Estimated Power:{" "}
      {estimatedPower ? `${estimatedPower.toFixed(0)} kW` : "N/A"}
      {emissionsKg && (
        <div className="text-sm text-red-600 mt-1">
          Estimated CO₂ Emissions (1h): {emissionsKg.toFixed(1)} kg
        </div>
      )}
      <div className="mt-2 text-sm">
        <span className="font-medium">Estimated Cost per 1 hour:</span>
        <ul className="ml-4 list-disc">
          <li>
            Plugged into Grid: £
            {getCost(energyCostsGBPPerKWh["GridAverage"])?.toFixed(2) || "N/A"}
          </li>
          <li>
            Using Engines (incl. Emissions Tax): £
            {getCost(energyCostsGBPPerKWh["MarineFuel"], true)?.toFixed(2) ||
              "N/A"}
          </li>
        </ul>
        {alternativeSources.length > 0 && (
          <div className="mt-2">
            <span className="font-medium">Alternative Power Source Costs:</span>
            <ul className="ml-4 list-disc">
              {alternativeSources.map(([source, rate]) => (
                <li key={source}>
                  {source}: £{getCost(rate)?.toFixed(2) || "N/A"}
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>
    </li>
  );
}
