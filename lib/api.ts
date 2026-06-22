const API_BASE = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";

export interface PredictionInput {
  corridor: string;
  bhk: number;
  sqft: number;
  bathrooms: number;
  floor: number;
  totalFloors?: number;
  propertyAge?: number;
  furnishing?: string;
  parking?: number;
  amenities?: string[];
}

export interface PriceBreakdown {
  basePricePerSqft: number;
  sqft: number;
  bhkMultiplier: number;
  floorPremium: number;
  ageFactor: number;
  bathroomFactor: number;
  furnishingMultiplier: number;
  parkingBonus: number;
  amenityBonus: number;
  demandFactor: number;
}

export interface PredictionResult {
  id?: number;
  predictedPrice: number;
  priceRange: { min: number; max: number };
  currency: string;
  unit: string;
  corridor: string;
  breakdown: PriceBreakdown;
}

export interface ComparisonResult {
  corridors: Record<string, PredictionResult>;
  comparison: {
    priceDifference: number;
    priceDifferenceUnit: string;
    cheaperCorridor: string;
    cheaperCorridorName: string;
    percentageDifference: number;
  };
}

export interface CorridorInfo {
  key: string;
  name: string;
  basePricePerSqft: number;
  avgPriceRange: { min: number; max: number };
  locationCount: number;
}

export interface CorridorStats {
  corridor: string;
  corridorKey: string;
  basePricePerSqft: number;
  locations: { name: string; multiplier: number }[];
  avgPriceRange: { min: number; max: number };
  demandFactor: number;
  sampleEstimates: { type: string; estimatedPrice: number; unit: string }[];
  historicalData: {
    totalPredictions: number;
    avgPredictedPrice: number | null;
    avgSqft: number | null;
    minPrice: number | null;
    maxPrice: number | null;
  };
}

async function request<T>(path: string, options?: RequestInit): Promise<T> {
  const res = await fetch(`${API_BASE}${path}`, {
    headers: { "Content-Type": "application/json" },
    ...options,
  });
  const json = await res.json();
  if (!json.success) throw new Error(json.message || "Request failed");
  return json.data;
}

export function predictPrice(input: PredictionInput) {
  return request<PredictionResult>("/api/properties/predict", {
    method: "POST",
    body: JSON.stringify(input),
  });
}

export function compareCorridors(input: Omit<PredictionInput, "corridor">) {
  return request<ComparisonResult>("/api/properties/compare", {
    method: "POST",
    body: JSON.stringify(input),
  });
}

export function getCorridors() {
  return request<CorridorInfo[]>("/api/properties/corridors");
}

export function getCorridorStats(corridor: string) {
  return request<CorridorStats>(`/api/properties/corridors/${corridor}`);
}
