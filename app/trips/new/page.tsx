"use client";

import { useState } from "react";

export default function NewTripPage() {
  const [destination, setDestination] = useState("");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [travellers, setTravellers] = useState(1);
  const [budget, setBudget] = useState("");
  const [preferences, setPreferences] = useState<string[]>([]);

  const preferenceOptions = [
    "Local food",
    "Vegetarian",
    "Beaches",
    "Culture",
    "Nature",
    "Cafés",
  ];

  function togglePreference(preference: string) {
    setPreferences((currentPreferences) =>
      currentPreferences.includes(preference)
        ? currentPreferences.filter((item) => item !== preference)
        : [...currentPreferences, preference],
    );
  }

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();

    const trip = {
      destination,
      startDate,
      endDate,
      travellers,
      budget,
      preferences,
    };

    const response = await fetch("/api/trips", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(trip),
    });

    const data = await response.json();

    if (response.ok) {
      window.location.href = `/trips/${data.trip.trip_id}`;
    }
  }

  return (
    <main className="min-h-screen bg-[#f7f5f0] px-6 py-12 text-[#1f2933]">
      <div className="mx-auto max-w-3xl">
        <div className="mb-10">
          <p className="mb-3 text-sm font-medium uppercase tracking-[0.2em] text-[#6b7280]">
            AI Travel
          </p>

          <h1 className="text-4xl font-semibold tracking-tight md:text-5xl">
            Create your trip
          </h1>

          <p className="mt-4 max-w-xl text-base leading-7 text-[#6b7280]">
            Tell us the basics of your trip. You stay in control of the
            itinerary, and AI will assist you when you need it.
          </p>
        </div>

        <form
          onSubmit={handleSubmit}
          className="rounded-3xl border border-black/10 bg-white p-6 shadow-sm md:p-8"
        >
          <div className="space-y-7">
            {/* Destination */}
            <div>
              <label
                htmlFor="destination"
                className="mb-2 block text-sm font-medium"
              >
                Where are you going?
              </label>

              <input
                id="destination"
                type="text"
                value={destination}
                onChange={(event) => setDestination(event.target.value)}
                placeholder="e.g. Bali"
                className="w-full rounded-2xl border border-black/10 px-4 py-3 outline-none transition focus:border-[#1f2933]"
                required
              />
            </div>

            {/* Dates */}
            <div className="grid gap-5 md:grid-cols-2">
              <div>
                <label
                  htmlFor="startDate"
                  className="mb-2 block text-sm font-medium"
                >
                  Start date
                </label>

                <input
                  id="startDate"
                  type="date"
                  value={startDate}
                  onChange={(event) => setStartDate(event.target.value)}
                  className="w-full rounded-2xl border border-black/10 px-4 py-3 outline-none transition focus:border-[#1f2933]"
                  required
                />
              </div>

              <div>
                <label
                  htmlFor="endDate"
                  className="mb-2 block text-sm font-medium"
                >
                  End date
                </label>

                <input
                  id="endDate"
                  type="date"
                  value={endDate}
                  onChange={(event) => setEndDate(event.target.value)}
                  className="w-full rounded-2xl border border-black/10 px-4 py-3 outline-none transition focus:border-[#1f2933]"
                  required
                />
              </div>
            </div>

            {/* Travellers */}
            <div>
              <label
                htmlFor="travellers"
                className="mb-2 block text-sm font-medium"
              >
                Travellers
              </label>

              <input
                id="travellers"
                type="number"
                min="1"
                value={travellers}
                onChange={(event) => setTravellers(Number(event.target.value))}
                className="w-full rounded-2xl border border-black/10 px-4 py-3 outline-none transition focus:border-[#1f2933]"
                required
              />
            </div>

            {/* Budget */}
            <div>
              <label
                htmlFor="budget"
                className="mb-2 block text-sm font-medium"
              >
                Budget <span className="text-[#6b7280]">(optional)</span>
              </label>

              <input
                id="budget"
                type="number"
                min="0"
                value={budget}
                onChange={(event) => setBudget(event.target.value)}
                placeholder="e.g. 50000"
                className="w-full rounded-2xl border border-black/10 px-4 py-3 outline-none transition focus:border-[#1f2933]"
              />
            </div>

            {/* Preferences */}
            <div>
              <p className="mb-3 text-sm font-medium">
                What are you interested in?
              </p>

              <div className="flex flex-wrap gap-3">
                {preferenceOptions.map((preference) => {
                  const selected = preferences.includes(preference);

                  return (
                    <button
                      key={preference}
                      type="button"
                      onClick={() => togglePreference(preference)}
                      className={`rounded-full border px-4 py-2 text-sm transition ${
                        selected
                          ? "border-[#1f2933] bg-[#1f2933] text-white"
                          : "border-black/10 bg-white hover:bg-black/5"
                      }`}
                    >
                      {preference}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Submit */}
            <button
              type="submit"
              className="w-full rounded-2xl bg-[#1f2933] px-6 py-4 font-medium text-white transition hover:bg-[#374151]"
            >
              Create trip
            </button>
          </div>
        </form>
      </div>
    </main>
  );
}
