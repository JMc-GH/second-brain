import { useEffect, useState } from "react";

import { ChatPanel } from "./components/ChatPanel";
import { Dashboard } from "./components/Dashboard";
import { DocumentUpload } from "./components/DocumentUpload";
import { ingestNews, listDocuments } from "./lib/api";

type Document = {
  id: number;
  filename: string;
  source_type: string;
  created_at: string;
};

function App() {
  const [documents, setDocuments] = useState<Document[]>([]);
  const [loadingDocs, setLoadingDocs] = useState(false);
  const [page, setPage] = useState<"workspace" | "dashboard">("dashboard");

  const loadDocuments = async () => {
    try {
      setLoadingDocs(true);
      const docs = await listDocuments();
      setDocuments(docs);
    } finally {
      setLoadingDocs(false);
    }
  };

  useEffect(() => {
    loadDocuments();
  }, []);

  async function handleIngestNews() {
    await ingestNews();
    await loadDocuments();
  }

  if (page === "dashboard") {
    return (
      <>
        <nav className="mx-auto mt-4 flex max-w-5xl justify-end gap-2 px-6">
          <button
            className="rounded-md border border-cyan-500 bg-cyan-500/10 px-3 py-1.5 text-sm font-semibold text-cyan-300"
            onClick={() => setPage("dashboard")}
          >
            Dashboard
          </button>
          <button
            className="rounded-md border border-slate-700 px-3 py-1.5 text-sm font-semibold text-slate-200 hover:border-cyan-500"
            onClick={() => setPage("workspace")}
          >
            Workspace
          </button>
        </nav>
        <Dashboard />
      </>
    );
  }

  return (
    <main className="mx-auto min-h-screen max-w-5xl space-y-6 p-6">
      <nav className="flex justify-end gap-2">
        <button
          className="rounded-md border border-slate-700 px-3 py-1.5 text-sm font-semibold text-slate-200 hover:border-cyan-500"
          onClick={() => setPage("dashboard")}
        >
          Dashboard
        </button>
        <button
          className="rounded-md border border-cyan-500 bg-cyan-500/10 px-3 py-1.5 text-sm font-semibold text-cyan-300"
          onClick={() => setPage("workspace")}
        >
          Workspace
        </button>
      </nav>

      <header>
        <p className="text-cyan-400">Second Brain</p>
        <h1 className="text-3xl font-bold">Document + News AI Workspace</h1>
      </header>

      <div className="grid gap-6 md:grid-cols-2">
        <DocumentUpload onUploaded={loadDocuments} />

        <section className="rounded-xl border border-slate-800 bg-slate-900/70 p-4">
          <h2 className="text-lg font-semibold">External sources</h2>
          <p className="mt-2 text-sm text-slate-300">
            Pull fresh RSS headlines into your context store.
          </p>
          <button
            className="mt-3 rounded-md border border-cyan-500 px-4 py-2 text-sm font-semibold text-cyan-300 hover:bg-cyan-500/10"
            onClick={handleIngestNews}
          >
            Ingest default feeds
          </button>
        </section>
      </div>

      <ChatPanel />

      <section className="rounded-xl border border-slate-800 bg-slate-900/70 p-4">
        <h2 className="text-lg font-semibold">Indexed context ({documents.length})</h2>
        {loadingDocs ? (
          <p className="mt-2 text-sm text-slate-300">Loading...</p>
        ) : (
          <ul className="mt-3 space-y-2 text-sm">
            {documents.map((document) => (
              <li key={document.id} className="rounded-md border border-slate-800 bg-slate-950 p-3">
                <p className="font-medium">{document.filename}</p>
                <p className="text-xs text-slate-400">
                  {document.source_type} · {new Date(document.created_at).toLocaleString()}
                </p>
              </li>
            ))}
          </ul>
        )}
      </section>
    </main>
  );
}

export default App;
