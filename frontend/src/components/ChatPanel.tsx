import { FormEvent, useState } from "react";

import { askQuestion } from "../lib/api";

export function ChatPanel() {
  const [question, setQuestion] = useState("");
  const [answer, setAnswer] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!question) return;

    try {
      setLoading(true);
      const response = await askQuestion(question);
      setAnswer(response.answer);
    } catch (error) {
      setAnswer((error as Error).message);
    } finally {
      setLoading(false);
    }
  }

  return (
    <section className="rounded-xl border border-slate-800 bg-slate-900/70 p-4">
      <h2 className="text-lg font-semibold">Ask your second brain</h2>
      <form onSubmit={handleSubmit} className="mt-3 space-y-3">
        <textarea
          value={question}
          onChange={(event) => setQuestion(event.target.value)}
          className="h-28 w-full rounded-md border border-slate-700 bg-slate-950 p-3 text-sm"
          placeholder="What are the main themes in my docs and latest news?"
        />
        <button
          type="submit"
          disabled={loading}
          className="rounded-md bg-cyan-500 px-4 py-2 text-sm font-semibold text-slate-950 hover:bg-cyan-400 disabled:opacity-60"
        >
          {loading ? "Thinking..." : "Ask"}
        </button>
      </form>
      {answer && (
        <pre className="mt-4 whitespace-pre-wrap rounded-md border border-slate-700 bg-slate-950 p-3 text-sm text-slate-200">
          {answer}
        </pre>
      )}
    </section>
  );
}
