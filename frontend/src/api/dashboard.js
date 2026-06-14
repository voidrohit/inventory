import { apiClient } from "../lib/apiClient";

export async function fetchDashboardSummary() {
  const { data } = await apiClient.get("/dashboard/summary");
  return data;
}
