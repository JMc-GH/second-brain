import { useEffect, useState } from "react";

import { getUkHeadlines } from "../lib/api";

type Headline = {
  title: string;
  link: string;
  source: string;
};

export function Dashboard() {
  const [headlines, setHeadlines] = useState<Headline[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadHeadlines = async () => {
      try {
        setLoading(true);
        setError(null);
        const items = await getUkHeadlines(6);
        setHeadlines(items);
      } catch (err) {
        setError(err instanceof Error ? err.message : "Failed to load headlines");
      } finally {
        setLoading(false);
      }
    };

    loadHeadlines();
  }, []);

  return (
    <main className="mx-auto min-h-screen max-w-5xl space-y-6 p-6">
      <header>
        <p className="text-cyan-400">Second Brain</p>
        <h1 className="text-3xl font-bold">Dashboard</h1>
        <p className="mt-1 text-sm text-slate-300">Live UK headlines ticker</p>
      </header>

      <section className="overflow-hidden rounded-xl border border-slate-800 bg-slate-900/70 p-4">
        <h2 className="text-lg font-semibold">UK News Ticker</h2>

        {loading ? (
          <p className="mt-3 text-sm text-slate-300">Loading headlines...</p>
        ) : error ? (
          <p className="mt-3 text-sm text-rose-300">{error}</p>
        ) : headlines.length === 0 ? (
          <p className="mt-3 text-sm text-slate-300">No headlines available.</p>
        ) : (
          <div className="relative mt-4 overflow-hidden whitespace-nowrap rounded-md border border-slate-700 bg-slate-950 py-2">
            <div className="animate-ticker inline-block">
              {[...headlines, ...headlines].map((headline, index) => (
                <span key={`${headline.link}-${index}`} className="mx-6 inline-flex items-center gap-2 text-sm">
                  <span className="rounded bg-cyan-500/20 px-2 py-0.5 text-xs text-cyan-300">{headline.source}</span>
                  <a
                    className="text-slate-100 hover:text-cyan-300"
                    href={headline.link}
                    rel="noreferrer"
                    target="_blank"
                  >
                    {headline.title}
                  </a>
                </span>
              ))}
            </div>
          </div>
        )}
      </section>
    </main>
  );
}
