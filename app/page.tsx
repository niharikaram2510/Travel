export default function Home() {
  return (
    <main className="min-h-screen bg-[#f7f5f0] text-[#1f2933]">
      {/* Navigation */}
      <nav className="flex items-center justify-between px-8 py-6">
        <div className="text-xl font-semibold tracking-tight">
          AI Travel
        </div>

        <div className="flex items-center gap-4">
          <button className="rounded-full px-5 py-2 text-sm font-medium hover:bg-black/5">
            Log in
          </button>

          <button className="rounded-full bg-[#1f2933] px-5 py-2 text-sm font-medium text-white hover:bg-[#374151]">
            Sign up
          </button>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="flex min-h-[80vh] flex-col items-center justify-center px-6 text-center">
        <p className="mb-6 text-sm font-medium uppercase tracking-[0.25em] text-[#6b7280]">
          AI-powered travel assistance
        </p>

        <h1 className="max-w-4xl text-5xl font-semibold leading-tight tracking-tight md:text-7xl">
          Your trip.
          <br />
          Your choices.
        </h1>

        <p className="mt-6 max-w-2xl text-lg leading-8 text-[#6b7280]">
          Plan your journey your way and use AI whenever you need
          local knowledge, discovery, translation, and travel assistance.
        </p>

        <button className="mt-10 rounded-full bg-[#1f2933] px-8 py-4 text-base font-medium text-white transition hover:-translate-y-0.5 hover:bg-[#374151]">
          Start planning
        </button>

        <div className="mt-16 flex gap-8 text-sm text-[#6b7280]">
          <span>Discover</span>
          <span>Translate</span>
          <span>Explore</span>
        </div>
      </section>
    </main>
  );
}