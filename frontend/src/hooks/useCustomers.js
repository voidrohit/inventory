import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

import { createCustomer, deleteCustomer, listCustomers } from "../api/customers";

const KEY = ["customers"];

export function useCustomers() {
  return useQuery({ queryKey: KEY, queryFn: listCustomers });
}

export function useCreateCustomer() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: createCustomer,
    onSuccess: () => queryClient.invalidateQueries({ queryKey: KEY }),
  });
}

export function useDeleteCustomer() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: deleteCustomer,
    onSuccess: () => queryClient.invalidateQueries({ queryKey: KEY }),
  });
}
