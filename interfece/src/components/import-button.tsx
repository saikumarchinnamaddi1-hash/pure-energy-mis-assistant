import { useState } from "react";
import { importLegacyLeads } from "../api";

interface Props {
  onImported: () => void;
}

export default function ImportButton({ onImported }: Props) {
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  async function handleImport() {
    const confirmed = window.confirm(
      "Import legacy leads from CSV into Firestore?"
    );

    if (!confirmed) return;

    setLoading(true);
    setMessage("Importing leads...");

    try {
      const result = await importLegacyLeads();
      const data = result.data;

      setMessage(
        `${result.message}. Input rows: ${data?.totalRows ?? 0}, report rows: ${data?.reportedRows ?? 0}.`
      );

      onImported();
    } catch (error) {
      setMessage(
        error instanceof Error ? error.message : "Import failed"
      );
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="import-controls">
      <button
        type="button"
        onClick={handleImport}
        disabled={loading}
      >
        {loading ? "Importing..." : "Import Legacy Leads"}
      </button>

      {message && <p role="status">{message}</p>}
    </div>
  );
}