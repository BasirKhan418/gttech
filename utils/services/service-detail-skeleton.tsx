export default function ServiceDetailSkeleton() {
  return (
    <main className="min-h-screen bg-white">
      <div className="mx-auto max-w-6xl px-4 py-6">
        <div className="mb-6 h-4 w-36 animate-pulse rounded bg-gray-200" />
        <div className="h-8 w-3/4 animate-pulse rounded bg-gray-200" />
        <div className="mt-3 h-4 w-1/2 animate-pulse rounded bg-gray-200" />
      </div>

      <section className="mx-auto max-w-6xl px-4">
        <div className="h-[340px] w-full animate-pulse rounded-2xl bg-gray-200 md:h-[420px]" />
      </section>

      <section className="mx-auto max-w-6xl px-4 py-10">
        <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">
          <div className="space-y-8 lg:col-span-2">
            <div className="space-y-3 rounded-2xl border border-cyan-200 bg-white p-5">
              <div className="h-5 w-40 animate-pulse rounded bg-gray-200" />
              <div className="h-4 w-full animate-pulse rounded bg-gray-200" />
              <div className="h-4 w-5/6 animate-pulse rounded bg-gray-200" />
              <div className="h-4 w-2/3 animate-pulse rounded bg-gray-200" />
            </div>

            <div className="space-y-3 rounded-2xl border border-cyan-200 bg-white p-5">
              <div className="h-5 w-36 animate-pulse rounded bg-gray-200" />
              <div className="grid grid-cols-1 gap-3 md:grid-cols-2">
                {Array.from({ length: 4 }).map((_, i) => (
                  <div key={i} className="h-10 w-full animate-pulse rounded-lg bg-gray-200" />
                ))}
              </div>
            </div>

            <div className="space-y-3 rounded-2xl border border-cyan-200 bg-white p-5">
              <div className="h-5 w-28 animate-pulse rounded bg-gray-200" />
              <div className="grid grid-cols-2 gap-3 md:grid-cols-3">
                {Array.from({ length: 6 }).map((_, i) => (
                  <div key={i} className="h-36 w-full animate-pulse rounded-lg bg-gray-200 md:h-44" />
                ))}
              </div>
            </div>
          </div>

          <aside className="space-y-8">
            <div className="rounded-2xl border border-cyan-200 bg-white p-5">
              <div className="mb-4 h-5 w-40 animate-pulse rounded bg-gray-200" />
              <div className="h-10 w-full animate-pulse rounded-lg bg-gray-200" />
              <div className="mt-3 h-10 w-full animate-pulse rounded-lg bg-gray-200" />
              <div className="mt-3 h-10 w-full animate-pulse rounded-lg bg-gray-200" />
            </div>

            <div className="rounded-2xl border border-cyan-200 bg-white p-5">
              <div className="mb-4 h-5 w-40 animate-pulse rounded bg-gray-200" />
              {Array.from({ length: 6 }).map((_, i) => (
                <div key={i} className="mb-2 h-4 w-full animate-pulse rounded bg-gray-200" />
              ))}
              <div className="mt-4 flex flex-wrap gap-2">
                {Array.from({ length: 6 }).map((_, i) => (
                  <div key={i} className="h-6 w-20 animate-pulse rounded-full bg-gray-200" />
                ))}
              </div>
            </div>
          </aside>
        </div>
      </section>
    </main>
  )
}
