import { useState } from "react";
import { checkBackend } from "../api";

export default function BackendTest() {
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);

  async function testConnection() {
    setLoading(true);

    try {
      const result = await checkBackend();
      setMessage(result.message || "Backend connected successfully");
    } catch (error) {
      setMessage(
        error instanceof Error
          ? error.message
          : "Backend connection failed"
      );
    } finally {
      setLoading(false);
    }
  }

  return (
    <div>
      <button type="button" onClick={testConnection} disabled={loading}>
        {loading ? "Checking..." : "Test Backend"}
      </button>
      <p>{message}</p>
    </div>
  );
}