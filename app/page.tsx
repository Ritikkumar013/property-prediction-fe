"use client";

import { useState } from "react";
import PredictionForm from "@/components/PredictionForm";
import PredictionResult from "@/components/PredictionResult";
import ComparisonView from "@/components/ComparisonView";
import CorridorStats from "@/components/CorridorStats";
import {
  predictPrice,
  compareCorridors,
  type PredictionInput,
  type PredictionResult as PredictionResultType,
  type ComparisonResult,
} from "@/lib/api";

type Tab = "predict" | "compare" | "explore";

export default function Home() {
  const [tab, setTab] = useState<Tab>("predict");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [prediction, setPrediction] = useState<PredictionResultType | null>(null);
  const [comparison, setComparison] = useState<ComparisonResult | null>(null);

  const handlePredict = async (input: PredictionInput) => {
    setLoading(true);
    setError(null);
    try {
      const result = await predictPrice(input);
      setPrediction(result);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Prediction failed");
    } finally {
      setLoading(false);
    }
  };

  const handleCompare = async (input: Omit<PredictionInput, "corridor">) => {
    setLoading(true);
    setError(null);
    try {
      const result = await compareCorridors(input);
      setComparison(result);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Comparison failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-linear-to-br from-slate-50 via-white to-indigo-50">
      <header className="border-b border-zinc-200 bg-white/80 backdrop-blur-sm sticky top-0 z-10">
        <div className="max-w-5xl mx-auto px-4 py-4 flex items-center justify-between">
          <div>
            <h1 className="text-xl font-bold text-zinc-900 tracking-tight">
              Pune Property Predictor
            </h1>
            <p className="text-xs text-zinc-400 mt-0.5">
              AI-powered price estimates for Pune corridors
            </p>
          </div>
          <span className="text-xs px-2 py-1 bg-indigo-50 text-indigo-600 rounded-full font-medium">
            v1.0
          </span>
        </div>
      </header>

      <main className="max-w-5xl mx-auto px-4 py-8">
        <div className="flex gap-1 p-1 bg-zinc-100 rounded-xl mb-8 max-w-md">
          {(
            [
              { key: "predict", label: "Predict Price" },
              { key: "compare", label: "Compare Corridors" },
              { key: "explore", label: "Explore" },
            ] as const
          ).map((t) => (
            <button
              key={t.key}
              onClick={() => {
                setTab(t.key);
                setError(null);
              }}
              className={`flex-1 py-2 px-4 rounded-lg text-sm font-medium transition-all ${
                tab === t.key
                  ? "bg-white text-zinc-900 shadow-sm"
                  : "text-zinc-500 hover:text-zinc-700"
              }`}
            >
              {t.label}
            </button>
          ))}
        </div>

        {error && (
          <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-xl text-sm text-red-600">
            {error}
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {tab === "predict" && (
            <>
              <div className="bg-white rounded-2xl border border-zinc-200 p-6 shadow-sm">
                <h2 className="text-lg font-semibold text-zinc-800 mb-5">
                  Property Details
                </h2>
                <PredictionForm
                  onPredict={handlePredict}
                  onCompare={handleCompare}
                  loading={loading}
                  mode="predict"
                />
              </div>
              <div>
                {prediction ? (
                  <div className="bg-white rounded-2xl border border-zinc-200 p-6 shadow-sm">
                    <h2 className="text-lg font-semibold text-zinc-800 mb-5">
                      Prediction Result
                    </h2>
                    <PredictionResult result={prediction} />
                  </div>
                ) : (
                  <div className="bg-white rounded-2xl border border-zinc-200 p-6 shadow-sm flex flex-col items-center justify-center min-h-100 text-center">
                    <div className="w-16 h-16 bg-indigo-50 rounded-2xl flex items-center justify-center mb-4">
                      <svg
                        className="w-8 h-8 text-indigo-400"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={1.5}
                          d="M2.25 21h19.5m-18-18v18m10.5-18v18m6-13.5V21M6.75 6.75h.75m-.75 3h.75m-.75 3h.75m3-6h.75m-.75 3h.75m-.75 3h.75M6.75 21v-3.375c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125V21M3 3h12m-.75 4.5H21m-3.75 0h.008v.008h-.008V7.5Z"
                        />
                      </svg>
                    </div>
                    <p className="text-zinc-500 text-sm">
                      Fill in property details and click
                      <br />
                      <span className="font-semibold text-indigo-600">
                        Predict Price
                      </span>{" "}
                      to get an estimate
                    </p>
                  </div>
                )}
              </div>
            </>
          )}

          {tab === "compare" && (
            <>
              <div className="bg-white rounded-2xl border border-zinc-200 p-6 shadow-sm">
                <h2 className="text-lg font-semibold text-zinc-800 mb-1">
                  Compare Corridors
                </h2>
                <p className="text-sm text-zinc-400 mb-5">
                  Same property specs, both corridors side-by-side
                </p>
                <PredictionForm
                  onPredict={handlePredict}
                  onCompare={handleCompare}
                  loading={loading}
                  mode="compare"
                />
              </div>
              <div>
                {comparison ? (
                  <div className="bg-white rounded-2xl border border-zinc-200 p-6 shadow-sm">
                    <h2 className="text-lg font-semibold text-zinc-800 mb-5">
                      Comparison Results
                    </h2>
                    <ComparisonView result={comparison} />
                  </div>
                ) : (
                  <div className="bg-white rounded-2xl border border-zinc-200 p-6 shadow-sm flex flex-col items-center justify-center min-h-100 text-center">
                    <div className="w-16 h-16 bg-purple-50 rounded-2xl flex items-center justify-center mb-4">
                      <svg
                        className="w-8 h-8 text-purple-400"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={1.5}
                          d="M7.5 21L3 16.5m0 0L7.5 12M3 16.5h13.5m0-13.5L21 7.5m0 0L16.5 12M21 7.5H7.5"
                        />
                      </svg>
                    </div>
                    <p className="text-zinc-500 text-sm">
                      Enter property specs to compare prices
                      <br />
                      across{" "}
                      <span className="font-semibold text-indigo-600">
                        both corridors
                      </span>
                    </p>
                  </div>
                )}
              </div>
            </>
          )}

          {tab === "explore" && (
            <div className="lg:col-span-2 bg-white rounded-2xl border border-zinc-200 p-6 shadow-sm">
              <h2 className="text-lg font-semibold text-zinc-800 mb-1">
                Corridor Explorer
              </h2>
              <p className="text-sm text-zinc-400 mb-5">
                Locations, price multipliers, and sample estimates
              </p>
              <CorridorStats />
            </div>
          )}
        </div>
      </main>

      <footer className="border-t border-zinc-200 mt-16">
        <div className="max-w-5xl mx-auto px-4 py-6 flex items-center justify-between text-xs text-zinc-400">
          <span>Property Price Predictor - Pune</span>
          {/* <span>Built with Next.js + Express + Prisma</span> */}
        </div>
      </footer>
    </div>
  );
}
