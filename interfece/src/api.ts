const API_BASE_URL =
  import.meta.env.VITE_API_URL ||
  "http://localhost:5000/api";

export interface Lead {
  id: string;
  name: string;
  mobile: string;
  pincode: string;
  product: string;
  source: string;
  status: "New" | "Contacted" | "Converted" | "Lost";
  dealer: string;
  dealerId?: string;
  dealerCity?: string;
  createdOn?: string | { _seconds?: number };
}

interface ApiResult<T> {
  success: boolean;
  message?: string;
  data?: T;
}

async function request<T>(
  url: string,
  options?: RequestInit
): Promise<ApiResult<T>> {
  const response = await fetch(`${API_BASE_URL}${url}`, {
    ...options,
    headers: {
      "Content-Type": "application/json",
      ...options?.headers,
    },
  });

  const result = await response.json();

  if (!response.ok) {
    throw new Error(result.message || "Request failed");
  }

  return result;
}

export async function checkBackend() {
  return request<never>("/health");
}

export async function getLeads(): Promise<Lead[]> {
  const result = await request<Lead[]>("/leads");
  return result.data || [];
}

export async function createLead(lead: {
  name: string;
  mobile: string;
  pincode: string;
  product: string;
  source: string;
}) {
  return request<Lead>("/leads", {
    method: "POST",
    body: JSON.stringify(lead),
  });
}

export async function updateLeadStatus(
  id: string,
  status: Lead["status"]
) {
  return request<never>(`/leads/${encodeURIComponent(id)}/status`, {
    method: "PATCH",
    body: JSON.stringify({ status }),
  });
}

export async function importLegacyLeads() {
  return request<{
    totalRows: number;
    reportedRows: number;
    reportPath: string;
  }>("/import-legacy", {
    method: "POST",
  });
}

export async function deleteLead(id: string) {
  return request<never>(
    `/leads/${encodeURIComponent(id)}`,
    { method: "DELETE" }
  );
}