import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";

export function useCategories() {
  return useQuery({
    queryKey: ["categories"],
    // TODO: provide the queryFn to fetch from "/api/categories"
    queryFn: async () => { 
        const res = await fetch("/api/categories");
        if(!res.ok) throw new Error("Failed to fetch categories");
        return res.json(); 
    }, 
  });
}

export function useCreateCategory() {
  const queryClient = useQueryClient();

  return useMutation({
    // TODO: Provide the mutationFn that POSTs to "/api/categories"
    mutationFn: async (newCategory: { name: string; color?: string }) => {
      const res = await fetch("/api/categories", {
        method: "POST",
        headers: { 'Content-Type': "application/json"},
        body: JSON.stringify(newCategory),
      })

      if (!res.ok) throw new Error("Failed to create category");
      return res.json();
    },
    onSuccess: () => {
      // TODO: Invalidate the "categories" query to trigger a refetch
      queryClient.invalidateQueries({ queryKey: ["categories"] });
    },
  });
}

export function useDeleteCategory() {
  const queryClient = useQueryClient();

  return useMutation({
    // TODO: Provide mutationFn that sends a DELETE request to `/api/categories/${id}`
    mutationFn: async (id: string) => {
      const res = await fetch(`/api/categories/${id}`, {
        method: "DELETE",
      });
      if(!res.ok) throw new Error("Failed to delete category");
      return res.json();
    },
    onSuccess: () => {
      // TODO: Invalidate the "categories" query
      queryClient.invalidateQueries({ queryKey: ["categories"]})
    },
  });
}
