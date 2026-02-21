import { useState } from "react";

import { uploadDocument } from "../lib/api";

type Props = {
  onUploaded: () => void;
};

export function DocumentUpload({ onUploaded }: Props) {
  const [uploading, setUploading] = useState(false);
  const [message, setMessage] = useState<string>("");

  async function handleChange(event: React.ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0];
    if (!file) return;

    try {
      setUploading(true);
      setMessage("Uploading...");
      await uploadDocument(file);
      setMessage("Upload complete");
      onUploaded();
    } catch (error) {
      setMessage((error as Error).message);
    } finally {
      setUploading(false);
    }
  }

  return (
    <section className="rounded-xl border border-slate-800 bg-slate-900/70 p-4">
      <h2 className="text-lg font-semibold">Upload documents</h2>
      <input
        className="mt-3 block w-full cursor-pointer rounded-md border border-slate-700 bg-slate-950 p-2 text-sm"
        type="file"
        accept=".txt,.md,.csv,.json"
        onChange={handleChange}
        disabled={uploading}
      />
      {message && <p className="mt-2 text-sm text-slate-300">{message}</p>}
    </section>
  );
}
