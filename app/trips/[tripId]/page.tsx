"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";

type Trip = {
  trip_id: string;
  destination: string;
  start_date: string;
  end_date: string;
  travellers: number;
  budget: number | null;
  preferences: string[];
};

type ItineraryItem = {
  item_id: string;
  trip_id: string;
  day: number;
  place_id: string | null;
  place_name: string;
  notes: string | null;
  status: "planned" | "visited";
};

export default function TripDetailsPage() {
  const params = useParams();
  const tripId = params.tripId as string;

  const [trip, setTrip] = useState<Trip | null>(null);
  const [items, setItems] = useState<ItineraryItem[]>([]);
  const [loading, setLoading] = useState(true);

  const [selectedDay, setSelectedDay] = useState<number | null>(null);
  const [placeName, setPlaceName] = useState("");
  const [notes, setNotes] = useState("");

  useEffect(() => {
    async function fetchTrip() {
      const response = await fetch(`/api/trips/${tripId}`);
      const data = await response.json();

      if (response.ok) {
        setTrip(data.trip);
      }

      setLoading(false);
    }

    fetchTrip();
  }, [tripId]);

  useEffect(() => {
    async function fetchItems() {
      const response = await fetch(`/api/trips/${tripId}/items`);
      const data = await response.json();

      if (response.ok) {
        setItems(data.items);
      }
    }

    fetchItems();
  }, [tripId]);

  async function addItem(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();

    if (selectedDay === null || !placeName.trim()) {
      return;
    }

    const response = await fetch(`/api/trips/${tripId}/items`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        day: selectedDay,
        placeName,
        notes,
      }),
    });

    const data = await response.json();

    if (response.ok) {
      setItems((currentItems) => [...currentItems, data.item]);
      setPlaceName("");
      setNotes("");
      setSelectedDay(null);
    }
  }

  if (loading) {
    return <p className="p-10">Loading trip...</p>;
  }

  if (!trip) {
    return <p className="p-10">Trip not found.</p>;
  }

  const start = new Date(trip.start_date);
  const end = new Date(trip.end_date);

  const numberOfDays =
    Math.ceil((end.getTime() - start.getTime()) / (1000 * 60 * 60 * 24)) + 1;

  return (
    <main className="min-h-screen bg-[#f7f5f0] px-6 py-12 text-[#1f2933]">
      <div className="mx-auto max-w-4xl">
        {/* Trip header */}
        <p className="mb-3 text-sm font-medium uppercase tracking-[0.2em] text-[#6b7280]">
          AI Travel
        </p>

        <h1 className="text-5xl font-semibold tracking-tight">
          {trip.destination}
        </h1>

        <p className="mt-3 text-[#6b7280]">
          {new Date(trip.start_date).toLocaleDateString("en-IN", {
            day: "numeric",
            month: "short",
            year: "numeric",
          })}{" "}
          →{" "}
          {new Date(trip.end_date).toLocaleDateString("en-IN", {
            day: "numeric",
            month: "short",
            year: "numeric",
          })}
        </p>

        {/* Trip information */}
        <div className="mt-8 grid gap-4 md:grid-cols-3">
          <div className="rounded-2xl bg-white p-5 shadow-sm">
            <p className="text-sm text-[#6b7280]">Travellers</p>

            <p className="mt-1 text-xl font-medium">{trip.travellers}</p>
          </div>

          <div className="rounded-2xl bg-white p-5 shadow-sm">
            <p className="text-sm text-[#6b7280]">Budget</p>

            <p className="mt-1 text-xl font-medium">
              {trip.budget
                ? `₹${Number(trip.budget).toLocaleString("en-IN")}`
                : "Not specified"}
            </p>
          </div>

          <div className="rounded-2xl bg-white p-5 shadow-sm">
            <p className="text-sm text-[#6b7280]">Preferences</p>

            <p className="mt-1 text-xl font-medium">
              {trip.preferences.length}
            </p>
          </div>
        </div>

        {/* Preferences */}
        <section className="mt-8 rounded-3xl bg-white p-6 shadow-sm">
          <h2 className="text-xl font-semibold">What you're interested in</h2>

          <div className="mt-4 flex flex-wrap gap-3">
            {trip.preferences.map((preference) => (
              <span
                key={preference}
                className="rounded-full bg-[#f7f5f0] px-4 py-2 text-sm"
              >
                {preference}
              </span>
            ))}
          </div>
        </section>

        {/* Itinerary */}
        <section className="mt-8">
          <div className="mb-6">
            <h2 className="text-2xl font-semibold">Your itinerary</h2>

            <p className="mt-2 text-[#6b7280]">
              Add the places and activities you want to visit. You stay in
              control of your trip.
            </p>
          </div>

          <div className="space-y-5">
            {Array.from({ length: numberOfDays }, (_, index) => index + 1).map(
              (day) => {
                const dayItems = items.filter((item) => item.day === day);

                return (
                  <div key={day} className="rounded-3xl bg-white p-6 shadow-sm">
                    <div className="flex items-center justify-between">
                      <h3 className="text-xl font-semibold">Day {day}</h3>

                      <button
                        onClick={() => setSelectedDay(day)}
                        className="rounded-full bg-[#1f2933] px-4 py-2 text-sm font-medium text-white hover:bg-[#374151]"
                      >
                        + Add place
                      </button>
                    </div>

                    {dayItems.length === 0 ? (
                      <p className="mt-5 text-sm text-[#6b7280]">
                        Nothing planned yet.
                      </p>
                    ) : (
                      <div className="mt-5 space-y-3">
                        {dayItems.map((item) => (
                          <div
                            key={item.item_id}
                            className="rounded-2xl bg-[#f7f5f0] p-4"
                          >
                            <div className="flex items-start justify-between">
                              <div>
                                <h4 className="font-medium">
                                  📍 {item.place_name}
                                </h4>

                                {item.notes && (
                                  <p className="mt-1 text-sm text-[#6b7280]">
                                    {item.notes}
                                  </p>
                                )}
                              </div>

                              <span className="rounded-full bg-white px-3 py-1 text-xs">
                                {item.status}
                              </span>
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                );
              },
            )}
          </div>
        </section>

        {/* Add item form */}
        {selectedDay !== null && (
          <div className="fixed inset-0 flex items-center justify-center bg-black/30 px-6">
            <form
              onSubmit={addItem}
              className="w-full max-w-md rounded-3xl bg-white p-6 shadow-xl"
            >
              <h2 className="text-2xl font-semibold">
                Add to Day {selectedDay}
              </h2>

              <div className="mt-6">
                <label className="mb-2 block text-sm font-medium">
                  Place or activity
                </label>

                <input
                  type="text"
                  value={placeName}
                  onChange={(event) => setPlaceName(event.target.value)}
                  placeholder="e.g. Ubud Monkey Forest"
                  className="w-full rounded-2xl border border-black/10 px-4 py-3 outline-none focus:border-[#1f2933]"
                  required
                />
              </div>

              <div className="mt-5">
                <label className="mb-2 block text-sm font-medium">Notes</label>

                <textarea
                  value={notes}
                  onChange={(event) => setNotes(event.target.value)}
                  placeholder="e.g. Go early in the morning"
                  rows={3}
                  className="w-full resize-none rounded-2xl border border-black/10 px-4 py-3 outline-none focus:border-[#1f2933]"
                />
              </div>

              <div className="mt-6 flex gap-3">
                <button
                  type="button"
                  onClick={() => setSelectedDay(null)}
                  className="flex-1 rounded-2xl border border-black/10 px-4 py-3"
                >
                  Cancel
                </button>

                <button
                  type="submit"
                  className="flex-1 rounded-2xl bg-[#1f2933] px-4 py-3 font-medium text-white"
                >
                  Add
                </button>
              </div>
            </form>
          </div>
        )}
      </div>
    </main>
  );
}
