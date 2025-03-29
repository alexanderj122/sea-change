export const vtypeMap: Record<number, string> = {
    0: "Unknown Vessel Type",
    3: "Tug, Pilot",
    4: "High Speed",
    6: "Passenger",
    7: "Cargo",
    8: "Tanker",
    9: "Yachts and Other",
    10: "Fishing",
    11: "Base Stations",
    12: "Air Craft",
    13: "Navigation Aid",
  };

  export const powerCoefficients: Record<string, number> = {
    "Tug, Pilot": 0.35,
    "High Speed": 0.40,
    "Passenger": 0.36,
    "Cargo": 0.26,
    "Tanker": 0.24,
    "Yachts and Other": 0.30,
    "Fishing": 0.28,
    "Unknown Vessel Type": 0.26,
  };
  
export const energyCostsGBPPerKWh: Record<string, number> = {
    Solar: 0.10,       // 10p per kWh
    Wind: 0.08,        // 8p per kWh
    Nuclear: 0.09,     // 9p per kWh
    NaturalGas: 0.18,  // 18p per kWh (typical grid cost when gas sets price)
    GridAverage: 0.18, // fallback for standard UK grid
    MarineFuel: 0.039  // ~3.9p per kWh (from VLSFO calculation)
  };

export const emissionsTaxPerKWh = 0.022; // ~2.2p/kWh tax based on CO2
