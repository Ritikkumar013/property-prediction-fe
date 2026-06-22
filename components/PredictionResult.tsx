"use client";

import type { PredictionResult as PredictionResultType } from "@/lib/api";

interface Props {
  result: PredictionResultType;
}

function BreakdownBar({
  label,
  value,
  base,
}: {
  label: string;
  value: number;
  base: number;
}) {
  const pct = Math.min(((value - base) / base) * 100, 100);
  const isPositive = value >= base;

  return (
    <div className="flex items-center gap-3 text-sm">
      <span className="w-36 text-zinc-500 shrink-0">{label}</span>
      <div className="flex-1 h-2 bg-zinc-100 rounded-full overflow-hidden">
        <div
          className={`h-full rounded-full transition-all ${isPositive ? "bg-emerald-400" : "bg-red-400"}`}
          style={{ width: `${Math.max(Math.abs(pct) * 5, 4)}%` }}
        />
      </div>
      <span
        className={`w-14 text-right font-mono text-xs ${isPositive ? "text-emerald-600" : "text-red-500"}`}
      >
        {value >= base ? "+" : ""}
        {((value - base) * 100).toFixed(0)}%
      </span>
    </div>
  );
}

export default function PredictionResult({ result }: Props) {
  const { predictedPrice, priceRange, corridor, breakdown } = result;

  return (
    <div className="space-y-6 animate-in">
      <div className="text-center p-8 bg-linear-to-br from-indigo-50 to-purple-50 rounded-2xl border border-indigo-100">
        <p className="text-sm text-indigo-600 font-medium mb-1">{corridor}</p>
        <p className="text-5xl font-bold text-zinc-900 tracking-tight">
          {(predictedPrice ?? 0).toFixed(2)}
        </p>
        <p className="text-lg text-zinc-500 mt-1">Lakhs</p>
        <p className="text-sm text-zinc-400 mt-3">
          Range: {(priceRange?.min ?? 0).toFixed(2)} - {(priceRange?.max ?? 0).toFixed(2)} Lakhs
        </p>
      </div>

      <div className="space-y-3">
        <h3 className="text-sm font-semibold text-zinc-700">Price Breakdown</h3>
        <div className="p-4 bg-zinc-50 rounded-xl space-y-2.5">
          <div className="flex items-center justify-between text-sm pb-2 border-b border-zinc-200">
            <span className="text-zinc-500">Base Price</span>
            <span className="font-mono font-medium text-zinc-700">
              {(breakdown?.basePricePerSqft ?? 0).toLocaleString()} /sq.ft x{" "}
              {(breakdown?.sqft ?? 0).toLocaleString()} sq.ft
            </span>
          </div>
          <BreakdownBar
            label="BHK Factor"
            value={breakdown?.bhkMultiplier ?? 1}
            base={1}
          />
          <BreakdownBar
            label="Floor Premium"
            value={breakdown?.floorPremium ?? 1}
            base={1}
          />
          <BreakdownBar
            label="Age Factor"
            value={breakdown?.ageFactor ?? 1}
            base={1}
          />
          <BreakdownBar
            label="Bathroom Factor"
            value={breakdown?.bathroomFactor ?? 1}
            base={1}
          />
          <BreakdownBar
            label="Furnishing"
            value={breakdown?.furnishingMultiplier ?? 1}
            base={1}
          />
          <BreakdownBar
            label="Parking Bonus"
            value={breakdown?.parkingBonus ?? 1}
            base={1}
          />
          <BreakdownBar
            label="Amenities"
            value={breakdown?.amenityBonus ?? 1}
            base={1}
          />
          <BreakdownBar
            label="Demand Factor"
            value={breakdown?.demandFactor ?? 1}
            base={1}
          />
        </div>
      </div>
    </div>
  );
}
