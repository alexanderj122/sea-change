import { powerCoefficients, vtypeMap } from "@/types";

export function estimatePower(gt: string | null, vtype: number): number | null {
  const gtNum = parseFloat(gt || "");
  if (isNaN(gtNum)) return null;

  const typeName = vtypeMap[vtype] || "Unknown Vessel Type";
  const coef = powerCoefficients[typeName] ?? 0.26;

  return coef * Math.pow(gtNum, 0.67);
}