import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

import { createOrder, deleteOrder, getOrder, listOrders } from "../api/orders";

const KEY = ["orders"];

export function useOrders() {
  return useQuery({ queryKey: KEY, queryFn: listOrders });
}

export function useOrder(id) {
  return useQuery({
    queryKey: [...KEY, id],
    queryFn: () => getOrder(id),
    enabled: Boolean(id),
  });
}

export function useCreateOrder() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: createOrder,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: KEY });
      queryClient.invalidateQueries({ queryKey: ["products"] });
      queryClient.invalidateQueries({ queryKey: ["dashboard"] });
    },
  });
}

export function useDeleteOrder() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: deleteOrder,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: KEY });
      queryClient.invalidateQueries({ queryKey: ["products"] });
      queryClient.invalidateQueries({ queryKey: ["dashboard"] });
    },
  });
}
