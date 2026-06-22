"use client";

import { useState } from "react";
import type { PredictionInput } from "@/lib/api";

const CORRIDORS = [
  { key: "dehu-solapur", name: "Dehu Road to Solapur Road" },
  { key: "kolhapur-nashik", name: "Kolhapur Road to Nashik Road" },
];

const AMENITY_OPTIONS = [
  { key: "gym", label: "Gym" },
  { key: "swimming_pool", label: "Swimming Pool" },
  { key: "clubhouse", label: "Clubhouse" },
  { key: "garden", label: "Garden" },
  { key: "playground", label: "Playground" },
  { key: "security", label: "24/7 Security" },
  { key: "power_backup", label: "Power Backup" },
  { key: "lift", label: "Lift" },
  { key: "parking", label: "Covered Parking" },
  { key: "cctv", label: "CCTV" },
];

interface Props {
  onPredict: (input: PredictionInput) => void;
  onCompare: (input: Omit<PredictionInput, "corridor">) => void;
  loading: boolean;
  mode: "predict" | "compare";
}

export default function PredictionForm({
  onPredict,
  onCompare,
  loading,
  mode,
}: Props) {
  const [corridor, setCorridor] = useState("dehu-solapur");
  const [bhk, setBhk] = useState(2);
  const [sqft, setSqft] = useState(850);
  const [bathrooms, setBathrooms] = useState(2);
  const [floor, setFloor] = useState(5);
  const [totalFloors, setTotalFloors] = useState(10);
  const [propertyAge, setPropertyAge] = useState(0);
  const [furnishing, setFurnishing] = useState("unfurnished");
  const [parking, setParking] = useState(0);
  const [amenities, setAmenities] = useState<string[]>([]);

  const toggleAmenity = (key: string) => {
    setAmenities((prev) =>
      prev.includes(key) ? prev.filter((a) => a !== key) : [...prev, key]
    );
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const input = {
      corridor,
      bhk,
      sqft,
      bathrooms,
      floor,
      totalFloors,
      propertyAge,
      furnishing,
      parking,
      amenities,
    };

    if (mode === "compare") {
      const { corridor: _, ...rest } = input;
      onCompare(rest);
    } else {
      onPredict(input);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {mode === "predict" && (
        <div>
          <label className="block text-sm font-semibold text-zinc-700 mb-2">
            Select Corridor
          </label>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {CORRIDORS.map((c) => (
              <button
                key={c.key}
                type="button"
                onClick={() => setCorridor(c.key)}
                className={`p-4 rounded-xl border-2 text-left transition-all ${
                  corridor === c.key
                    ? "border-indigo-500 bg-indigo-50 shadow-sm"
                    : "border-zinc-200 hover:border-zinc-300 bg-white"
                }`}
              >
                <span
                  className={`text-sm font-medium ${corridor === c.key ? "text-indigo-700" : "text-zinc-700"}`}
                >
                  {c.name}
                </span>
              </button>
            ))}
          </div>
        </div>
      )}

      <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
        <div>
          <label className="block text-sm font-semibold text-zinc-700 mb-1">
            BHK
          </label>
          <div className="flex gap-1">
            {[1, 2, 3, 4, 5].map((n) => (
              <button
                key={n}
                type="button"
                onClick={() => setBhk(n)}
                className={`flex-1 py-2 rounded-lg text-sm font-medium transition-all ${
                  bhk === n
                    ? "bg-indigo-500 text-white shadow-sm"
                    : "bg-zinc-100 text-zinc-600 hover:bg-zinc-200"
                }`}
              >
                {n}
              </button>
            ))}
          </div>
        </div>

        <div>
          <label className="block text-sm font-semibold text-zinc-700 mb-1">
            Area (sq.ft)
          </label>
          <input
            type="number"
            value={sqft}
            onChange={(e) => setSqft(Number(e.target.value))}
            min={200}
            max={10000}
            className="w-full px-3 py-2 rounded-lg border border-zinc-300 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none text-sm"
          />
        </div>

        <div>
          <label className="block text-sm font-semibold text-zinc-700 mb-1">
            Bathrooms
          </label>
          <div className="flex gap-1">
            {[1, 2, 3, 4, 5].map((n) => (
              <button
                key={n}
                type="button"
                onClick={() => setBathrooms(n)}
                className={`flex-1 py-2 rounded-lg text-sm font-medium transition-all ${
                  bathrooms === n
                    ? "bg-indigo-500 text-white shadow-sm"
                    : "bg-zinc-100 text-zinc-600 hover:bg-zinc-200"
                }`}
              >
                {n}
              </button>
            ))}
          </div>
        </div>

        <div>
          <label className="block text-sm font-semibold text-zinc-700 mb-1">
            Floor
          </label>
          <input
            type="number"
            value={floor}
            onChange={(e) => setFloor(Number(e.target.value))}
            min={0}
            max={50}
            className="w-full px-3 py-2 rounded-lg border border-zinc-300 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none text-sm"
          />
        </div>

        <div>
          <label className="block text-sm font-semibold text-zinc-700 mb-1">
            Total Floors
          </label>
          <input
            type="number"
            value={totalFloors}
            onChange={(e) => setTotalFloors(Number(e.target.value))}
            min={1}
            max={50}
            className="w-full px-3 py-2 rounded-lg border border-zinc-300 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none text-sm"
          />
        </div>

        <div>
          <label className="block text-sm font-semibold text-zinc-700 mb-1">
            Property Age (yrs)
          </label>
          <input
            type="number"
            value={propertyAge}
            onChange={(e) => setPropertyAge(Number(e.target.value))}
            min={0}
            max={50}
            className="w-full px-3 py-2 rounded-lg border border-zinc-300 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none text-sm"
          />
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-semibold text-zinc-700 mb-1">
            Furnishing
          </label>
          <select
            value={furnishing}
            onChange={(e) => setFurnishing(e.target.value)}
            className="w-full px-3 py-2 rounded-lg border border-zinc-300 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none text-sm bg-white"
          >
            <option value="unfurnished">Unfurnished</option>
            <option value="semi-furnished">Semi-Furnished</option>
            <option value="furnished">Fully Furnished</option>
          </select>
        </div>

        <div>
          <label className="block text-sm font-semibold text-zinc-700 mb-1">
            Parking Spots
          </label>
          <div className="flex gap-1">
            {[0, 1, 2, 3].map((n) => (
              <button
                key={n}
                type="button"
                onClick={() => setParking(n)}
                className={`flex-1 py-2 rounded-lg text-sm font-medium transition-all ${
                  parking === n
                    ? "bg-indigo-500 text-white shadow-sm"
                    : "bg-zinc-100 text-zinc-600 hover:bg-zinc-200"
                }`}
              >
                {n}
              </button>
            ))}
          </div>
        </div>
      </div>

      <div>
        <label className="block text-sm font-semibold text-zinc-700 mb-2">
          Amenities
        </label>
        <div className="flex flex-wrap gap-2">
          {AMENITY_OPTIONS.map((a) => (
            <button
              key={a.key}
              type="button"
              onClick={() => toggleAmenity(a.key)}
              className={`px-3 py-1.5 rounded-full text-xs font-medium transition-all ${
                amenities.includes(a.key)
                  ? "bg-indigo-100 text-indigo-700 ring-1 ring-indigo-300"
                  : "bg-zinc-100 text-zinc-600 hover:bg-zinc-200"
              }`}
            >
              {a.label}
            </button>
          ))}
        </div>
      </div>

      <button
        type="submit"
        disabled={loading}
        className="w-full py-3 px-6 rounded-xl bg-indigo-600 text-white font-semibold text-sm hover:bg-indigo-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed shadow-lg shadow-indigo-200"
      >
        {loading
          ? "Calculating..."
          : mode === "compare"
            ? "Compare Both Corridors"
            : "Predict Price"}
      </button>
    </form>
  );
}
