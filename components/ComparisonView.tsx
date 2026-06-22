"use client";

import type { ComparisonResult } from "@/lib/api";

interface Props {
  result: ComparisonResult;
}

function PriceCard({
  corridorKey,
  label,
  price,
  range,
  isCheaper,
}: {
  corridorKey: string;
  label: string;
  price: number;
  range: { min: number; max: number };
  isCheaper: boolean;
}) {
  return (
    <div
      className={`flex-1 p-6 rounded-2xl border-2 transition-all ${
        isCheaper
          ? "border-emerald-300 bg-emerald-50"
          : "border-zinc-200 bg-white"
      }`}
    >
      {isCheaper && (
        <span className="inline-block px-2 py-0.5 bg-emerald-100 text-emerald-700 text-xs font-semibold rounded-full mb-3">
          Better Value
        </span>
      )}
      <p className="text-xs text-zinc-500 uppercase tracking-wide font-medium">
        {corridorKey.replace("-", " to ")}
      </p>
      <p className="text-sm text-zinc-600 mt-0.5 mb-3">{label}</p>
      <p className="text-4xl font-bold text-zinc-900">{(price ?? 0).toFixed(2)}</p>
      <p className="text-sm text-zinc-400">Lakhs</p>
      <p className="text-xs text-zinc-400 mt-2">
        {(range?.min ?? 0).toFixed(2)} - {(range?.max ?? 0).toFixed(2)} Lakhs
      </p>
    </div>
  );
}

function FactorRow({
  label,
  val1,
  val2,
}: {
  label: string;
  val1: number;
  val2: number;
}) {
  return (
    <div className="flex items-center text-sm">
      <span className="w-8 text-right font-mono text-xs text-zinc-500">
        {(val1 ?? 0).toFixed(2)}
      </span>
      <div className="flex-1 mx-3 flex items-center gap-1">
        <div className="flex-1 h-1.5 bg-zinc-100 rounded-full overflow-hidden flex justify-end">
          <div
            className="h-full bg-indigo-400 rounded-full"
            style={{ width: `${Math.min((val1 ?? 0) * 50, 100)}%` }}
          />
        </div>
        <span className="text-xs text-zinc-400 w-24 text-center shrink-0">
          {label}
        </span>
        <div className="flex-1 h-1.5 bg-zinc-100 rounded-full overflow-hidden">
          <div
            className="h-full bg-purple-400 rounded-full"
            style={{ width: `${Math.min((val2 ?? 0) * 50, 100)}%` }}
          />
        </div>
      </div>
      <span className="w-8 text-left font-mono text-xs text-zinc-500">
        {(val2 ?? 0).toFixed(2)}
      </span>
    </div>
  );
}

export default function ComparisonView({ result }: Props) {
  const { corridors, comparison } = result;
  const keys = Object.keys(corridors);
  const c1 = corridors[keys[0]];
  const c2 = corridors[keys[1]];

  return (
    <div className="space-y-6 animate-in">
      <div className="flex gap-4">
        <PriceCard
          corridorKey={keys[0]}
          label={c1.corridor}
          price={c1.predictedPrice}
          range={c1.priceRange}
          isCheaper={comparison.cheaperCorridor === keys[0]}
        />
        <PriceCard
          corridorKey={keys[1]}
          label={c2.corridor}
          price={c2.predictedPrice}
          range={c2.priceRange}
          isCheaper={comparison.cheaperCorridor === keys[1]}
        />
      </div>

      <div className="p-5 bg-linear-to-r from-indigo-50 via-white to-purple-50 rounded-2xl border border-zinc-200 text-center">
        <p className="text-sm text-zinc-500">Price Difference</p>
        <p className="text-3xl font-bold text-zinc-900 mt-1">
          {(comparison.priceDifference ?? 0).toFixed(2)}{" "}
          <span className="text-lg font-normal text-zinc-500">Lakhs</span>
        </p>
        <p className="text-sm text-zinc-400 mt-1">
          {comparison.cheaperCorridorName} is{" "}
          <span className="font-semibold text-emerald-600">
            {comparison.percentageDifference}% cheaper
          </span>
        </p>
      </div>

      <div className="space-y-3">
        <div className="flex items-center justify-between text-xs text-zinc-400 font-medium px-1">
          <span className="text-indigo-500">
            {keys[0].replace("-", " ")}
          </span>
          <span>Factor Comparison</span>
          <span className="text-purple-500">
            {keys[1].replace("-", " ")}
          </span>
        </div>
        <div className="p-4 bg-zinc-50 rounded-xl space-y-2">
          <FactorRow
            label="Base /sq.ft"
            val1={(c1.breakdown?.basePricePerSqft ?? 0) / 1000}
            val2={(c2.breakdown?.basePricePerSqft ?? 0) / 1000}
          />
          <FactorRow
            label="Demand"
            val1={c1.breakdown?.demandFactor ?? 0}
            val2={c2.breakdown?.demandFactor ?? 0}
          />
          <FactorRow
            label="Floor"
            val1={c1.breakdown?.floorPremium ?? 0}
            val2={c2.breakdown?.floorPremium ?? 0}
          />
          <FactorRow
            label="Furnishing"
            val1={c1.breakdown?.furnishingMultiplier ?? 0}
            val2={c2.breakdown?.furnishingMultiplier ?? 0}
          />
        </div>
      </div>
    </div>
  );
}
