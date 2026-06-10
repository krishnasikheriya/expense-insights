import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";

export function useCategories() {
  return useQuery({
    queryKey: ["categories"],
    // TODO: provide the queryFn to fetch from "/api/categories"
    queryFn: async () => { 
        return []; 
    }, 
  });
}

export function useCreateCategory() {
  const queryClient = useQueryClient();

  return useMutation({
    // TODO: Provide the mutationFn that POSTs to "/api/categories"
    mutationFn: async (newCategory: { name: string; color?: string }) => {
      // ...
    },
    onSuccess: () => {
      // TODO: Invalidate the "categories" query to trigger a refetch
      // queryClient.invalidateQueries({ queryKey: ["categories"] });
    },
  });
}

export function useDeleteCategory() {
  const queryClient = useQueryClient();

  return useMutation({
    // TODO: Provide mutationFn that sends a DELETE request to `/api/categories/${id}`
    mutationFn: async (id: string) => {
      // ...
    },
    onSuccess: () => {
      // TODO: Invalidate the "categories" query
    },
  });
}
