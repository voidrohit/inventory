import { apiClient } from "../lib/apiClient";

export async function listOrders() {
  const { data } = await apiClient.get("/orders");
  return data;
}

export async function getOrder(id) {
  const { data } = await apiClient.get(`/orders/${id}`);
  return data;
}

export async function createOrder(payload) {
  const { data } = await apiClient.post("/orders", payload);
  return data;
}

export async function updateOrderStatus(id, status) {
  const { data } = await apiClient.patch(`/orders/${id}/status`, { status });
  return data;
}

export async function deleteOrder(id) {
  await apiClient.delete(`/orders/${id}`);
}
