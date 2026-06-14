import { apiClient } from "../lib/apiClient";

export async function listProducts() {
  const { data } = await apiClient.get("/products");
  return data;
}

export async function createProduct(payload) {
  const { data } = await apiClient.post("/products", payload);
  return data;
}

export async function updateProduct(id, payload) {
  const { data } = await apiClient.put(`/products/${id}`, payload);
  return data;
}

export async function deleteProduct(id) {
  await apiClient.delete(`/products/${id}`);
}
