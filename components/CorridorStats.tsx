"use client";

import { useEffect, useState } from "react";
import { getCorridorStats, type CorridorStats as CorridorStatsType } from "@/lib/api";

export default function CorridorStats() {
  const [selected, setSelected] = useState("dehu-solapur");
  const [stats, setStats] = useState<CorridorStatsType | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    setLoading(true);
    getCorridorStats(selected)
      .then(setStats)
      .catch(() => setStats(null))
      .finally(() => setLoading(false));
  }, [selected]);

  return (
    <div className="space-y-5">
      <div className="flex gap-2">
        {[
          { key: "dehu-solapur", label: "Dehu - Solapur" },
          { key: "kolhapur-nashik", label: "Kolhapur - Nashik" },
        ].map((c) => (
          <button
            key={c.key}
            onClick={() => setSelected(c.key)}
            className={`flex-1 py-2.5 rounded-xl text-sm font-medium transition-all ${
              selected === c.key
                ? "bg-indigo-500 text-white shadow-sm"
                : "bg-zinc-100 text-zinc-600 hover:bg-zinc-200"
            }`}
          >
            {c.label}
          </button>
        ))}
      </div>

      {loading && (
        <div className="flex justify-center py-12">
          <div className="w-6 h-6 border-2 border-indigo-300 border-t-indigo-600 rounded-full animate-spin" />
        </div>
      )}

      {stats && !loading && (
        <div className="space-y-5 animate-in">
          <div className="grid grid-cols-3 gap-3">
            <div className="p-4 bg-indigo-50 rounded-xl text-center">
              <p className="text-2xl font-bold text-indigo-700">
                {(stats.basePricePerSqft ?? 0).toLocaleString()}
              </p>
              <p className="text-xs text-indigo-500 mt-1">Base Price /sq.ft</p>
            </div>
            <div className="p-4 bg-purple-50 rounded-xl text-center">
              <p className="text-2xl font-bold text-purple-700">
                {stats.demandFactor}x
              </p>
              <p className="text-xs text-purple-500 mt-1">Demand Factor</p>
            </div>
            <div className="p-4 bg-emerald-50 rounded-xl text-center">
              <p className="text-2xl font-bold text-emerald-700">
                {stats.locations.length}
              </p>
              <p className="text-xs text-emerald-500 mt-1">Key Locations</p>
            </div>
          </div>

          <div>
            <h3 className="text-sm font-semibold text-zinc-700 mb-3">
              Sample Price Estimates
            </h3>
            <div className="space-y-2">
              {stats.sampleEstimates.map((est) => {
                const maxPrice = stats.sampleEstimates[stats.sampleEstimates.length - 1].estimatedPrice;
                return (
                  <div
                    key={est.type}
                    className="flex items-center gap-3"
                  >
                    <span className="w-36 text-sm text-zinc-500 shrink-0">
                      {est.type}
                    </span>
                    <div className="flex-1 h-8 bg-zinc-100 rounded-lg overflow-hidden">
                      <div
                        className="h-full bg-linear-to-r from-indigo-400 to-indigo-500 rounded-lg flex items-center justify-end pr-2"
                        style={{
                          width: `${(est.estimatedPrice / maxPrice) * 100}%`,
                        }}
                      >
                        <span className="text-xs text-white font-semibold">
                          {(est.estimatedPrice ?? 0).toFixed(1)}L
                        </span>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          <div>
            <h3 className="text-sm font-semibold text-zinc-700 mb-3">
              Location Price Multipliers
            </h3>
            <div className="grid grid-cols-3 gap-2">
              {stats.locations.map((loc) => (
                <div
                  key={loc.name}
                  className={`p-3 rounded-xl text-center border ${
                    loc.multiplier > 1
                      ? "border-emerald-200 bg-emerald-50"
                      : "border-zinc-200 bg-zinc-50"
                  }`}
                >
                  <p className="text-xs font-medium text-zinc-700 truncate">
                    {loc.name}
                  </p>
                  <p
                    className={`text-sm font-bold mt-1 ${
                      loc.multiplier > 1
                        ? "text-emerald-600"
                        : "text-zinc-500"
                    }`}
                  >
                    {loc.multiplier}x
                  </p>
                </div>
              ))}
            </div>
          </div>

          {stats.historicalData.totalPredictions > 0 && (
            <div className="p-4 bg-amber-50 rounded-xl border border-amber-100">
              <h3 className="text-sm font-semibold text-amber-800 mb-2">
                Historical Predictions
              </h3>
              <div className="grid grid-cols-2 gap-3 text-sm">
                <div>
                  <p className="text-amber-600">Total Predictions</p>
                  <p className="font-bold text-amber-800">
                    {stats.historicalData.totalPredictions}
                  </p>
                </div>
                <div>
                  <p className="text-amber-600">Avg Price</p>
                  <p className="font-bold text-amber-800">
                    {stats.historicalData.avgPredictedPrice?.toFixed(2) ?? "N/A"}{" "}
                    L
                  </p>
                </div>
                <div>
                  <p className="text-amber-600">Min Price</p>
                  <p className="font-bold text-amber-800">
                    {stats.historicalData.minPrice?.toFixed(2) ?? "N/A"} L
                  </p>
                </div>
                <div>
                  <p className="text-amber-600">Max Price</p>
                  <p className="font-bold text-amber-800">
                    {stats.historicalData.maxPrice?.toFixed(2) ?? "N/A"} L
                  </p>
                </div>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
